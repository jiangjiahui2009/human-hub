<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Skill } from '../../types'

const props = defineProps<{
  skill: Skill
}>()

const router = useRouter()

function goToDetail() {
  router.push(`/skill/${props.skill.id}`)
}
</script>

<template>
  <div class="star-card" @click="goToDetail">
    <h3 class="card-name">{{ skill.name }}</h3>
    <p class="card-summary">{{ skill.summary }}</p>
  </div>
</template>

<style scoped>
.star-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.star-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
  transform: translateY(-2px);
}

.card-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-heading);
  margin-bottom: 8px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-summary {
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
