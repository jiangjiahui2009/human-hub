<script lang="ts">
import MarkdownEditor from '../components/editor/MarkdownEditor.vue'
import Toast from '../components/common/Toast.vue'
</script>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSkillsStore } from '../stores/skills'
import { CATEGORIES, type SkillCategory } from '../lib/categories'
import { ALL_TAG_KEYS, TAG_LABELS, type TagKey } from '../lib/tags'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const store = useSkillsStore()
const skillId = route.params.id as string

const form = reactive({
  name: '',
  summary: '',
  description: '',
  category: '' as SkillCategory | '',
  tags: [] as TagKey[],
})

const loading = ref(true)
const saving = ref(false)
const notFound = ref(false)
const notAuthor = ref(false)
const toastMsg = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')

onMounted(async () => {
  const skill = await store.fetchSkill(skillId)
  if (!skill) {
    notFound.value = true
    loading.value = false
    return
  }

  // 权限检查
  if (auth.isLoggedIn && auth.user?.id !== skill.authorId) {
    notAuthor.value = true
    loading.value = false
    return
  }

  // 填充表单
  form.name = skill.name
  form.summary = skill.summary
  form.description = skill.description
  form.category = (skill.category as SkillCategory) || ''
  form.tags = (skill.tags as TagKey[]) || []
  loading.value = false
})

function canSubmit(): boolean {
  return !!(form.name.trim() && form.summary.trim() && !saving.value)
}

function toggleCategory(cat: SkillCategory) {
  form.category = form.category === cat ? '' : cat
}

function toggleTag(tag: TagKey) {
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  } else {
    form.tags.push(tag)
  }
}

async function handleSubmit() {
  if (!canSubmit()) return

  saving.value = true
  const ok = await store.updateSkill(skillId, {
    name: form.name.trim(),
    summary: form.summary.trim(),
    description: form.description,
    category: form.category || null,
    tags: form.tags.length > 0 ? form.tags : null,
  })

  saving.value = false

  if (ok) {
    showToast('更新成功 ✨', 'success')
    router.push('/my-skills')
  } else {
    showToast('更新失败，请重试', 'error')
  }
}

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
  toastMsg.value = msg
  toastType.value = type
}
</script>

<template>
  <div class="page-container">
    <Toast :message="toastMsg" :type="toastType" />

    <!-- 加载中 -->
    <div v-if="loading" class="loading-state">加载中...</div>

    <!-- 不存在 -->
    <div v-else-if="notFound" class="empty-state">
      <h3>技能不存在</h3>
      <p>可能已被删除或链接无效</p>
    </div>

    <!-- 无权限 -->
    <div v-else-if="notAuthor" class="empty-state">
      <h3>无权编辑</h3>
      <p>只有技能的作者才能编辑</p>
    </div>

    <!-- 编辑表单 -->
    <template v-else>
      <div class="page-header">
        <h1 class="page-title">编辑技能</h1>
        <p class="page-subtitle">修改 {{ form.name }} 的内容</p>
      </div>

      <form class="edit-form" @submit.prevent="handleSubmit">
        <div class="field-group">
          <label class="field-label">技能名称 <span class="required">*</span></label>
          <input v-model="form.name" type="text" class="field-input" maxlength="100" />
        </div>

        <div class="field-group">
          <label class="field-label">摘要 <span class="required">*</span></label>
          <textarea v-model="form.summary" class="field-textarea" rows="3" maxlength="300" />
          <p class="field-count">{{ form.summary.length }}/300</p>
        </div>

        <div class="field-group">
          <label class="field-label">使用说明</label>
          <MarkdownEditor v-model="form.description" />
        </div>

        <!-- 技能类型 -->
        <div class="field-group">
          <label class="field-label">技能类型</label>
          <div class="category-list">
            <button
              v-for="cat in CATEGORIES"
              :key="cat.value"
              type="button"
              class="category-tag"
              :class="{ active: form.category === cat.value }"
              :style="form.category === cat.value ? { background: cat.color + '20', color: cat.color, borderColor: cat.color } : {}"
              @click="toggleCategory(cat.value)"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>

        <!-- 问题场景 -->
        <div class="field-group">
          <label class="field-label">问题场景</label>
          <div class="tag-list">
            <button
              v-for="tag in ALL_TAG_KEYS"
              :key="tag"
              type="button"
              class="tag-btn"
              :class="{ active: form.tags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              {{ TAG_LABELS[tag] }}
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="$router.back()">取消</button>
          <button type="submit" class="btn btn-primary" :disabled="!canSubmit() || saving">
            {{ saving ? '保存中...' : '保存更改' }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<style scoped>
/* 复用 Publish 的样式 */
.page-container { max-width: 720px; margin: 0 auto; padding: 32px 20px 80px; }
.page-header { margin-bottom: 28px; }
.page-title { font-size: 24px; font-weight: 700; color: var(--color-text-heading); }
.page-subtitle { font-size: 14px; color: var(--color-text-muted); margin-top: 4px; }

.edit-form { display: flex; flex-direction: column; gap: 22px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 14px; font-weight: 600; color: var(--color-text-heading); }
.required { color: #ef4444; margin-left: 2px; }

.field-input, .field-textarea {
  width: 100%; padding: 10px 14px; border: 1px solid var(--color-border);
  border-radius: 10px; font-size: 14px; font-family: inherit;
  color: var(--color-text-heading); background: var(--color-card-bg);
  outline: none; transition: all 0.2s;
}
.field-input:focus, .field-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
}
.field-input.error { border-color: #ef4444; }
.field-textarea { resize: vertical; min-height: 80px; line-height: 1.55; }
.field-error { font-size: 12px; color: #ef4444; }
.field-hint { font-size: 12px; color: var(--color-text-muted); }
.field-count { text-align: right; font-size: 11px; color: var(--color-text-muted); }

/* 技能类型 */
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.category-tag {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  color: var(--color-text-muted);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.category-tag:hover {
  border-color: #d1d5db;
}
.category-tag.active {
  font-weight: 500;
}

/* 问题场景 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.tag-btn:hover {
  border-color: #d1d5db;
  color: var(--color-text);
}
.tag-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 16px; border-top: 1px solid var(--color-border); }
.btn {
  padding: 9px 24px; border-radius: 9px; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; border: none;
}
.btn-primary { 
  background: transparent; 
  color: #374151; 
  border: 1px solid #d1d5db; 
}
.btn-primary:hover:not(:disabled) { 
  background: #f3f4f6; 
  border-color: #9ca3af; 
}
.btn-primary:disabled { opacity: 0.5; cursor: default; }
.btn-secondary { background: transparent; color: var(--color-text-muted); border: 1px solid var(--color-border); }
.btn-secondary:hover { background: rgba(0,0,0,0.03); color: var(--color-text); }

.empty-state, .loading-state { text-align: center; padding: 80px 20px; }
.loading-state { color: var(--color-text-muted); }
.empty-state h3 { font-size: 17px; font-weight: 600; margin-bottom: 6px; }
.empty-state p { color: var(--color-text-muted); font-size: 13px; }
</style>
