<script setup lang="ts">
import { AnsiUp } from 'ansi_up';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { encode } from 'html-entities';

const props = defineProps({
  datas: {
    type: Array,
    require: true,
    default: () => [],
  },
  enableAnsi: Boolean,
});

const scrollToBottom = () =>
  (consoleRef.value.scrollTop = consoleRef.value.scrollHeight ?? 0);

const consoleRef = ref();
const length = computed(() => props.datas.length);
const ansiUp = new AnsiUp();
ansiUp.use_classes = true;

watch(length, () => nextTick(scrollToBottom));
onMounted(scrollToBottom);
</script>

<template>
  <div id="console" ref="consoleRef" class="py-1 overflow-y-scroll">
    <div
      v-for="(line, index) of datas"
      :key="index"
      class="whitespace-pre-wrap break-all hover:bg-[#8881] px-3 transition-colors"
    >
      <span v-if="enableAnsi" v-html="ansiUp.ansi_to_html(line as string)">
      </span>
      <span v-else v-html="encode(line as string)"></span>
    </div>
  </div>
</template>

<style>
div#console {
  font-family: Consolas, 'Courier New', Courier, '微软雅黑';
  height: 50vh;
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
