<script setup lang="ts">
import { PipePacket } from '@/types/packet';
import { AnsiUp } from 'ansi_up';
import { encode } from 'html-entities';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps({
  datas: {
    type: Array,
    require: true,
    default: () => [] as PipePacket[],
  },
  type: {
    type: String,
    default: '',
  },
});

const scrollToBottom = () =>
  (consoleRef.value.scrollTop = consoleRef.value.scrollHeight ?? 0);

const consoleRef = ref();
const typed = computed(() => props.datas as PipePacket[]);
const length = computed(() => props.datas.length);
const ansiUp = new AnsiUp();
ansiUp.use_classes = true;

watch(length, () => nextTick(scrollToBottom));
onMounted(scrollToBottom);
</script>

<template>
  <div id="console" ref="consoleRef" class="py-1 overflow-y-scroll">
    <div
      v-for="(line, index) of typed"
      :key="index"
      class="whitespace-pre-wrap break-all hover:bg-[#8881] px-3 transition-colors"
    >
      <span
        v-if="line.type === 'output' && line.origin === 'server'"
        v-html="ansiUp.ansi_to_html(line.data)"
      >
      </span>

      <span
        v-else-if="line.type === 'input' && line.origin === 'server'"
        class="opacity-70"
        title="输入"
      >
        >> {{ line.data }}
      </span>

      <span v-else-if="line.type === 'information' && line.origin === 'Serein'">
        <span class="text-[#4B738D]"
          >[<span class="hover:underline hover:font-bold">Serein</span>]</span
        >
        {{ line.data }}
      </span>

      <span v-else-if="type == 'plugins' && line.type === 'information'">
        <span class="text-sky-500"
          >[<span class="hover:underline">Info</span>]</span
        >
        {{ line.data }}
      </span>

      <span v-else-if="line.type === 'sent' || line.type === 'received'">
        <span
          :class="line.type === 'sent' ? 'text-emerald-500' : 'text-blue-500'"
          >[<span class="hover:underline">{{
            line.type === 'sent' ? 'Sent' : 'Recv'
          }}</span
          >]</span
        >
        {{ line.data }}
      </span>

      <span v-else-if="line.type === 'warning'">
        <span class="text-yellow-500"
          >[<span class="hover:underline font-bold">Warn</span>]</span
        >
        {{ type === 'plugins' ? `[${line.origin}] ${line.data}` : line.data }}
      </span>

      <span v-else-if="line.type === 'error'">
        <span class="text-red-500"
          >[<span class="hover:underline font-bold">Error</span>]</span
        >
        {{ type === 'plugins' ? `[${line.origin}] ${line.data}` : line.data }}
      </span>

      <span v-else v-html="encode(line.data)"></span>
    </div>
  </div>
</template>

<style>
div#console {
  font-family: Consolas, 'Courier New', Courier, '微软雅黑';
  height: 40vh;
  min-height: 500px;
  scrollbar-width: thin;
  scrollbar-color: rgb(156, 163, 175) rgb(249, 250, 251);
}

div#console::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.dark div#console {
  color-scheme: dark;
  scrollbar-color: rgb(71, 85, 105) rgb(30, 41, 59);
}
</style>
