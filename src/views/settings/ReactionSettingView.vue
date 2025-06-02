<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import CardBox from '@/components/CardBox.vue';
import CardBoxModal from '@/components/CardBoxModal.vue';
import FormControl from '@/components/FormControl.vue';
import FormField from '@/components/FormField.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { updateReactionSetting } from '@/services/apis/settings';
import { getSettingsWithCache } from '@/services/settings/appSettingProvider';
import { Settings } from '@/types/settings';
import {
  mdiEmoticonOutline,
  mdiFileDocumentCheckOutline,
  mdiFormatListText,
  mdiPencil,
  mdiPlus,
  mdiTrashCan,
} from '@mdi/js';
import { computed, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const options = [
  { id: 'ServerStart', label: '服务器启动' },
  { id: 'ServerExitedNormally', label: '服务器关闭：正常退出' },
  { id: 'ServerExitedUnexpectedly', label: '服务器关闭：不正常退出' },
  { id: 'GroupIncreased', label: '群人数增加' },
  { id: 'GroupDecreased', label: '群人数减少' },
  { id: 'GroupPoke', label: '群戳一戳' },
  { id: 'BindingSucceeded', label: '绑定成功' },
  { id: 'UnbindingSucceeded', label: '解绑成功' },
  { id: 'PermissionDeniedFromPrivateMsg', label: '权限不足：私聊' },
  { id: 'PermissionDeniedFromGroupMsg', label: '权限不足：群聊' },
  { id: 'SereinCrash', label: 'Serein崩溃' },
];

const isLoading = ref(true);
const isModalActive = ref(false);
const reactionType = ref(options[0].id);
const setting = ref({} as Settings['reactions']);
const command = ref<{ key?: number; command?: string }>({});
const commands = computed({
  get: () =>
    (setting.value[reactionType.value] || []).map((v) =>
      v.replace('\n', '\\n'),
    ),
  set: (value) => {
    if (reactionType.value) {
      setting.value[reactionType.value] = value.map((v) =>
        v.replace('\n', '\\n'),
      );
    }
  },
});

getSettingsWithCache()
  .then((settings) => {
    setting.value = settings.reactions;
  })
  .catch((error) => {
    toast.error(`获取设置失败: ${error.message}`);
  })
  .finally(() => {
    isLoading.value = false;
  });

function confirm() {
  if (command.value) {
    if (typeof command.value.key === 'number') {
      commands.value[command.value.key] = command.value.command;
    }
  }

  command.value = {};
  commands.value = [...commands.value];
}

async function save() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await updateReactionSetting(setting.value);
    toast.success('保存设置成功');
  } catch (error) {
    toast.error(`保存设置失败: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <LayoutAuthenticated>
    <CardBoxModal
      v-model="isModalActive"
      title="命令编辑器"
      has-cancel
      @confirm="confirm"
    >
      <FormControl v-model="command.command" />
    </CardBoxModal>

    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiEmoticonOutline"
        title="反应设置"
        main
        no-button
      >
        <BaseButton
          :icon="mdiFileDocumentCheckOutline"
          color="lightDark"
          :loading="isLoading"
          label="保存"
          @click="save"
        />
      </SectionTitleLineWithButton>

      <CardBox>
        <FormField label="反应类型" help="选择要修改的反应类型">
          <FormControl
            v-model="reactionType"
            class="max-w-60"
            :options="options"
          />
        </FormField>
      </CardBox>

      <SectionTitleLineWithButton title="命令" :icon="mdiFormatListText">
        <BaseButton
          :icon="mdiPlus"
          color="lightDark"
          @click="commands = [...commands, '']"
        />
      </SectionTitleLineWithButton>

      <NotificationBar
        v-if="commands.length === 0"
        color="info"
        :closable="false"
      >
        当前没有任何命令。你可以点击右上角的加号添加命令
      </NotificationBar>

      <CardBox>
        <div
          v-for="(item, key) in commands"
          :key="key"
          class="flex justify-between border-gray-200 dark:border-gray-700 border-b-2 mb-2 py-2"
        >
          <div>
            <code>
              {{ item }}
            </code>
          </div>
          <div>
            <BaseButtons no-wrap>
              <BaseButton
                outline
                color="lightdark"
                :icon="mdiPencil"
                small
                @click="
                  () => {
                    isModalActive = true;
                    command = { command: item, key };
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
                    commands.splice(key, 1);
                    commands = [...commands];
                  }
                "
              />
            </BaseButtons>
          </div>
        </div>

        <small>共{{ commands.length }}项</small>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
