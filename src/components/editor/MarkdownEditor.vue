<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { placeholder as placeholderExt } from '@codemirror/view'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [val: string]
}>()

const container = ref<HTMLElement | null>(null)
let view: EditorView | null = null

// 计算实际 placeholder，默认为"输入内容"
const actualPlaceholder = computed(() => props.placeholder || '输入内容')

onMounted(() => {
  if (!container.value) return

  const extensions: any[] = [
    basicSetup,
    markdown(),
    oneDark,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        emit('update:modelValue', update.state.doc.toString())
      }
    }),
    // 占位符
    placeholderExt(actualPlaceholder.value),
    // 主题样式
    EditorView.theme({
      '&.cm-focused': { outline: 'none' },
      '.cm-content': { 
        minHeight: '600px', 
        fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', 
        fontSize: '14px', 
        lineHeight: '1.7',
        padding: '16px'
      },
      '.cm-placeholder': {
        color: '#666',
        fontStyle: 'normal'
      },
      '&': { 
        borderRadius: '8px', 
        overflow: 'hidden', 
        border: '1px solid #333',
        background: '#1e1e1e'
      },
      '&:focus-within': { 
        borderColor: '#3b82f6', 
        boxShadow: '0 0 0 2px rgba(59,130,246,0.2)' 
      },
    }),
  ]

  view = new EditorView({
    doc: props.modelValue,
    parent: container.value,
    extensions,
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
