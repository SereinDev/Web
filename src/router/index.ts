import { name } from '@/utils/constants';
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router';

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
    component: () => import('@/views/HomeView.vue'),
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
    name: 'configuration',
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
      title: '匹配',
    },
    path: '/schedules',
    name: 'schedules',
    component: () => import('@/views/ScheduleView.vue'),
  },
  {
    meta: {
      title: '连接',
    },
    path: '/connection',
    name: 'connection',
    component: () => import('@/views/ConnectionView.vue'),
  },
  {
    meta: {
      title: '插件',
    },
    path: '/plugins',
    name: 'plugins',
    component: () => import('@/views/PluginsView.vue'),
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
      title: '连接设置',
    },
    path: '/settings/connection',
    name: 'settings.connection',
    component: () => import('@/views/settings/ConnectionSettingView.vue'),
  },
  {
    meta: {
      title: '反应设置',
    },
    path: '/settings/reaction',
    name: 'settings.reaction',
    component: () => import('@/views/settings/ReactionSettingView.vue'),
  },
  {
    meta: {
      title: '网页服务器设置',
    },
    path: '/settings/webapi',
    name: 'settings.webapi',
    component: () => import('@/views/settings/WebApiSettingView.vue'),
  },
  {
    meta: {
      title: '应用设置',
    },
    path: '/settings/application',
    name: 'settings.application',
    component: () => import('@/views/settings/AppSettingView.vue'),
  },
  {
    meta: {
      title: '网页控制台设置',
    },
    path: '/settings/local',
    name: 'settings.local',
    component: () => import('@/views/settings/LocalSettingView.vue'),
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
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · ${name}` : name;
});

export default router;
