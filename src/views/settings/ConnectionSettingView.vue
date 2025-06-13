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
import { getSettingsWithCache } from '@/services/settings/appSettingProvider';
import { Settings } from '@/types/settings';
import {
  mdiDatabaseOutline,
  mdiFileDocumentCheckOutline,
  mdiMenu,
  mdiServer,
  mdiWifiSettings,
} from '@mdi/js';
import { computed, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const isLoading = ref(true);
const setting = ref({
  oneBot: {},
  satori: {},
  self: {},
} as Settings['connection']);

const subProtocols = computed({
  get: () => setting.value.oneBot.subProtocols?.join('\n'),
  set: (value: string) => {
    setting.value.oneBot.subProtocols = value.split('\n').filter(Boolean);
  },
});
const groups = computed({
  get: () => setting.value.listenedIds?.join(';'),
  set: (value: string) => {
    setting.value.listenedIds = value.split(';').filter(Boolean);
  },
});
const administrators = computed({
  get: () => setting.value.administratorUserIds?.join(';'),
  set: (value: string) => {
    setting.value.administratorUserIds = value.split(';').filter(Boolean);
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

  isLoading.value = true;

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
          :loading="isLoading"
          @click="save"
        />
      </SectionTitleLineWithButton>

      <SectionTitleLineWithButton title="通用" no-button :icon="mdiMenu" />

      <CardBox>
        <FormField
          label="适配器"
          help="决定Serein将以何种方式连接"
          class="w-full md:w-1/3"
        >
          <FormControl
            v-model="setting.adapter"
            :options="[
              { id: 0, label: 'OneBot（WebSocket正向连接）' },
              { id: 1, label: 'OneBot（WebSocket反向连接）' },
              { id: 2, label: 'Satori' },
              { id: 3, label: '插件' },
            ]"
          />
        </FormField>

        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5 mb-6 md:mb-0">
          <FormField
            help="在连接控制台中输出接收和发送的数据，但可能导致控制台可读性下降"
          >
            <FormCheckRadio
              v-model="setting.outputData"
              type="checkbox"
              name="outputData"
              :input-value="true"
              label="输出收发的数据"
            />
          </FormField>

          <FormField
            help="将收到的数据包以文本格式保存到日志文件（./log/connection/）"
          >
            <FormCheckRadio
              v-model="setting.saveLog"
              type="checkbox"
              name="saveLog"
              :input-value="true"
              label="保存到日志"
            />
          </FormField>
        </div>

        <FormField help="Serein启动后自动开启连接">
          <FormCheckRadio
            v-model="setting.connectWhenSettingUp"
            type="checkbox"
            name="connectWhenSettingUp"
            :input-value="true"
            label="自动连接"
          />
        </FormField>

        <FormField
          label="监听列表"
          :help="`要监听消息的群聊、频道或群组
· 直接填写Id 或 [来源]:[Id] 的格式字符串
    · 其中来源可为g/group（群聊）、c/channel（频道）、guild（群组）
    · 例：“g:12345”或“group:12345”
· 使用分号“;”分隔每一个值`"
        >
          <FormControl
            v-model="groups"
            name="groups"
            type="text"
            autocomplete="off"
          />
        </FormField>

        <FormField
          label="管理权限列表"
          :help="'有管理权限的用户\n· 使用分号“;”分隔每一个值'"
        >
          <FormControl
            v-model="administrators"
            name="administrators"
            type="text"
            autocomplete="off"
          />
        </FormField>

        <FormField
          label="默认发送者"
          :help="`当同时登录了多个账号时且在命令中未指定发送的账号时，采用此账号作为默认的发送者
· 若选择OneBot适配器（V12），只登录了一个账号时可不设置此项
· 若选择Satori适配器，无论是否登录多个账号都需要设置此项`"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5 mx-3">
            <FormField label="用户Id">
              <FormControl
                v-model="setting.self.userId"
                name="userId"
                type="text"
                autocomplete="off"
              />
            </FormField>

            <FormField label="平台名称">
              <FormControl
                v-model="setting.self.platform"
                name="platform"
                type="text"
                autocomplete="off"
              />
            </FormField>
          </div>
        </FormField>
      </CardBox>

      <SectionTitleLineWithButton title="OneBot" no-button :icon="mdiServer" />
      <CardBox>
        <FormField
          label="OneBot版本"
          help="将影响Serein中对数据包的处理方式"
          class="w-full md:w-1/3"
        >
          <FormControl
            v-model="setting.oneBot.version"
            :options="[
              { id: 0, label: 'V11' },
              { id: 1, label: 'V12' },
            ]"
          />
        </FormField>

        <FormField
          label="地址"
          :help="`· 当选择了正向连接适配器时，这个地址应以“ws://”或“wss://”开头，Serein将会连接到这个地址
· 当选择了反向连接适配器时，这个地址应以“http://”或“https://”开头，Serein将会开启一个WebSocket服务器供OneBot实现连接`"
        >
          <FormControl
            v-model="setting.oneBot.uri"
            name="id"
            type="text"
            autocomplete="off"
          />
        </FormField>

        <FormField label="鉴权凭证（Token）" help="用于鉴权的Access-Token">
          <FormControl
            v-model="setting.oneBot.accessToken"
            name="accessToken"
            type="password"
            autocomplete="off"
          />
        </FormField>

        <FormField
          label="WebSocket子协议"
          :help="`连接WebSocket时的子协议（一行一个）
· 仅适用于WebSocket正向连接`"
        >
          <FormControl
            v-model="subProtocols"
            name="subProtocols"
            type="textarea"
          />
        </FormField>
        <div class="grid grid-cols-1 md:grid-cols-2">
          <FormField
            :help="`WebSocket连接异常断开时自动重连
· 仅适用于WebSocket正向连接`"
          >
            <FormCheckRadio
              v-model="setting.oneBot.autoReconnect"
              type="checkbox"
              name="autoStopWhenCrashing"
              :input-value="false"
              label="断线自动重连"
            />
          </FormField>

          <FormField
            :help="`消息内容作为纯文本发送（即不解析CQ码）
· 仅当OneBot版本为V11时生效`"
          >
            <FormCheckRadio
              v-model="setting.oneBot.autoEscape"
              type="checkbox"
              name="autoEscape"
              :input-value="true"
              label="纯文本发送"
            />
          </FormField>

          <FormField
            :help="`使监听群的群主和管理员与上方的管理权限列表中的用户拥有相同权限
· 仅当OneBot版本为V11时生效`"
          >
            <FormCheckRadio
              v-model="setting.oneBot.grantPermissionToGroupOwnerAndAdmins"
              type="checkbox"
              name="grantPermissionToGroupOwnerAndAdmins"
              :input-value="true"
              label="赋予所有群主和管理员管理权限"
            />
          </FormField>
        </div>
      </CardBox>

      <SectionTitleLineWithButton
        title="Satori"
        no-button
        :icon="mdiDatabaseOutline"
      />
      <CardBox>
        <FormField label="地址" help="用于Api请求的地址">
          <FormControl
            v-model="setting.satori.uri"
            name="uri"
            type="text"
            autocomplete="off"
          />
        </FormField>

        <FormField label="鉴权凭证" help="用于鉴权的Token">
          <FormControl
            v-model="setting.satori.accessToken"
            name="accessToken"
            type="password"
            autocomplete="off"
          />
        </FormField>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
