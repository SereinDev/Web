import {
  mdiAccountLockOutline,
  mdiClockOutline,
  mdiCogs,
  mdiConnection,
  mdiFormatListBulleted,
  mdiKeyOutline,
  mdiMonitorDashboard,
  mdiPuzzleOutline,
  mdiServerOutline,
} from '@mdi/js';

export default [
  {
    to: '/overview',
    label: '总览',
    icon: mdiMonitorDashboard,
  },
  {
    to: '/servers',
    label: '服务器',
    icon: mdiServerOutline,
  },
  {
    to: '/matches',
    label: '匹配',
    icon: mdiFormatListBulleted,
  },
  {
    to: '/schedules',
    label: '定时任务',
    icon: mdiClockOutline,
  },
  {
    to: '/connection',
    label: '连接',
    icon: mdiConnection,
  },
  {
    to: '/plugins',
    label: '插件',
    icon: mdiPuzzleOutline,
  },
  {
    // to: '/permissions',
    label: '权限组',
    icon: mdiKeyOutline,
  },
  {
    // to: '/binds',
    label: '绑定',
    icon: mdiAccountLockOutline,
  },
  {
    label: '设置',
    icon: mdiCogs,
    menu: [
      {
        // to: '/settings/connection',
        label: '连接',
      },
      {
        // to: '/settings/reaction',
        label: '反应',
      },
      {
        // to: '/settings/webapi',
        label: '网页服务器',
      },
      {
        // to: '/settings/app',
        label: '应用',
      },
      {
        // to: '/settings/web',
        label: '网页',
      },
    ],
  },
];
