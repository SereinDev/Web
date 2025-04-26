<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import CardBox from '@/components/CardBox.vue';
import CardBoxModal from '@/components/CardBoxModal.vue';
import FormCheckRadio from '@/components/FormCheckRadio.vue';
import FormControl from '@/components/FormControl.vue';
import FormField from '@/components/FormField.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import router from '@/router';
import {
  addServer,
  removeServer,
  updateConfiguration,
} from '@/services/apis/server';
import { getServersWithCache } from '@/services/servers/manager';
import { Configuration } from '@/types/server';
import {
  mdiArrowLeft,
  mdiBookOpen,
  mdiConsole,
  mdiConsoleLine,
  mdiContainEnd,
  mdiDelete,
  mdiFileDocumentCheckOutline,
  mdiFileEdit,
  mdiFileOutline,
  mdiMinecraft,
  mdiPalette,
  mdiPencil,
  mdiPlusBoxOutline,
  mdiRename,
  mdiStopCircleOutline,
  mdiText,
} from '@mdi/js';
import { computed, reactive, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const encodings = [
  { id: 0, label: 'UTF-8' },
  { id: 1, label: 'UTF16-LE' },
  { id: 2, label: 'UTF16-BE' },
  { id: 3, label: 'GBK' },
];

const styles = [
  { id: 0, label: '无颜色' },
  { id: 1, label: '原始彩色' },
];

const defaultValue = reactive({
  pty: {
    forceWinPty: true,
  },
  name: '未命名',
  portIPv4: 19132,
  stopCommands: ['stop'],
  inputEncoding: 0,
  outputEncoding: 0,
  outputCommandUserInput: true,
  outputStyle: 1,
  autoStopWhenCrashing: true,
  lineTerminator: '\r\n',
} as Configuration);

const isModalDangerActive = ref(false);
const pathId = (router.currentRoute.value.params['id'] as string) || '';
const readonly = pathId !== ':new';
const id = ref(readonly ? pathId : '');
const configuration = ref<Configuration>(defaultValue);
const stopCommands = computed({
  get: () => configuration.value.stopCommands.join('\n'),
  set: (value: string) => {
    configuration.value.stopCommands = value.split('\n');
  },
});
const lineTerminator = computed({
  get: () =>
    configuration.value?.lineTerminator
      .replaceAll('\r', '\\r')
      .replaceAll('\n', '\\n'),
  set: (value: string) => {
    configuration.value.lineTerminator = value
      .replaceAll('\\r', '\r')
      .replaceAll('\\n', '\n');
  },
});

if (readonly) {
  getServersWithCache().then((data) => {
    if (data[id.value]) {
      configuration.value = reactive(data[id.value].configuration);
    }
  });
}

async function confirm() {
  if (readonly) {
    try {
      await updateConfiguration(id.value, configuration.value);

      toast.success('更新配置成功');
      router.push({
        name: 'server',
        params: { id: id.value },
      });
    } catch (error) {
      toast.error('更新配置失败，原因：' + String(error));
    }
  } else {
    if (!id.value) {
      toast.warning('Id不能为空');
      return;
    }

    try {
      await addServer(id.value, configuration.value);

      toast.success('创建服务器成功');
      router.push({
        name: 'server',
        params: { id: id.value },
      });
    } catch (error) {
      toast.error('创建服务器失败，原因：' + String(error));
    }
  }
}

async function remove() {
  try {
    await removeServer(id.value);

    toast.success('删除服务器成功');
    router.push({
      name: 'servers',
    });
  } catch (error) {
    toast.error('删除服务器失败，原因：' + String(error));
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <CardBoxModal
      v-model="isModalDangerActive"
      button="danger"
      has-cancel
      :title="`确定要删除此服务器（Id=${id}）吗？`"
      @confirm="remove"
    >
      <p>这将会永远失去！（真的很久！）</p>
    </CardBoxModal>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiFileEdit"
        title="编辑配置"
        main
        no-button
      >
        <BaseButtons class="mt-5">
          <BaseButton
            :icon="mdiArrowLeft"
            color="lightDark"
            label="返回"
            @click="router.back"
          />
          <BaseButton
            :icon="mdiFileDocumentCheckOutline"
            color="info"
            :label="readonly ? '保存' : '创建'"
            @click="confirm"
          />
          <BaseButton
            v-if="readonly"
            :icon="mdiDelete"
            color="danger"
            label="删除"
            @click="isModalDangerActive = true"
          />
        </BaseButtons>
      </SectionTitleLineWithButton>

      <SectionTitleLineWithButton
        title="常规"
        :icon="mdiFileOutline"
        no-button
      />
      <CardBox>
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-10">
          <FormField label="Id" help="用于区分服务器（一经填写无法修改）">
            <FormControl
              v-model="id"
              :icon="mdiRename"
              name="id"
              type="text"
              :disabled="readonly"
            />
          </FormField>

          <FormField label="名称" help="用于标识服务器，便于管理">
            <FormControl
              v-model="configuration.name"
              :icon="mdiText"
              type="text"
            />
          </FormField>

          <FormField
            label="启动文件"
            help="启动进程的文件，通常为可执行文件或批处理文件"
          >
            <FormControl
              v-model="configuration.fileName"
              :icon="mdiFileOutline"
              type="text"
            />
          </FormField>

          <FormField label="启动参数" help="附加在启动文件后的参数">
            <FormControl
              v-model="configuration.argument"
              :icon="mdiConsoleLine"
              type="text"
            />
          </FormField>
        </div>
      </CardBox>

      <SectionTitleLineWithButton
        title="输入/输出"
        :icon="mdiConsole"
        no-button
      />
      <CardBox>
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-10">
          <div>
            <FormField label="输入编码" help="输入到服务器的编码">
              <FormControl
                v-model="configuration.inputEncoding"
                :options="encodings"
                :icon="mdiPencil"
              />
            </FormField>

            <FormField
              label="输出编码"
              help="读取服务器输出的编码（修改后需要重新启动服务器方可生效）"
            >
              <FormControl
                v-model="configuration.outputEncoding"
                :icon="mdiBookOpen"
                :options="encodings"
              />
            </FormField>

            <FormField label="输出样式" help="控制台中渲染输出内容的样式">
              <FormControl
                v-model="configuration.outputStyle"
                :options="styles"
                :icon="mdiPalette"
              />
            </FormField>
          </div>

          <div class="my-5 md:my-0">
            <FormField
              help="将控制台内容保存到文件“Serein/logs/servers/{id}-{datetime}.log”"
            >
              <FormCheckRadio
                v-model="configuration.saveLog"
                type="checkbox"
                name="saveLog"
                :input-value="false"
                label="保存日志"
              />
            </FormField>
            <FormField help="在控制台显示由用户输入的命令">
              <FormCheckRadio
                v-model="configuration.outputCommandUserInput"
                type="checkbox"
                name="outputCommandUserInput"
                :input-value="false"
                label="显示输出的命令"
              />
            </FormField>
            <FormField
              :help="`使用Unicode字符输入（如'§'→'\\u00a7'），通常用于解决基岩版服务器输入Tellraw的编码问题`"
            >
              <FormCheckRadio
                v-model="configuration.useUnicodeChars"
                type="checkbox"
                name="useUnicodeChars"
                :input-value="false"
                label="使用Unicode字符"
              />
            </FormField>

            <BaseDivider />

            <FormField help="用于解决一些控制台无输入或输出的问题">
              <FormCheckRadio
                v-model="configuration.pty.isEnabled"
                type="checkbox"
                name="pty_isEnabled"
                :input-value="false"
                label="使用虚拟终端输入和输出"
              />
            </FormField>

            <FormField help="不推荐修改此项，除非你知道你在做什么！">
              <FormCheckRadio
                v-model="configuration.pty.forceWinPty"
                type="checkbox"
                name="pty_forceWinPty"
                :input-value="false"
                label="强制使用WinPty"
                :disabled="!configuration.pty.isEnabled"
              />
            </FormField>
          </div>
        </div>

        <FormField label="行终止符" help="用于标记每行的结尾" class="mt-3">
          <FormControl
            v-model="lineTerminator"
            :icon="mdiContainEnd"
            type="text"
          />
        </FormField>
      </CardBox>

      <SectionTitleLineWithButton
        title="更多"
        :icon="mdiPlusBoxOutline"
        no-button
      />
      <CardBox>
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-10 mb-5 md:mb-0">
          <FormField
            label="IPv4端口"
            help="服务器的IPv4端口，用于获取服务器相关信息（版本、在线玩家数）"
          >
            <FormControl
              v-model="configuration.portIPv4"
              :icon="mdiMinecraft"
              inputmode="demical"
              type="number"
            />
          </FormField>

          <div>
            <FormField>
              <FormCheckRadio
                v-model="configuration.autoRestart"
                type="checkbox"
                name="autoRestart"
                :input-value="false"
                label="当退出代码不为零时自动重启"
              />
            </FormField>
            <FormField>
              <FormCheckRadio
                v-model="configuration.autoStopWhenCrashing"
                type="checkbox"
                name="autoStopWhenCrashing"
                :input-value="false"
                label="应用程序崩溃时自动停止服务器"
              />
            </FormField>
            <FormField>
              <FormCheckRadio
                v-model="configuration.startWhenSettingUp"
                type="checkbox"
                name="startWhenSettingUp"
                :input-value="false"
                label="应用程序启动后自动运行"
              />
            </FormField>
          </div>
        </div>
        <FormField label="关服命令" help="关闭服务器时输入的命令（一行一个）">
          <FormControl
            v-model="stopCommands"
            :icon="mdiStopCircleOutline"
            type="textarea"
            placeholder="一行一个"
          />
        </FormField>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
