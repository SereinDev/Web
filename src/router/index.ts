import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/HomeView.vue';
import { name } from '@/utils/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    meta: {
      title: '总览',
    },
    path: '/overview',
    name: 'overview',
    component: Home,
  },
  {
    meta: {
      title: '服务器',
    },
    path: '/servers',
    name: 'servers',
    component: () => import('@/views/ServersView.vue'),
  },
  {
    meta: {
      title: '服务器',
    },
    path: '/servers/:id',
    name: 'server',
    component: () => import('@/views/ServerView.vue'),
  },
  {
    meta: {
      title: '编辑配置',
    },
    path: '/servers/:id/configuration',
    name: 'congiguration',
    component: () => import('@/views/ConfigurationView.vue'),
  },
  {
    meta: {
      title: '匹配',
    },
    path: '/matches',
    name: 'matches',
    component: () => import('@/views/MatchView.vue'),
  },
  {
    meta: {
      title: '关于',
    },
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    meta: {
      title: '登录',
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    meta: {
      title: '错误',
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue'),
  },
  {
    meta: {
      title: '404',
    },
    path: '/:path(.*)*',
    name: 'error',
    component: () => import('@/views/ErrorView.vue'),
    props: {
      message: '404 Not Found',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} · ${name}` : name;
});

export default router;
