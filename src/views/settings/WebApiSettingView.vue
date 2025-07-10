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
import { updateWebApiSetting } from '@/services/apis/settings';
import { getSettingsWithCache } from '@/services/settings/appSettingProvider';
import { Settings } from '@/types/settings';
import {
  mdiCertificateOutline,
  mdiFileDocumentCheckOutline,
  mdiInformation,
  mdiNetworkPos,
  mdiServerNetwork,
} from '@mdi/js';
import { computed, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const isLoading = ref(true);
const setting = ref({ certificate: {}, isEnabled: true } as Settings['webApi']);

const urlPrefixes = computed({
  get: () => setting.value.urlPrefixes?.join('\n'),
  set: (value: string) => {
    setting.value.urlPrefixes = value.split('\n').filter(Boolean);
  },
});
const whiteList = computed({
  get: () => setting.value.whiteList?.join('\n'),
  set: (value: string) => {
    setting.value.whiteList = value.split('\n').filter(Boolean);
  },
});
const accessTokens = computed({
  get: () => setting.value.accessTokens?.join('\n'),
  set: (value: string) => {
    setting.value.accessTokens = value.split('\n').filter(Boolean);
  },
});

getSettingsWithCache()
  .then((settings) => {
    setting.value = settings.webApi;
  })
  .catch((error) => {
    toast.error(`获取设置失败: ${error.message}`);
  })
  .finally(() => {
    isLoading.value = false;
  });

async function save() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await updateWebApiSetting(setting.value);
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
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiNetworkPos"
        title="网页服务器设置"
        main
        no-button
      >
        <BaseButton
          :icon="mdiFileDocumentCheckOutline"
          color="lightDark"
          label="保存"
          :loading="isLoading"
          @click="save"
        />
      </SectionTitleLineWithButton>

      <LoadingContainer :is-loading="isLoading" use-mask>
        <CardBox :disabled="!setting.isEnabled">
          <FormField>
            <FormCheckRadio
              v-model="setting.isEnabled"
              type="checkbox"
              name="isEnabled"
              :input-value="true"
              label="启用"
            />
          </FormField>
        </CardBox>

        <NotificationBar class="my-5" color="info" :icon="mdiInformation">
          以下设置将在网页服务器重启后生效
        </NotificationBar>
        <SectionTitleLineWithButton
          title="常规"
          no-button
          :icon="mdiServerNetwork"
        />

        <CardBox>
          <FormField
            label="Url前缀"
            :help="`Http服务器监听的Url
· 使用换行符分隔每一个值，即一行一个值
· 使用HTTPS协议时，需要在下方设置证书
· 示例
  · 只允许内网访问：“http://127.0.0.1:12345”、“https://127.0.0.1:12345”、“http://[::1]:12345”
  · 允许外网访问：“http://*:8080”（可能需要以管理员身份运行）
  · 使用域名：“http://example.com”`"
          >
            <FormControl
              v-model="urlPrefixes"
              name="urlPrefixes"
              type="textarea"
              rows="4"
            />
          </FormField>
          <FormField help="开启后会在响应头添加 Access-Control-Allow-Origin: *">
            <FormCheckRadio
              v-model="setting.allowCrossOrigin"
              type="checkbox"
              name="allowCrossOrigin"
              :input-value="true"
              label="允许跨源请求"
            />
          </FormField>
          <FormField
            label="每秒最大请求数"
            help="每秒请求数超过此值的IP（下方白名单内的除外）将被封禁"
          >
            <FormControl
              v-model="setting.maxRequestsPerSecond"
              name="maxRequestsPerSecond"
              type="number"
              min="0"
              style="width: 150px"
            />
          </FormField>
          <FormField
            label="IP请求白名单"
            help="无视请求速度限制的IP列表（一行一个）"
          >
            <FormControl
              v-model="whiteList"
              name="whiteList"
              type="textarea"
              rows="3"
            />
          </FormField>
          <FormField
            label="访问凭证"
            help="若值不为空，请求时“/api”下的任意资源均需要在请求头中添加Authentication项，即“Authentication: Bearer [Token]”"
          >
            <FormControl
              v-model="accessTokens"
              name="accessTokens"
              type="textarea"
              rows="3"
            />
          </FormField>
        </CardBox>

        <SectionTitleLineWithButton
          title="证书"
          no-button
          :icon="mdiCertificateOutline"
        />

        <CardBox>
          <FormField>
            <FormCheckRadio
              v-model="setting.certificate.isEnabled"
              type="checkbox"
              name="certificateIsEnabled"
              :input-value="true"
              label="启用"
            />
          </FormField>
          <div class="grid grid-cols-1 md:grid-cols-2 md:gap-10 mb-5 md:mb-0">
            <FormField help="自动将使用的证书注册到默认的证书存储区">
              <FormCheckRadio
                v-model="setting.certificate.autoRegisterCertificate"
                type="checkbox"
                name="autoRegisterCertificate"
                :input-value="true"
                label="自动注册证书"
              />
            </FormField>
            <FormField help="自动从默认的证书存储区中读取证书">
              <FormCheckRadio
                v-model="setting.certificate.autoLoadCertificate"
                type="checkbox"
                name="autoLoadCertificate"
                :input-value="true"
                label="自动加载证书"
              />
            </FormField>
          </div>

          <FormField class="flex-1" label="证书路径">
            <FormControl
              v-model="setting.certificate.path"
              name="certificatePath"
              type="text"
            />
          </FormField>
          <FormField label="密码">
            <FormControl
              v-model="setting.certificate.password"
              name="certificatePassword"
              type="password"
            />
          </FormField>
        </CardBox>
      </LoadingContainer>
    </SectionMain>
  </LayoutAuthenticated>
</template>
