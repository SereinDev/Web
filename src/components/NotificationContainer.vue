<script setup lang="ts">
import NotificationBar from '@/components/NotificationBar.vue';
import { notificationMap } from '@/services/notification';
</script>

<template>
  <div
    id="notification-container"
    class="fixed flex items-end flex-col-reverse z-50 top-20 right-0 left-0 bottom-0 m-5 pointer-events-none drop-shadow"
  >
    <TransitionGroup name="notify">
      <NotificationBar
        v-for="kv in notificationMap?.entries() || []"
        :key="kv[0]"
        :color="kv[1].type"
        :icon="kv[1].icon"
        class="pointer-events-auto mt-3 mb-0 mb:w-30 whitespace-pre-line"
        @dismiss="() => notificationMap.delete(kv[0])"
      >
        <div class="mr-2 flex flex-col">
          <div>
            <b> {{ kv[1].title }} </b>
          </div>
          <div>{{ kv[1].message }}</div>
        </div>
      </NotificationBar>
    </TransitionGroup>
  </div>
</template>

<style scoped>
#notification-container:deep(div > div) {
  display: flex !important;
  flex-direction: row;
  margin-bottom: 0;
  text-align: initial;
}

#notification-container:deep(> div) {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  transition:
    opacity 0.3s,
    transform 0.5s;
}

.notify-leave-active {
  position: absolute;
}

.notify-enter-from,
.notify-leave-to {
  opacity: 0;
  transform: translateX(300px);
}
</style>
