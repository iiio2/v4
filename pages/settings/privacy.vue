<script setup lang="ts">
definePageMeta({
  layout: 'settings',
  middleware: ['auth'],
})
</script>

<template>
  <PrivacySettings />
</template>
