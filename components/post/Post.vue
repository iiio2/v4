<script setup lang="ts">
import type { Post } from '~/schemas/post'
import { defineAsyncComponent, markRaw, type Component } from 'vue'
import type { DefineComponent } from 'vue'
import PostSkeleton from '../common/PostSkeleton.vue'
import ErrorBoundary from '../common/ErrorBoundary.vue'

const NuxtLink = resolveComponent('NuxtLink')

interface Props {
  /** The post data including author, content, and stats */
  post: Post
  /** Whether the post is displayed standalone or in a list */
  standalone?: boolean
}

const props = defineProps<Props>()
const emits = defineEmits(['like', 'share', 'comment'])

const { components, getComponentName } = usePostComponent()
const route = useRoute()

const getAsyncComponent = (type: Post['type']) => {
  const componentName = getComponentName(type)
  const component = components[componentName]

  return defineAsyncComponent({
    loader: async () => {
      const comp = await component()
      return markRaw(comp)
    },
    loadingComponent: PostSkeleton,
    errorComponent: ErrorBoundary,
  })
}

const isModalOpen = ref(false)

function openModal(event: MouseEvent) {
  if (event.metaKey || event.ctrlKey) {
    return
  }

  event.preventDefault()
  isModalOpen.value = true
  history.pushState({}, '', `/post/${props.post.id}`)
}

function closeModal() {
  isModalOpen.value = false
  history.back()
}
</script>

<template>
  <div class="bg-background rounded-lg shadow-sm border border-border">
    <ErrorBoundary>
      <PostHeader
        :author="post.author"
        :timestamp="post.timestamp"
        :type="post.type"
      />

      <Suspense>
        <template #default>
          <a
            v-if="!standalone"
            :href="`/post/${post.id}`"
            @click="openModal"
            class="block"
          >
            <component
              :is="getAsyncComponent(post.type)"
              :content="post.content as any"
            />
          </a>
          <div v-else class="block">
            <component
              :is="getAsyncComponent(post.type)"
              :content="post.content as any"
            />
          </div>
        </template>
        <template #fallback>
          <PostSkeleton />
        </template>
      </Suspense>

      <PostTags v-if="post.content.tags" :tags="post.content.tags" />
      <PostActions :stats="post.stats" :type="post.type" />
    </ErrorBoundary>
  </div>

  <Dialog :open="isModalOpen" @update:open="closeModal">
    <DialogContent
      class="container max-w-xl grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
    >
      <DialogHeader class="p-6 pb-0">
        <DialogTitle>Post</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4 overflow-y-auto px-6">
        <div class="flex flex-col justify-between">
          <PostView :post="post" />
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
