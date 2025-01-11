import { mdiGithub, mdiLogout, mdiThemeLightDark } from '@mdi/js';
import { repoUrl } from './utils/constants';

export default [
  {
    icon: mdiThemeLightDark,
    label: '切换主题',
    isDesktopNoLabel: true,
    isToggleLightDark: true,
  },
  {
    icon: mdiGithub,
    label: 'GitHub',
    isDesktopNoLabel: true,
    href: repoUrl,
    target: '_blank',
  },
  {
    icon: mdiLogout,
    label: '登出',
    isDesktopNoLabel: true,
    isLogout: true,
  },
];
