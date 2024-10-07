<script lang="ts" setup>
import { useUserStore } from "../../stores/userStore";
import { useChatStore } from "../../stores/chatsStore";
import { defineProps, computed } from "vue";

const props = defineProps({
  chat: Object,
});

const chatStore = useChatStore();
const userStore = useUserStore();

const getPhotoChat = () => {
  return (
    props.chat?.users?.find((user: any) => user.id_user !== userStore.id)
      ?.profile_picture || ""
  );
};

const getLastMessageName = () => {
  if (!props.chat?.messages || props.chat.messages.length === 0) {
    return "Нет сообщений";
  }

  let username = props.chat.users?.find(
    (user: any) => user.id_user === props.chat.messages[0].user_id
  )?.username_user;

  return username === userStore.username
    ? "Вы: " + props.chat.messages[0].message
    : username + ": " + props.chat.messages[0].message;
};

const getChatName = () => {
  let name: any = [];

  props.chat?.users?.forEach((user: any) => {
    if (user.id_user !== userStore.id) {
      name.push(user.username_user);
    }
  });

  return name.join(", ");
};

const currentChatInfo = computed(() => {
  const currentChat = chatStore.chats.find((c) => c.id === props.chat?.id);

  if (currentChat && currentChat.users) {
    const users = currentChat.users.filter((u) => u.id_user !== userStore.id);

    if (users.length === 1) {
      return {
        avatar: users[0].profile_picture
          ? `http://localhost:3000/images/${users[0].profile_picture}`
          : "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1",
        username: users[0].username_user,
      };
    } else if (users.length > 1) {
      return {
        avatar:
          "https://media.istockphoto.com/id/1158561473/vector/three-persons-icon-black-vector.jpg?s=612x612&w=0&k=20&c=UvL4Nvz9nL4zi5RdjAabosuFer98suMTA-FheZ2KLlQ=",
        username: users.map((u) => u.username_user).join(", "),
      };
    }
  }

  return {
    avatar:
      "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1",
    username: "",
  };
});
</script>

<template>
  <div
    @click="chatStore.currentChat = props.chat!.id"
    :style="{ backgroundColor: chatStore.currentChat === props.chat!.id ? '#E5E7EB' : '' }"
    class="p-5 flex flex-row w-full items-center gap-3 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-all select-none"
  >
    <img
      :src="currentChatInfo.avatar"
      alt=""
      class="w-16 h-16 rounded-full object-cover pointer-events-none"
    />
    <div class="flex flex-col h-14 items-start justify-between">
      <p class="font-semibold text-xl">{{ getChatName() }}</p>
      <p class="text-sm text-gray-500 truncate max-w-[350px]">
        {{ getLastMessageName() }}
      </p>
    </div>
  </div>
</template>
