<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import CardBox from '@/components/CardBox.vue';
import FormCheckRadio from '@/components/FormCheckRadio.vue';
import FormControl from '@/components/FormControl.vue';
import FormField from '@/components/FormField.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import router from '@/router';
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
import { reactive, ref } from 'vue';

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

const pathId = router.currentRoute.value.params['id'] || '';
const readonly = pathId !== '@new';
const id = ref(readonly ? pathId : '');
const configuration = reactive({
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
} as Configuration);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiFileEdit"
        title="编辑配置"
        main
        no-button
      >
      </SectionTitleLineWithButton>

      <BaseButtons>
        <BaseButton
          :icon="mdiArrowLeft"
          color="lightDark"
          label="返回"
          @click="router.back"
        />
        <BaseButton
          :icon="mdiFileDocumentCheckOutline"
          color="lightDark"
          @click="() => console.log(configuration)"
          label="保存"
        />
        <BaseButton :icon="mdiDelete" color="danger" label="删除" />
      </BaseButtons>

      <SectionTitleLineWithButton
        title="常规"
        :icon="mdiFileOutline"
        no-button
      />
      <CardBox>
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-10">
          <FormField label="Id" help="用于区分服务器（一经填写无法修改）">
            <FormControl
              :icon="mdiRename"
              name="id"
              type="text"
              v-model="id"
              :disabled="readonly"
            />
          </FormField>

          <FormField label="名称" help="用于标识服务器，便于管理">
            <FormControl
              :icon="mdiText"
              type="text"
              v-model="configuration.name"
            />
          </FormField>

          <FormField
            label="启动文件"
            help="启动进程的文件，通常为可执行文件或批处理文件"
          >
            <FormControl
              :icon="mdiFileOutline"
              v-model="configuration.fileName"
              type="text"
            />
          </FormField>

          <FormField label="启动参数" help="附加在启动文件后的参数">
            <FormControl
              :icon="mdiConsoleLine"
              v-model="configuration.argument"
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
                :options="encodings"
                v-model="configuration.inputEncoding"
                :icon="mdiPencil"
              />
            </FormField>

            <FormField
              label="输出编码"
              help="读取服务器输出的编码（修改后需要重新启动服务器方可生效）"
            >
              <FormControl
                :icon="mdiBookOpen"
                :options="encodings"
                v-model="configuration.outputEncoding"
              />
            </FormField>

            <FormField label="输出样式" help="控制台中渲染输出内容的样式">
              <FormControl
                :options="styles"
                :icon="mdiPalette"
                v-model="configuration.outputStyle"
              />
            </FormField>
          </div>

          <div class="my-5 md:my-0">
            <FormField
              help="将控制台内容保存到文件“Serein/logs/servers/{id}-{datetime}.log”"
            >
              <FormCheckRadio
                type="checkbox"
                name="saveLog"
                :input-value="false"
                label="保存日志"
                v-model="configuration.saveLog"
              />
            </FormField>
            <FormField help="在控制台显示由用户输入的命令">
              <FormCheckRadio
                type="checkbox"
                name="outputCommandUserInput"
                :input-value="false"
                label="显示输出的命令"
                v-model="configuration.outputCommandUserInput"
              />
            </FormField>
            <FormField
              :help="`使用Unicode字符输入（如'§'→'\\u00a7'），通常用于解决基岩版服务器输入Tellraw的编码问题`"
            >
              <FormCheckRadio
                type="checkbox"
                name="useUnicodeChars"
                :input-value="false"
                label="使用Unicode字符"
                v-model="configuration.useUnicodeChars"
              />
            </FormField>

            <BaseDivider />

            <FormField help="用于解决一些控制台无输入或输出的问题">
              <FormCheckRadio
                type="checkbox"
                name="pty_isEnabled"
                :input-value="false"
                label="使用虚拟终端输入和输出"
                v-model="configuration.pty.isEnabled"
              />
            </FormField>

            <FormField help="不推荐修改此项，除非你知道你在做什么！">
              <FormCheckRadio
                type="checkbox"
                name="pty_forceWinPty"
                :input-value="false"
                label="强制使用WinPty"
                v-model="configuration.pty.forceWinPty"
                :disabled="!configuration.pty.isEnabled"
              />
            </FormField>
          </div>
        </div>

        <FormField label="行终止符" help="用于标记每行的结尾" class="mt-3">
          <FormControl
            :icon="mdiContainEnd"
            v-model="configuration.lineTerminator"
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
              :icon="mdiMinecraft"
              v-model="configuration.portIPv4"
              inputmode="demical"
              type="number"
            />
          </FormField>

          <div>
            <FormField>
              <FormCheckRadio
                type="checkbox"
                name="autoRestart"
                :input-value="false"
                label="当退出代码不为零时自动重启"
                v-model="configuration.autoRestart"
              />
            </FormField>
            <FormField>
              <FormCheckRadio
                type="checkbox"
                name="autoStopWhenCrashing"
                :input-value="false"
                label="应用程序崩溃时自动停止服务器"
                v-model="configuration.autoStopWhenCrashing"
              />
            </FormField>
            <FormField>
              <FormCheckRadio
                type="checkbox"
                name="startWhenSettingUp"
                :input-value="false"
                label="应用程序启动后自动运行"
                v-model="configuration.startWhenSettingUp"
              />
            </FormField>
          </div>
        </div>
        <FormField label="关服命令" help="关闭服务器时输入的命令（一行一个）">
          <FormControl
            :icon="mdiStopCircleOutline"
            v-model="configuration.stopCommands"
            type="textarea"
            placeholder="一行一个"
          />
        </FormField>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
