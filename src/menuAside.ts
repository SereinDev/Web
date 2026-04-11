import {
  mdiCogs,
  mdiConnection,
  mdiMonitorDashboard,
  mdiPuzzle,
  mdiRobot,
  mdiServer,
} from '@mdi/js';

export default [
  {
    to: 'overview',
    label: '总览',
    icon: mdiMonitorDashboard,
  },
  {
    to: 'servers',
    label: '服务器',
    icon: mdiServer,
  },
  {
    to: 'automations',
    label: '自动化任务',
    icon: mdiRobot,
  },
  {
    to: 'connection',
    label: '连接',
    icon: mdiConnection,
  },
  {
    to: 'plugins',
    label: '插件',
    icon: mdiPuzzle,
  },
  // {
  //   to: '/permissions',
  //   label: '权限组',
  //   icon: mdiKeyOutline,
  // },
  // {
  //   to: '/binds',
  //   label: '绑定',
  //   icon: mdiAccountLockOutline,
  // },
  {
    label: '设置',
    icon: mdiCogs,
    menu: [
      {
        to: 'settings.connection',
        label: '连接',
      },
      {
        to: 'settings.webapi',
        label: '网页服务器',
      },
      {
        to: 'settings.application',
        label: '应用',
      },
      {
        to: 'settings.local',
        label: '网页',
      },
    ],
  },
];
