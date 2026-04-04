import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
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
    path: '/graph',
    name: 'Graph',
    component: () => import('../views/GraphView.vue'),
    meta: { title: 'Graph' },
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
    // 在 auth store 中检查登录状态（懒加载避免循环依赖）
    const userJson = sessionStorage.getItem('sb-user')
    if (!userJson) {
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
