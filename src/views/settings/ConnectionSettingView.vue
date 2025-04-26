<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import CardBox from '@/components/CardBox.vue';
import FormCheckRadio from '@/components/FormCheckRadio.vue';
import FormControl from '@/components/FormControl.vue';
import FormField from '@/components/FormField.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { updateConnectionSetting } from '@/services/apis/settings';
import { getSettingsWithCache } from '@/services/settingProvider';
import { Settings } from '@/types/settings';
import {
  mdiDatabaseOutline,
  mdiFileDocumentCheckOutline,
  mdiKey,
  mdiServer,
  mdiWifiSettings,
} from '@mdi/js';
import { computed, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const isLoading = ref(true);
const setting = ref({} as Settings['connection']);
const subProtocols = computed({
  get: () => setting.value.subProtocols?.join('\n'),
  set: (value: string) => {
    setting.value.subProtocols = value.split('\n').filter(Boolean);
  },
});
const groups = computed({
  get: () => setting.value.groups?.join(';'),
  set: (value: string) => {
    setting.value.groups = value
      .split(';')
      .map((item) => Number.parseInt(item.trim()))
      .filter(Boolean);
  },
});
const administrators = computed({
  get: () => setting.value.administrators?.join(';'),
  set: (value: string) => {
    setting.value.administrators = value
      .split(';')
      .map((item) => Number.parseInt(item.trim()))
      .filter(Boolean);
  },
});

getSettingsWithCache()
  .then((settings) => {
    setting.value = settings.connection;
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
  try {
    await updateConnectionSetting(setting.value);
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
        :icon="mdiWifiSettings"
        title="连接设置"
        main
        no-button
      >
        <BaseButton
          :icon="mdiFileDocumentCheckOutline"
          color="lightDark"
          label="保存"
          @click="save"
        />
      </SectionTitleLineWithButton>

      <SectionTitleLineWithButton
        title="Websocket"
        no-button
        :icon="mdiServer"
      />
      <CardBox>
        <FormField
          label="地址"
          :help="'· 正向WebSocket：连接的WebSocket地址\n· 反向WebSocket：WebSocket服务器的开启地址'"
        >
          <FormControl
            v-model="setting.uri"
            name="id"
            type="text"
            autocomplete="off"
          />
        </FormField>

        <FormField
          label="鉴权凭证（Token）"
          :help="'· 正向WebSocket：在Header携带Authentication字段\n· 反向WebSocket：校验连接的客户端Header中的Authentication字段'"
        >
          <FormControl
            v-model="setting.accessToken"
            name="accessToken"
            type="password"
            autocomplete="off"
          />
        </FormField>

        <FormField
          label="WebSocket子协议"
          help="连接WebSocket时的子协议（仅正向WebSocket有效；一行一个）"
        >
          <FormControl
            v-model="subProtocols"
            name="subProtocols"
            type="textarea"
          />
        </FormField>

        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-10 mb-5 md:mb-0">
          <FormField help="开启WebSocket服务器供机器人连接">
            <FormCheckRadio
              v-model="setting.useReverseWebSocket"
              type="checkbox"
              name="useReverseWebSocket"
              :input-value="false"
              label="使用反向WebSocket"
            />
          </FormField>
          <FormField help="WebSocket连接异常断开时自动重连">
            <FormCheckRadio
              v-model="setting.autoReconnect"
              type="checkbox"
              name="autoStopWhenCrashing"
              :input-value="false"
              label="断线自动重连"
            />
          </FormField>
        </div>
      </CardBox>

      <SectionTitleLineWithButton
        title="数据"
        no-button
        :icon="mdiDatabaseOutline"
      />
      <CardBox>
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5 mb-5 md:mb-0">
          <FormField help="在连接控制台中输出接收和发送的数据">
            <FormCheckRadio
              v-model="setting.outputData"
              type="checkbox"
              name="outputData"
              :input-value="true"
              label="输出收发的数据"
            />
          </FormField>
          <FormField help="消息内容作为纯文本发送（即不解析CQ码）">
            <FormCheckRadio
              v-model="setting.autoEscape"
              type="checkbox"
              name="autoEscape"
              :input-value="true"
              label="纯文本发送"
            />
          </FormField>
          <FormField help="将收到的数据包以文本格式保存到日志文件（./log/msg）">
            <FormCheckRadio
              v-model="setting.saveLog"
              type="checkbox"
              name="saveLog"
              :input-value="true"
              label="保存数据包到日志"
            />
          </FormField>
        </div>
      </CardBox>

      <SectionTitleLineWithButton title="权限" no-button :icon="mdiKey" />
      <CardBox>
        <FormField
          help="使监听群的群主和管理员与下面的管理权限列表中的用户拥有相同权限"
        >
          <FormCheckRadio
            v-model="setting.grantPermissionToOwnerAndAdmins"
            type="checkbox"
            name="grantPermissionToOwnerAndAdmins"
            :input-value="true"
            label="赋予所有群主和管理员管理权限"
          />
        </FormField>
        <FormField label="监听群列表" help="要监听消息的群聊，使用“;”分隔">
          <FormControl
            v-model="groups"
            name="groups"
            type="text"
            autocomplete="off"
          />
        </FormField>
        <FormField label="管理权限列表" help="有管理权限的用户，使用“;”分隔">
          <FormControl
            v-model="administrators"
            name="administrators"
            type="text"
            autocomplete="off"
          />
        </FormField>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
