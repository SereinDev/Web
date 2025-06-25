<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseLevel from '@/components/BaseLevel.vue';
import CardBox from '@/components/CardBox.vue';
import CardBoxModal from '@/components/CardBoxModal.vue';
import Console from '@/components/Console.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import {
  disablePlugin,
  getPlugins,
  reloadPlugins,
} from '@/services/apis/plugin';
import { packets, pipe } from '@/services/pluginManager';
import { Plugin } from '@/types/plugin';
import {
  mdiAccountGroupOutline,
  mdiCodeJson,
  mdiFileOutline,
  mdiIdentifier,
  mdiInformationOutline,
  mdiPackage,
  mdiPuzzleOutline,
  mdiRefresh,
  mdiReloadAlert,
  mdiStopCircleOutline,
  mdiTagOutline,
  mdiViewListOutline,
} from '@mdi/js';
import { computed, ref } from 'vue';
import { useToast } from 'vue-toastification';

pipe.start();

const isLoading = ref(false);
const isModalInfoActive = ref(false);
const current = ref<Plugin>();
const toast = useToast();
const items = ref<Plugin[]>([]);
const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  items.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1),
  ),
);
const numPages = computed(() => Math.ceil(items.value.length / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

update();

async function update() {
  try {
    isLoading.value = true;
    items.value = Object.entries(await getPlugins())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map((kv) => kv[1]);
  } catch (error) {
    items.value = [];
    toast.error('获取插件列表失败，原因：' + String(error));
  } finally {
    isLoading.value = false;
  }
}

async function disable(id: string) {
  try {
    isLoading.value = true;
    await disablePlugin(id);
    toast.success(`插件${id}已禁用`);
  } catch (error) {
    toast.error(`禁用插件${id}失败，原因：` + String(error));
  } finally {
    isLoading.value = false;
  }
  await update();
}

async function reload() {
  try {
    isLoading.value = true;
    await reloadPlugins();

    toast.success('插件已重新加载');
    items.value = [];
    packets.value = [];
  } catch (error) {
    toast.error('重新加载插件失败，原因：' + String(error));
  }
  setTimeout(update, 1000);
}
</script>
<template>
  <LayoutAuthenticated>
    <CardBoxModal v-model="isModalInfoActive" title="详细信息">
      <div class="grid grid-cols-[16px_80px_1fr] gap-2 mt-2">
        <BaseIcon :path="mdiIdentifier" />
        <span>插件Id</span>
        <code class="select-all">{{ current?.info.id }}</code>

        <BaseIcon :path="mdiTagOutline" />
        <span>标签</span>
        <div>
          <span
            v-for="(tag, i) in current?.info.tags"
            :key="i"
            class="bg-gray-100 dark:bg-gray-700 py-1 px-2 rounded-md mr-2 text-sm"
          >
            {{ ['娱乐', '开发', '工具', '信息', '管理', 'API'][tag] }}
          </span>
        </div>

        <BaseIcon :path="mdiCodeJson" />
        <span>类型</span>
        <span>
          {{ { '1': 'JavaScript', '2': 'Net' }[current?.info.type] || '未知' }}
        </span>

        <BaseIcon :path="mdiFileOutline" />
        <span>入口点</span>
        <code>{{ current?.info.entryFile }}</code>

        <BaseIcon :path="mdiAccountGroupOutline" />
        <span>作者</span>
        <div v-if="current?.info.authors.length">
          <span
            v-for="author in current?.info.authors"
            :key="author.name"
            :title="author.description"
          >
            {{ author.name }}
            <span v-if="author.description"> ({{ author.description }}) </span>
            <br />
          </span>
        </div>

        <div v-else>-</div>

        <BaseIcon :path="mdiPackage" />
        <span>依赖</span>
        <div v-if="current?.info.dependencies.length">
          <span
            v-for="dependency in current?.info.dependencies"
            :key="dependency.id"
            :title="dependency.id"
          >
            <code>
              {{ dependency.id }}
            </code>
          </span>
        </div>

        <div v-else>-</div>
      </div>
    </CardBoxModal>

    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiPuzzleOutline"
        title="插件"
        main
        no-button
      >
        <BaseButton
          :icon="mdiReloadAlert"
          color="whiteDark"
          title="重新加载所有插件"
          :disabled="isLoading"
          @click="reload"
        />
      </SectionTitleLineWithButton>

      <CardBox has-component-layout class="overflow-hidden mb-5">
        <Console type="plugins" :datas="packets" />
      </CardBox>

      <SectionTitleLineWithButton
        title="插件列表"
        no-button
        :icon="mdiViewListOutline"
      >
        <BaseButton
          :icon="mdiRefresh"
          color="whiteDark"
          title="刷新"
          :disabled="isLoading"
          @click="update"
        />
      </SectionTitleLineWithButton>
      <CardBox>
        <table>
          <thead>
            <tr class="break-keep">
              <th>名称</th>
              <th>状态</th>
              <th>版本</th>
              <th>作者</th>
              <th>描述</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itemsPaginated" :key="item.info.id">
              <td
                data-label="名称"
                :class="{ 'text-gray-500': !item.isEnabled }"
              >
                <span v-if="item.info.name">
                  {{ item.info.name }}
                </span>
                <i v-else> 未知 </i>
              </td>
              <td
                data-label="状态"
                :class="{ 'text-gray-500': !item.isEnabled }"
              >
                {{ item.isEnabled ? '已启用' : '已禁用' }}
              </td>
              <td
                data-label="版本"
                :class="{ 'text-gray-500': !item.isEnabled }"
              >
                <code class="break-all">
                  {{ item.info.version }}
                </code>
              </td>
              <td
                data-label="作者"
                :class="{ 'text-gray-500': !item.isEnabled }"
              >
                <span v-for="(author, index) in item.info.authors" :key="index">
                  {{ author.name }}
                  <br />
                </span>
              </td>
              <td
                data-label="描述"
                class="break-all"
                :class="{ 'text-gray-500': !item.isEnabled }"
              >
                {{ item.info.description }}
              </td>

              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                  <BaseButton
                    color="lightdark"
                    outline
                    :icon="mdiInformationOutline"
                    small
                    @click="
                      () => {
                        isModalInfoActive = true;
                        current = item;
                      }
                    "
                  />
                  <BaseButton
                    :color="!item.isEnabled ? 'lightDark' : 'danger'"
                    outline
                    :disabled="!item.isEnabled"
                    :icon="mdiStopCircleOutline"
                    small
                    @click="disable(item.info.id)"
                  />
                </BaseButtons>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
          <BaseLevel>
            <BaseButtons>
              <BaseButton
                v-for="page in pagesList"
                :key="page"
                :active="page === currentPage"
                :label="page + 1"
                :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                small
                @click="currentPage = page"
              />
            </BaseButtons>
            <small
              >共{{ items.length }}项，第{{ currentPageHuman }}页，共{{
                numPages
              }}页</small
            >
          </BaseLevel>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
