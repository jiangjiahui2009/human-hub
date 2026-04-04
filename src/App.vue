<script setup lang="ts">
import NavBar from './components/layout/NavBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--color-bg)]">
    <NavBar />
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>
