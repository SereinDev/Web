<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseLevel from '@/components/BaseLevel.vue';
import CardBoxModal from '@/components/CardBoxModal.vue';
import FormCheckRadio from '@/components/FormCheckRadio.vue';
import FormControl from '@/components/FormControl.vue';
import FormField from '@/components/FormField.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import {
  addMatch,
  editMatch,
  getMatches,
  removeMatch,
} from '@/services/apis/match';
import { Match, MatchFieldType } from '@/types/match';
import { docsUrl } from '@/utils/constants';
import {
  mdiBookOpenOutline,
  mdiFormatListBulleted,
  mdiPencil,
  mdiPlus,
  mdiRefresh,
  mdiTrashCan,
} from '@mdi/js';
import { computed, reactive, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const options = [
  { id: 0, label: '禁用' },
  { id: 1, label: '服务器输出' },
  { id: 2, label: '服务器输入' },
  { id: 3, label: '群聊消息' },
  { id: 4, label: '私聊消息' },
  { id: 5, label: '自身消息' },
  { id: 6, label: '频道消息（Channel）' },
  { id: 7, label: '群组消息（Guild）' },
];

const current = ref({} as Match);
const isLoading = ref(false);

const isModalActive = ref(false);
const isModalDangerActive = ref(false);

const items = ref([] as Match[]);
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
    isLoading.value = true;
    items.value = await getMatches();
  } catch (error) {
    toast.error('获取匹配失败，原因：' + String(error));
  }
  isLoading.value = false;
}

async function confirm() {
  if (!current.value.id) {
    try {
      await addMatch(current.value);
      toast.success('添加成功');
    } catch (error) {
      isModalActive.value = true;
      toast.error('添加失败，原因：' + String(error));
    }
  } else {
    try {
      const id = current.value.id;
      current.value.id = undefined;

      await editMatch(id, current.value);
      toast.success('修改成功');
    } catch (error) {
      isModalActive.value = true;
      toast.error('修改失败，原因：' + String(error));
    }
  }

  await update();
}

async function remove() {
  try {
    if (!current.value?.id) {
      return;
    }

    await removeMatch(current.value.id);
    toast.success('删除成功');
  } catch (error) {
    toast.error('删除失败，原因：' + String(error));
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
      title="匹配编辑器"
      has-cancel
      @confirm="confirm"
    >
      <FormField label="正则表达式" style="margin-bottom: 0">
        <FormControl v-model="current.regExp" type="text" autocomplete="none" />
      </FormField>

      <div class="flex justify-center mt-6">
        <FormField
          label="匹配域"
          class="w-1/2"
          style="margin-bottom: 0; min-width: 150px"
        >
          <FormControl
            v-model="current.fieldType"
            type="text"
            autocomplete="none"
            :options="options"
          />
        </FormField>

        <div class="w-full ml-8 flex mt-6">
          <FormCheckRadio
            v-model="current.requireAdmin"
            type="checkbox"
            name="requireAdmin"
            :disabled="
              ![
                MatchFieldType.GroupMsg,
                MatchFieldType.PrivateMsg,
                MatchFieldType.ChannelMsg,
                MatchFieldType.GuildMsg,
              ].includes(current.fieldType)
            "
            :input-value="false"
            label="需要管理员权限"
          />
        </div>
      </div>

      <FormField label="命令">
        <FormControl
          v-model="current.command"
          type="text"
          autocomplete="none"
        />
      </FormField>

      <FormField label="描述">
        <FormControl
          v-model="current.description"
          type="text"
          autocomplete="none"
        />
      </FormField>

      <FormField label="排除参数">
        <FormControl
          v-model="current.exclusions"
          type="text"
          autocomplete="none"
        />
      </FormField>
    </CardBoxModal>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiFormatListBulleted"
        title="匹配"
        main
      >
        <BaseButtons>
          <BaseButton
            :icon="mdiPlus"
            color="whiteDark"
            title="添加"
            @click="
              () => {
                current = { fieldType: 0 } as Match;
                isModalActive = true;
              }
            "
          />
          <BaseButton
            :icon="mdiRefresh"
            color="whiteDark"
            title="刷新"
            :disabled="isLoading"
            @click="update"
          />
        </BaseButtons>
      </SectionTitleLineWithButton>

      <LoadingContainer :is-loading="isLoading">
        <table>
          <thead>
            <tr class="break-keep">
              <th>正则表达式</th>
              <th>匹配域</th>
              <th>命令</th>
              <th>描述</th>
              <th>需要管理权限</th>
              <th>排除参数</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itemsPaginated" :key="item.id">
              <td data-label="正则表达式">
                <code class="break-all">{{ item.regExp }}</code>
              </td>
              <td data-label="匹配域" class="break-keep">
                {{ options[item.fieldType].label }}
              </td>
              <td data-label="命令">
                <code class="break-all">{{ item.command }}</code>
              </td>
              <td data-label="描述">
                <span class="break-all">
                  {{ item.description }}
                </span>
              </td>
              <td data-label="需要管理权限">
                {{ item.requireAdmin ? '是' : '否' }}
              </td>
              <td data-label="排除参数">
                <code class="break-all">
                  {{ item.exclusions }}
                </code>
              </td>

              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                  <BaseButton
                    outline
                    color="lightdark"
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
                    outline
                    color="danger"
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
            <small
              >共{{ items.length }}项，第{{ currentPageHuman }}页，共{{
                numPages
              }}页</small
            >
          </BaseLevel>
        </div>
      </LoadingContainer>

      <BaseButtons class="mt-5">
        <BaseButton
          label="文档§匹配"
          color="whitedark"
          target="_blank"
          :href="docsUrl + '/docs/guidance/match'"
          :icon="mdiBookOpenOutline"
        />
        <BaseButton
          label="文档§变量"
          color="whitedark"
          target="_blank"
          :href="docsUrl + '/docs/guidance/variables'"
          :icon="mdiBookOpenOutline"
        />
      </BaseButtons>
    </SectionMain>
  </LayoutAuthenticated>
</template>
