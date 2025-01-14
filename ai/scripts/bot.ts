import dotenv from "dotenv";
import { Telegraf, Context } from "telegraf";
import { Message } from "telegraf/types";
import fs from "fs";
import {
  HistoryMessage,
  ProviderFactory,
  ProviderType,
  BaseLLMProvider,
  LLMError,
} from "./providers";
import { tools } from "./tools";
import { ToolResultBlockParam } from "@anthropic-ai/sdk/resources/messages";

// Load environment variables
dotenv.config();

// Initialize logging
const LOG_DIR = "logs";
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

// Logging function
function logConversation(
  chatId: number,
  type:
    | "user"
    | "system"
    | "llm-request"
    | "llm-response"
    | "bot-response"
    | "tool-execution",
  content: string,
  metadata?: any
) {
  const date = new Date();
  const fileName = `${LOG_DIR}/chat_${date.getFullYear()}-${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.log`;
  const timestamp = date.toISOString();

  let logEntry = `\n[${timestamp}] Chat ID: ${chatId} | Type: ${type}\n`;

  if (metadata) {
    logEntry += `Metadata: ${JSON.stringify(metadata, null, 2)}\n`;
  }

  logEntry += `Content: ${content}\n`;
  logEntry += "----------------------------------------\n";

  fs.appendFileSync(fileName, logEntry);
}

const cursorRules = fs.readFileSync("../.cursorrules", "utf-8");
const systemPrompt = cursorRules;

// "Format response in Telegram HTML",
// "The maximum length of a message is 4096 characters and it must be UTF-8 encoded",

// Initialize LLM provider
const CURRENT_PROVIDER = (process.env.LLM_PROVIDER as ProviderType) || "ollama";
let llmProvider: BaseLLMProvider;

try {
  llmProvider = ProviderFactory.create(CURRENT_PROVIDER, {
    apiKey: process.env[`${CURRENT_PROVIDER.toUpperCase()}_API_KEY`],
    model: process.env[`${CURRENT_PROVIDER.toUpperCase()}_MODEL`],
    host: process.env.OLLAMA_HOST,
  });
} catch (error) {
  console.error(`Failed to initialize ${CURRENT_PROVIDER} provider:`, error);
  process.exit(1);
}

// Initialize bot with token from environment variables
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

// Store conversation history
const conversationHistory = new Map<number, Array<HistoryMessage>>();

// Basic error handling
bot.catch((err: unknown, ctx: Context) => {
  console.error("Telegraf error:", err);
  ctx.reply("Sorry, I encountered an error. Please try again later.");
});

// Helper to get chat history
function getChatHistory(chatId: number) {
  if (!conversationHistory.has(chatId)) {
    conversationHistory.set(chatId, [{ role: "user", content: systemPrompt }]);
  }
  return conversationHistory.get(chatId)!;
}

// Command handlers
bot.command("start", (ctx: Context) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  // Reset conversation history with system prompt
  conversationHistory.set(chatId, [{ role: "user", content: systemPrompt }]);
  logConversation(chatId, "system", "Clearing conversation history");

  const response = `Hi! I am your WeDance AI Secretary. How can I help you today?`;

  // Log the command
  logConversation(chatId, "user", "/start");
  logConversation(chatId, "bot-response", response);

  ctx.reply(response, { parse_mode: "Markdown" });
});

// Command to show current provider
bot.command("provider", (ctx: Context) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const { name, model } = llmProvider.getModelInfo();
  const response = `Current provider: ${name} (${model})`;

  // Log the command
  logConversation(chatId, "user", "/provider");
  logConversation(chatId, "bot-response", response);

  ctx.reply(response);
});

function cleanupTags(text: string, tag: string): string {
  let cleanedText = text;

  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "g");
  cleanedText = cleanedText.replace(regex, "");

  if (!cleanedText.includes(`${tag}>`)) {
    return cleanedText;
  }

  // Handle unclosed tags by removing all text after them
  const unclosedToolIndex = cleanedText.indexOf(`<${tag}>`);
  if (unclosedToolIndex !== -1) {
    cleanedText = cleanedText.substring(0, unclosedToolIndex);
  }

  // Handle unopened tags by removing all text before them
  const unopenedToolIndex = cleanedText.indexOf(`<\/${tag}>`);
  if (unopenedToolIndex !== -1) {
    cleanedText = cleanedText.substring(unopenedToolIndex);
  }

  return cleanedText;
}

function getTagContent(text: string, tag: string): string {
  const matches = text.match(`<${tag}>(.*?)<\/${tag}>`);
  let content = matches ? matches[1] : text;
  content = content.replace(`<${tag}>`, "");
  content = content.replace(`<\/${tag}>`, "");
  content = content.trim();

  return content;
}

async function processMessage(ctx: Context, history: HistoryMessage[]) {
  try {
    if (!ctx.chat?.id) return;

    // Get initial response
    let message = await llmProvider.ask(history, ctx.chat?.id);

    let waitingForToolResponse = false;
    for (const content of message.content) {
      if (content.type === "text") {
        await ctx.sendChatAction("typing");

        let textContent = content.text;
        textContent = cleanupTags(textContent, "role_selection");
        textContent = cleanupTags(textContent, "analysis");
        textContent = cleanupTags(textContent, "tool_selection");

        textContent = getTagContent(textContent, "response");

        history.push({
          role: "assistant",
          content: content.text,
        });

        logConversation(ctx.chat?.id, "bot-response", textContent);

        if (textContent) {
          await ctx.reply(textContent, {
            parse_mode: "HTML",
          });
        }
      }

      if (content.type === "tool_use") {
        await ctx.sendChatAction("typing");

        waitingForToolResponse = true;

        // Add tool_use message to history
        history.push({
          role: "assistant",
          content: [content],
        });

        const toolResponse = await tools[content.name].execute(content.input);

        const toolResult: ToolResultBlockParam = {
          type: "tool_result",
          tool_use_id: content.id,
          content: toolResponse,
        };

        history.push({
          role: "user",
          content: [toolResult],
        });
      }
    }

    if (waitingForToolResponse) {
      await processMessage(ctx, history);
    }
  } catch (error: any) {
    console.error(`${CURRENT_PROVIDER} error:`, error.message);
    let errorMessage = `Sorry, I encountered an error with ${CURRENT_PROVIDER}.`;

    if (error instanceof LLMError) {
      errorMessage += "\n\nTroubleshooting tips:";
      error.getTroubleshooting().forEach((tip) => {
        errorMessage += `\n• ${tip}`;
      });
    }

    await ctx.reply(errorMessage);
  }
}

// Handle messages
bot.on("text", async (ctx: Context) => {
  const chatId = ctx.chat?.id;
  const messageText = (ctx.message as Message.TextMessage).text;

  if (!chatId) return;

  const history = getChatHistory(chatId);
  history.push({ role: "user", content: messageText });

  // Log user message
  logConversation(chatId, "user", messageText);

  processMessage(ctx, history);
});

// Launch bot
async function startBot() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("\n❌ Error: TELEGRAM_BOT_TOKEN is not set in .env file");
    console.log("\n📝 Setup Instructions:");
    console.log("1. Create a bot with @BotFather on Telegram");
    console.log("2. Copy the token you received");
    console.log("3. Create .env file: cp .env.example .env");
    console.log(
      "4. Add your token to .env: TELEGRAM_BOT_TOKEN=your_token_here"
    );
    console.log("\nSee docs/telegram-bot-setup.md for detailed instructions");
    process.exit(1);
  }

  try {
    await bot.launch();
    const { name, model } = llmProvider.getModelInfo();
    console.log("\n✅ Bot is running!");
    console.log(`🤖 Provider: ${name} (${model})`);
    console.log("📚 System prompt loaded from cursorrules");

    if (name === "ollama") {
      console.log("\n💡 Tip: Make sure Ollama is running:");
      console.log("   docker-compose up -d ollama");
      console.log("   docker exec -it ollama ollama pull mistral");
    }
  } catch (error: any) {
    if (error?.response?.error_code === 404) {
      console.error("\n❌ Error: Invalid Telegram bot token");
      console.log("\n🔍 Common issues:");
      console.log("1. Token might be incorrect or expired");
      console.log("2. Bot might have been deleted");
      console.log("3. .env file might not be properly set up");
      console.log("\n📝 To fix:");
      console.log("1. Check your bot with @BotFather");
      console.log("2. Verify the token in your .env file");
      console.log("3. Make sure you copied the entire token");
      console.log("\nSee docs/telegram-bot-setup.md for help");
    } else {
      console.error("\n❌ Failed to start bot:", error.message);
      console.log("\n🔍 Troubleshooting steps in docs/telegram-bot-setup.md");
    }
    process.exit(1);
  }
}

// Start the bot
startBot();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
