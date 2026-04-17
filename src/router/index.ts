import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/skills',
    name: 'Skills',
    component: () => import('../views/SkillList.vue'),
    meta: { title: 'Skills' },
  },
  {
    path: '/skill/:id',
    name: 'SkillDetail',
    component: () => import('../views/SkillDetail.vue'),
    meta: { title: '技能详情' },
  },
  {
    path: '/publish',
    name: 'PublishSkill',
    component: () => import('../views/PublishSkill.vue'),
    meta: { title: '发布技能' },
  },
  {
    path: '/edit/:id',
    name: 'EditSkill',
    component: () => import('../views/EditSkill.vue'),
    meta: { title: '编辑技能', requiresAuth: true },
  },
  {
    path: '/stars',
    name: 'MyStars',
    component: () => import('../views/MyStars.vue'),
    meta: { title: '我的收藏' },
  },
  {
    path: '/box',
    name: 'MyBox',
    component: () => import('../views/MyBox.vue'),
    meta: { title: '我的盒子' },
  },
  {
    path: '/my-skills',
    name: 'MySkills',
    component: () => import('../views/MySkills.vue'),
    meta: { title: '我的发布' },
  },
  {
    path: '/graph',
    name: 'Graph',
    component: () => import('../views/GraphView.vue'),
    meta: { title: 'Graph' },
  },
  {
    path: '/question/:tagKey',
    name: 'QuestionDetail',
    component: () => import('../views/QuestionDetail.vue'),
    meta: { title: '问题详情' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// 路由守卫：需要登录的页面
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    // 本地开发环境临时绕过登录检查
    if (import.meta.env.DEV) {
      next()
      return
    }
    // 检查登录状态：支持 Supabase (sessionStorage) 和 Mock 模式 (localStorage)
    const sbUser = sessionStorage.getItem('sb-user')
    const authStore = localStorage.getItem('auth-store')
    const isLoggedIn = !!sbUser || (authStore && authStore.includes('"isLoggedIn":true'))
    if (!isLoggedIn) {
      // 未登录，回到首页
      next({ path: '/' })
      return
    }
  }
  next()
})

// 更新页面标题
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - Human Hub` : 'Human Hub'
})

export default router
