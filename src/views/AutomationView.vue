<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseLevel from '@/components/BaseLevel.vue';
import CardBoxModal from '@/components/CardBoxModal.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { getAutomations, removeAutomation } from '@/services/apis/automation';
import {
  type AutomationCommand,
  type AutomationTask,
  type AutomationTrigger,
  CommandType,
  MatchFieldType,
} from '@/types/automation';
import { docsUrl } from '@/utils/constants';
import {
  mdiBookOpenOutline,
  mdiPencil,
  mdiPlus,
  mdiRefresh,
  mdiRobotOutline,
  mdiTrashCan,
} from '@mdi/js';
import { computed, reactive, ref } from 'vue';
import { useToast } from 'vue-toastification';

type TriggerMode = 'match' | 'schedule';

interface AutomationEditorModel {
  id?: number;
  description: string;
  triggerMode: TriggerMode;
  isEnabled: boolean;
  pattern: string;
  isRegex: boolean;
  fieldType: MatchFieldType;
  cronExpression: string;
  commandsText: string;
  extraTriggers: AutomationTrigger[];
}

const toast = useToast();
const isLoading = ref(false);
const isModalActive = ref(false);
const isModalDangerActive = ref(false);

const items = ref([] as AutomationTask[]);
const current = ref(createDefaultEditor());

const triggerModeOptions = [
  { id: 'match', label: '匹配触发' },
  { id: 'schedule', label: '定时触发' },
];

const matchFieldTypeOptions = [
  { id: MatchFieldType.ServerOutput, label: '服务器输出' },
  { id: MatchFieldType.ServerInput, label: '服务器输入' },
  { id: MatchFieldType.GroupMsg, label: '群聊消息' },
  { id: MatchFieldType.PrivateMsg, label: '私聊消息' },
  { id: MatchFieldType.SelfMsg, label: '自身消息' },
  { id: MatchFieldType.ChannelMsg, label: '频道消息（Channel）' },
  { id: MatchFieldType.GuildMsg, label: '群组消息（Guild）' },
];

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
  const list = [];
  for (let i = 0; i < numPages.value; i++) {
    list.push(i);
  }
  return list;
});

function createDefaultEditor(): AutomationEditorModel {
  return {
    description: '',
    triggerMode: 'match',
    isEnabled: true,
    pattern: '',
    isRegex: false,
    fieldType: MatchFieldType.ServerOutput,
    cronExpression: '',
    commandsText: '',
    extraTriggers: [],
  };
}

function getTriggerTypeLabel(trigger: AutomationTrigger): string {
  return (
    {
      match: '匹配',
      schedule: '定时',
      event: '事件',
      plugin: '插件',
    }[trigger.type] ?? '未知'
  );
}

function getTriggerDetail(trigger: AutomationTrigger): string {
  if (!trigger) {
    return '-';
  }

  switch (trigger.type) {
    case 'match': {
      const mode = trigger.isRegex ? '正则' : '文本';
      return `${mode}：${trigger.pattern}`;
    }
    case 'schedule':
      return `Cron：${trigger.cronExpression}`;
    case 'event':
      return `事件数：${trigger.events.length}`;
    case 'plugin':
      return `标识符：${trigger.key}`;
    default:
      return '-';
  }
}

function getCommandLabel(command: AutomationCommand): string {
  switch (command.type) {
    case CommandType.Invalid:
      return '无效';
    case CommandType.ExecuteShellCommand:
      return '终端';
    case CommandType.InputServer:
      return '服务器';
    case CommandType.SendGroupMsg:
      return '群聊';
    case CommandType.SendPrivateMsg:
      return '私聊';
    case CommandType.SendChannelMsg:
      return '频道';
    case CommandType.SendGuildMsg:
      return '公会';
    case CommandType.SendReply:
      return '回复';
    case CommandType.SendData:
      return '数据';
    case CommandType.Bind:
      return '绑定';
    case CommandType.Unbind:
      return '解绑';
    case CommandType.ExecuteJavascriptCodes:
      return 'Js';
    case CommandType.Debug:
      return '调试';
    default:
      return '未知';
  }
}

async function update() {
  if (isLoading.value) {
    return;
  }

  try {
    isLoading.value = true;
    items.value = await getAutomations();
  } catch (error) {
    items.value = [];
    toast.error('获取自动化任务失败，原因：' + String(error));
  }

  isLoading.value = false;
}

async function remove() {
  const id = current.value.id;
  if (id === undefined) {
    return;
  }

  try {
    isLoading.value = true;
    await removeAutomation(id);
    toast.success('删除成功');
  } catch (error) {
    toast.error('删除失败，原因：' + String(error));
  }

  await update();
  isLoading.value = false;
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

    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiRobotOutline"
        title="自动化任务"
        main
      >
        <BaseButtons>
          <BaseButton :icon="mdiPlus" color="whiteDark" title="添加" />
          <BaseButton
            :icon="mdiRefresh"
            color="whiteDark"
            title="刷新"
            :disabled="isLoading"
            @click="update"
          />
        </BaseButtons>
      </SectionTitleLineWithButton>

      <LoadingContainer :is-loading="isLoading" use-mask>
        <table>
          <thead>
            <tr class="break-keep">
              <th>触发器</th>
              <th>命令</th>
              <th>描述</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itemsPaginated" :key="item.id">
              <td v-if="item.triggers.length > 0" data-label="触发器">
                <div
                  v-for="(trigger, index) in item.triggers.slice(0, 2)"
                  :key="index"
                  class="flex items-center"
                >
                  <div
                    class="mr-2 px-2 py-1 bg-stone-100 dark:bg-slate-700 rounded whitespace-nowrap"
                  >
                    {{ getTriggerTypeLabel(trigger) }}
                  </div>
                </div>
                <div
                  v-if="item.commands.length >= 3"
                  class="text-gray-500 select-none"
                >
                  ……
                </div>
              </td>
              <td v-else data-label="触发器">
                <span class="text-gray-400 dark:text-gray-600 select-none">
                  空
                </span>
              </td>

              <td v-if="item.commands.length > 0" data-label="命令">
                <div
                  v-for="(command, index) in item.commands.slice(0, 2)"
                  :key="index"
                >
                  <div class="flex items-center">
                    <div
                      class="mr-2 px-2 py-1 bg-stone-100 dark:bg-slate-700 rounded whitespace-nowrap"
                    >
                      {{ getCommandLabel(command) }}
                    </div>
                    <code>{{ command.body }}</code>
                  </div>
                </div>
                <div
                  v-if="item.commands.length >= 3"
                  class="text-gray-500 select-none"
                >
                  ……
                </div>
              </td>
              <td v-else data-label="命令">
                <span class="text-gray-400 dark:text-gray-600 select-none">
                  空
                </span>
              </td>

              <td data-label="描述">
                <span class="break-all">
                  {{ item.description || '-' }}
                </span>
              </td>
              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                  <BaseButton
                    outline
                    color="lightdark"
                    :icon="mdiPencil"
                    small
                  />
                  <BaseButton
                    outline
                    color="danger"
                    :icon="mdiTrashCan"
                    small
                    @click="
                      () => {
                        isModalDangerActive = true;
                        current = reactive({
                          ...createDefaultEditor(),
                          id: item.id,
                        });
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
          label="文档§定时任务"
          color="whitedark"
          target="_blank"
          :href="docsUrl + '/docs/guidance/schedule'"
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
