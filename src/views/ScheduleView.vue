<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseLevel from '@/components/BaseLevel.vue';
import CardBoxModal from '@/components/CardBoxModal.vue';
import FormCheckRadio from '@/components/FormCheckRadio.vue';
import FormControl from '@/components/FormControl.vue';
import FormField from '@/components/FormField.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { createNotify } from '@/services/notification';
import {
  addSchedule,
  editSchedule,
  getSchedules,
  removeSchedule,
} from '@/services/request';
import { Schedule } from '@/types/schedule';
import {
  mdiClockOutline,
  mdiPencil,
  mdiPlus,
  mdiRefresh,
  mdiTrashCan
} from '@mdi/js';
import { computed, reactive, ref } from 'vue';

const current = ref({} as Schedule);
const isModalActive = ref(false);
const isModalDangerActive = ref(false);
const items = ref([] as Schedule[]);
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

async function update() {
  try {
    items.value = await getSchedules();
  } catch (error) {
    items.value = [];
    createNotify({
      type: 'danger',
      title: '获取定时任务失败',
      message: String(error),
    });
  }
}

async function confirm() {
  if (!current.value.id) {
    try {
      await addSchedule(current.value);

      createNotify({ title: '新建成功', type: 'success' });
    } catch (error) {
      isModalActive.value = true;
      createNotify({
        type: 'danger',
        title: '新建定时任务失败',
        message: String(error),
      });
    }
  } else {
    try {
      const id = current.value.id;
      current.value.id = undefined;
      await editSchedule(id, current.value);
      createNotify({ title: '修改成功', type: 'success' });
    } catch (error) {
      isModalActive.value = true;
      createNotify({
        type: 'danger',
        title: '修改定时任务失败',
        message: String(error),
      });
    }
  }

  await update();
}

async function remove() {
  try {
    if (!current.value?.id) {
      return;
    }

    await removeSchedule(current.value.id);
    createNotify({ title: '删除成功', type: 'success' });
  } catch (error) {
    createNotify({
      type: 'danger',
      title: '删除失败',
      message: String(error),
    });
  }

  await update();
}

update();
</script>
<template>
  <LayoutAuthenticated>
    <CardBoxModal
      v-model="isModalDangerActive"
      button="danger"
      has-cancel
      title="确定要删除此项吗？"
      @confirm="remove"
    >
      <p>这将会永远失去！（真的很久！）</p>
    </CardBoxModal>

    <CardBoxModal
      v-model="isModalActive"
      title="定时任务编辑器"
      has-cancel
      @confirm="confirm"
    >
      <FormCheckRadio
        type="checkbox"
        name="requireAdmin"
        :input-value="false"
        v-model="current.isEnabled"
        label="启用"
      />

      <FormField label="Cron表达式" style="margin-bottom: 0">
        <FormControl
          type="text"
          autocomplete="none"
          v-model="current.expression"
        />
      </FormField>

      <FormField label="命令">
        <FormControl
          type="text"
          autocomplete="none"
          v-model="current.command"
        />
      </FormField>

      <FormField label="描述">
        <FormControl
          type="text"
          autocomplete="none"
          v-model="current.description"
        />
      </FormField>

    </CardBoxModal>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiClockOutline"
        title="定时任务"
        main
      >
        <BaseButtons>
          <BaseButton
            :icon="mdiPlus"
            color="whiteDark"
            title="添加"
            @click="
              () => {
                current = { isEnabled: true } as Schedule;
                isModalActive = true;
              }
            "
          />
          <BaseButton
            :icon="mdiRefresh"
            color="whiteDark"
            title="刷新"
            @click="update"
          />
        </BaseButtons>
      </SectionTitleLineWithButton>

      <table>
        <thead>
          <tr class="break-keep">
            <th>Cron表达式</th>
            <th>命令</th>
            <th>描述</th>
            <th>状态</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itemsPaginated" :key="item.id">
            <td data-label="Cron表达式">
              <code class="break-all">{{ item.expression }}</code>
            </td>
            <td data-label="命令">
              <code class="break-all">{{ item.command }}</code>
            </td>
            <td data-label="描述">
              <span class="break-all">
                {{ item.description }}
              </span>
            </td>
            <td data-label="状态">
              {{ item.isEnabled ? '启用' : '禁用' }}
            </td>

            <td class="before:hidden lg:w-1 whitespace-nowrap">
              <BaseButtons type="justify-start lg:justify-end" no-wrap>
                <BaseButton
                  color="lightdark"
                  outline
                  :icon="mdiPencil"
                  small
                  @click="
                    () => {
                      current = item;
                      isModalActive = true;
                    }
                  "
                />
                <BaseButton
                  color="danger"
                  outline
                  :icon="mdiTrashCan"
                  small
                  @click="
                    () => {
                      isModalDangerActive = true;
                      current = reactive(item);
                    }
                  "
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
          <small>第{{ currentPageHuman }}页，共{{ numPages }}页</small>
        </BaseLevel>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
