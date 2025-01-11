<script setup lang="ts">
import AsideMenuItem from '@/components/AsideMenuItem.vue';
import AsideMenuList from '@/components/AsideMenuList.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import { name } from '@/utils/constants';
import {
  mdiClose,
  mdiCogs,
  mdiInformation,
  mdiInformationBoxOutline,
  mdiInformationOutline,
  mdiInformationSlabCircle,
  mdiInformationVariantCircle,
} from '@mdi/js';
import { computed } from 'vue';

defineProps({
  menu: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['menu-click', 'aside-lg-close-click']);

const bottomItem = computed(() => ({
  label: '关于',
  icon: mdiInformationOutline,
  to: '/about',
}));

const menuClick = (event, item) => {
  emit('menu-click', event, item);
};

const asideLgCloseClick = (event) => {
  emit('aside-lg-close-click', event);
};
</script>

<template>
  <aside
    id="aside"
    class="lg:py-2 lg:pl-2 w-60 fixed flex z-40 top-0 h-screen transition-position overflow-hidden"
  >
    <div
      class="aside lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900"
    >
      <div
        class="aside-brand flex flex-row h-14 items-center justify-between dark:bg-slate-900"
      >
        <div
          class="flex-1 xl:pl-0 flex justify-center items-center cursor-pointer"
          @click="$router.push('/overview')"
        >
          <img
            src="/favicon.png"
            class="inline mr-3 select-none"
            style="image-rendering: pixelated; width: 27px; height: 27px"
          />
          <b class="font-black break-keep select-none">{{ name }}</b>
        </div>
        <button
          class="hidden lg:inline-block xl:hidden p-3"
          @click.prevent="asideLgCloseClick"
        >
          <BaseIcon :path="mdiClose" />
        </button>
      </div>
      <div
        class="flex-1 overflow-y-auto overflow-x-hidden aside-scrollbars dark:aside-scrollbars-[slate]"
      >
        <AsideMenuList :menu="menu" @menu-click="menuClick" />
      </div>

      <ul>
        <AsideMenuItem :item="bottomItem" @menu-click="menuClick" />
      </ul>
    </div>
  </aside>
</template>
