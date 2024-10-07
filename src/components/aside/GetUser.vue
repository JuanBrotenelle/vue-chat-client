<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import { useChatStore } from "@/stores/chatsStore";

const props = defineProps({
  user: Object,
});

const chatStore = useChatStore();
const checkbox = ref(false);

const handleCheckbox = () => {
  checkbox.value = !checkbox.value;

  if (checkbox.value) {
    chatStore.newChatUsers.push(props.user!.id);
  } else {
    chatStore.newChatUsers = chatStore.newChatUsers.filter(
      (user) => user !== props.user!.id
    );
  }
};

watch(checkbox, () => {
  console.log(checkbox.value);

  console.log(chatStore.newChatUsers);
});
</script>

<template>
  <div
    @click="handleCheckbox()"
    class="p-5 flex flex-row w-full items-center gap-3 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-all select-none"
  >
    <img
      :src="props.user!.profile_picture ? `http://localhost:3000/images/${props.user!.profile_picture}` : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'"
      alt=""
      class="w-16 h-16 rounded-full object-cover pointer-events-none"
    />
    <div class="flex flex-col h-14 items-start justify-between">
      <p class="font-semibold text-xl">{{ props.user!.username }}</p>
    </div>
    <div class="w-full flex items-center justify-end">
      <input v-model="checkbox" type="checkbox" />
    </div>
  </div>
</template>
