<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info'
}>()

const show = ref(true)
const visible = ref(false)

// 入场动画延迟
setTimeout(() => { visible.value = true }, 10)

watch(() => props.message, () => {
  show.value = true
  visible.value = false
  setTimeout(() => { visible.value = true }, 10)
})

function dismiss() {
  visible.value = false
  setTimeout(() => { show.value = false }, 200)
}

defineExpose({ dismiss })
</script>

<template>
  <transition name="toast">
    <div v-if="show && message" class="toast" :class="[type || 'success', { visible }]">
      <span class="toast-msg">{{ message }}</span>
      <button class="toast-close" @click="dismiss">&times;</button>
    </div>
  </transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  z-index: 9999;
  opacity: 0;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: 90vw;
}
.toast.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.toast.success { background: #059669; }
.toast.error { background: #dc2626; }
.toast.info { background: #2563eb; }

.toast-close {
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0 2px;
}
.toast-close:hover { color: #fff; }

.toast-enter-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-leave-active { transition: all 0.2s ease-in; }
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
