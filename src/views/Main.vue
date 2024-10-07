<script setup lang="ts">
import Aside from "@/components/Aside.vue";
import Profile from "@/components/Profile.vue";
import Chat from "@/components/Chat.vue";
import { ref } from "vue";

const settingsValue = ref(false);

const changeSettingsValue = () => {
  settingsValue.value = !settingsValue.value;
};
</script>

<template>
  <Profile v-if="settingsValue" @changeSettingsValue="changeSettingsValue" />
  <div class="w-full h-screen grid grid-cols-chat">
    <Aside @changeSettingsValue="changeSettingsValue" />
    <Chat />
  </div>
</template>

<style scoped>
.spin-animation:hover {
  animation: Spin 0.5s linear none;
}

.settings-bg {
  background-color: rgba(0, 0, 0, 0.315);
}

@keyframes Spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
</style>
