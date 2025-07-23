<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import CardBox from '@/components/CardBox.vue';
import FormCheckRadio from '@/components/FormCheckRadio.vue';
import FormControl from '@/components/FormControl.vue';
import FormField from '@/components/FormField.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { updateApplicationSetting } from '@/services/apis/settings';
import { getSettingsWithCache } from '@/services/settings/appSettingProvider';
import { Settings } from '@/types/settings';
import {
  mdiAccountLockOutline,
  mdiAlert,
  mdiApplicationCogOutline,
  mdiFileDocumentCheckOutline,
  mdiMenu,
  mdiPaletteOutline,
  mdiPuzzleOutline,
  mdiUpdate,
} from '@mdi/js';
import { computed, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const isLoading = ref(true);
const setting = ref({} as Settings['application']);

const jsFilesToExcludeFromLoading = computed({
  get: () => setting.value.jsFilesToExcludeFromLoading?.join('\n'),
  set: (value: string) => {
    setting.value.jsFilesToExcludeFromLoading = value
      .split('\n')
      .filter(Boolean);
  },
});
const jsDefaultAssemblies = computed({
  get: () => setting.value.jsDefaultAssemblies?.join('\n'),
  set: (value: string) => {
    setting.value.jsDefaultAssemblies = value.split('\n').filter(Boolean);
  },
});
const multiLineMatchingPatterns = computed({
  get: () => setting.value.multiLineMatchingPatterns?.join('\n'),
  set: (value: string) => {
    setting.value.multiLineMatchingPatterns = value.split('\n').filter(Boolean);
  },
});

getSettingsWithCache()
  .then(
    (settings) => {
      setting.value = settings.application;
    },
    (error) => {
      toast.error(`获取设置失败: ${error.message || error}`);
    },
  )
  .finally(() => {
    isLoading.value = false;
  });

async function save() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await updateApplicationSetting(setting.value);
    toast.success('保存设置成功');
  } catch (error) {
    toast.error(`保存设置失败: ${error.message || error}`);
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiApplicationCogOutline"
        title="应用设置"
        main
        no-button
      >
        <BaseButton
          :icon="mdiFileDocumentCheckOutline"
          :loading="isLoading"
          color="lightDark"
          label="保存"
          @click="save"
        />
      </SectionTitleLineWithButton>

      <LoadingContainer :is-loading="isLoading" use-mask>
        <SectionTitleLineWithButton
          title="插件"
          no-button
          :icon="mdiPuzzleOutline"
        />
        <CardBox>
          <FormField
            label="事件最大等待时间 (ms)"
            help="超出此时间返回的结果将被忽略；设置成0可禁用等待"
          >
            <FormControl
              v-model="setting.maximumWaitTimeForPluginEvents"
              name="maximumWaitTimeForPluginEvents"
              type="number"
              min="0"
              style="width: 200px"
            />
          </FormField>
          <FormField
            label="JS插件全局加载的程序集"
            help="此处的程序集将会被所有JS插件加载（一行一个）"
          >
            <FormControl
              v-model="jsDefaultAssemblies"
              name="jsDefaultAssemblies"
              type="textarea"
              rows="3"
            />
          </FormField>
          <FormField
            label="JS插件加载时忽略的文件后缀"
            help="凡是以所选内容结尾的文件都不会被加载（一行一个）"
          >
            <FormControl
              v-model="jsFilesToExcludeFromLoading"
              name="jsFilesToExcludeFromLoading"
              type="textarea"
              rows="3"
            />
          </FormField>
        </CardBox>

        <SectionTitleLineWithButton
          title="绑定"
          no-button
          :icon="mdiAccountLockOutline"
        />

        <CardBox>
          <FormField
            label="游戏名称检验正则"
            help="绑定时游戏名称需要符合此正则"
          >
            <FormControl
              v-model="setting.gameIdValidationPattern"
              name="gameIdValidationPattern"
              type="text"
            />
          </FormField>
          <FormField help="只影响通过Serein命令执行的绑定">
            <FormCheckRadio
              v-model="setting.disableBindingManagerWhenAllServersStopped"
              type="checkbox"
              name="disableBindingManagerWhenAllServersStopped"
              :input-value="true"
              label="当服务器关闭时禁用绑定功能"
            />
          </FormField>
        </CardBox>

        <SectionTitleLineWithButton title="其他" no-button :icon="mdiMenu" />

        <CardBox>
          <FormField
            label="用于触发多行匹配的文本"
            help="当输入的内容若含有以下内容将触发多行匹配（一行一个）"
          >
            <FormControl
              v-model="multiLineMatchingPatterns"
              name="multiLineMatchingPatterns"
              type="textarea"
              rows="3"
            />
          </FormField>
          <FormField
            help="当出现异常或崩溃时自动匿名上报（建议开启；重启生效；上报时可能会收集部分系统和环境信息并产生一定网络流量）"
          >
            <FormCheckRadio
              v-model="setting.enableSentry"
              type="checkbox"
              name="enableSentry"
              :input-value="true"
              label="使用Sentry上报"
            />
          </FormField>
        </CardBox>

        <SectionTitleLineWithButton
          title="外观"
          no-button
          :icon="mdiPaletteOutline"
        />

        <CardBox>
          <NotificationBar
            class="mb-3"
            color="warning"
            :closable="false"
            :icon="mdiAlert"
          >
            此功能仅在应用程序上生效
          </NotificationBar>

          <FormField label="主题">
            <FormControl
              v-model="setting.theme"
              :options="[
                { id: 0, label: '默认' },
                { id: 1, label: '浅色' },
                { id: 2, label: '深色' },
              ]"
            />
          </FormField>

          <FormField
            label="标题后缀"
            help="显示在标题栏的内容（可使用命令的变量）"
          >
            <FormControl
              v-model="setting.customTitle"
              name="customTitle"
              type="text"
            />
          </FormField>
        </CardBox>

        <SectionTitleLineWithButton title="更新" no-button :icon="mdiUpdate" />

        <CardBox>
          <FormField help="启动后自动获取更新提示（建议开启）">
            <FormCheckRadio
              v-model="setting.checkUpdate"
              type="checkbox"
              name="checkUpdate"
              :input-value="true"
              label="获取更新提示"
            />
          </FormField>
          <FormField help="应用关闭后自动替换新版本">
            <FormCheckRadio
              v-model="setting.autoUpdate"
              type="checkbox"
              name="autoUpdate"
              :input-value="true"
              label="自动更新"
              :disabled="!setting.checkUpdate"
            />
          </FormField>
        </CardBox>
      </LoadingContainer>
    </SectionMain>
  </LayoutAuthenticated>
</template>
