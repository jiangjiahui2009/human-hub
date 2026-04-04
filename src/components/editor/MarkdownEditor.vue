<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [val: string]
}>()

const container = ref<HTMLElement | null>(null)
let view: EditorView | null = null

onMounted(() => {
  if (!container.value) return

  view = new EditorView({
    doc: props.modelValue,
    parent: container.value,
    extensions: [
      basicSetup,
      markdown(),
      oneDark,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          emit('update:modelValue', update.state.doc.toString())
        }
      }),
      // 占位符（通过装饰实现）
      EditorView.theme({
        '&.cm-focused': { outline: 'none' },
        '.cm-content': { minHeight: '200px', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', fontSize: '13px', lineHeight: '1.6' },
        '&': { borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' },
        '&:focus-within': { borderColor: 'var(--color-primary)', boxShadow: '0 0 0 3px rgba(37,99,235,0.08)' },
      }),
    ],
  })
})

// 外部值变化时同步到编辑器
watch(() => props.modelValue, (newVal) => {
  if (view && view.state.doc.toString() !== newVal) {
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: newVal },
    })
  }
})

onBeforeUnmount(() => {
  view?.destroy()
})
</script>

<template>
  <div ref="container" class="md-editor-wrap" />
</template>

<style scoped>
.md-editor-wrap {
  width: 100%;
}
</style>
