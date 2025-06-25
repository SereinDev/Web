<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import CardBox from '@/components/CardBox.vue';
import FormControl from '@/components/FormControl.vue';
import FormField from '@/components/FormField.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import localSettingManager from '@/services/settings/localSettingManager';
import {
  mdiAlert,
  mdiEarth,
  mdiFileDocumentCheckOutline,
  mdiInformation,
  mdiText,
} from '@mdi/js';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const form = reactive({ ...localSettingManager.value.value });

function save() {
  localSettingManager.save(form);
  toast.success('保存设置成功');
}
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiEarth"
        title="网页设置"
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

      <NotificationBar color="info" :icon="mdiInformation">
        以下设置仅保存在浏览器中，切换设备或清除浏览器缓存均可能导致该设置丢失
      </NotificationBar>

      <SectionTitleLineWithButton title="最大行数" :icon="mdiText" no-button />
      <CardBox>
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-7 mb-5 md:mb-0">
          <FormField label="服务器控制台">
            <FormControl
              v-model="form.maxLines.server"
              name="serverMaxLines"
              type="number"
              min="0"
            />
          </FormField>

          <FormField label="连接控制台">
            <FormControl
              v-model="form.maxLines.connection"
              name="connectionMaxLines"
              type="number"
              min="0"
            />
          </FormField>

          <FormField label="插件控制台">
            <FormControl
              v-model="form.maxLines.plugin"
              name="pluginMaxLines"
              type="number"
              min="0"
            />
          </FormField>
        </div>

        <NotificationBar
          v-if="
            form.maxLines.server > 1000 ||
            form.maxLines.connection > 1000 ||
            form.maxLines.plugin > 1000
          "
          color="warning"
          :icon="mdiAlert"
          class="mt-5"
        >
          过高的值可能导致浏览器崩溃
        </NotificationBar>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
