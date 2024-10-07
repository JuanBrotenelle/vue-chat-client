<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useChatStore } from "@/stores/chatsStore";
import { useUserStore } from "@/stores/userStore";
import Message from "./Chat/Message.vue";

const userStore = useUserStore();
const chatStore = useChatStore();
const fileInput = ref<File | null>(null);
const message = ref("");

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    fileInput.value = target.files[0];
  }
};

const currentChatInfo = computed(() => {
  const currentChat = chatStore.chats.find(
    (c) => c.id === chatStore.currentChat
  );

  if (currentChat) {
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

const reversedMessages = computed(() => {
  const currentChat = chatStore.chats.find(
    (c) => c.id === chatStore.currentChat
  );
  console.log("Current chat messages:", currentChat?.messages);
  return currentChat?.messages ? [...currentChat.messages].reverse() : [];
});

const sendMessage = () => {
  const formData = new FormData();
  formData.append("message", message.value);

  if (fileInput.value) {
    formData.append("file", fileInput.value);
  }

  chatStore.sendMessage(
    formData,
    chatStore.currentChat!,
    userStore.id!,
    userStore.token!
  );
  message.value = "";
  fileInput.value = null;
};

const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});

watch(reversedMessages, () => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<template>
  <div
    v-if="chatStore.currentChat"
    class="relative w-full h-full bg-components"
  >
    <div
      class="absotute top-0 left-0 w-full bg-white p-2 flex items-center justify-between"
    >
      <div class="flex flex-row items-start gap-2">
        <img
          :src="currentChatInfo.avatar"
          alt=""
          class="w-16 h-16 rounded-full object-cover pointer-events-none"
        />
        <p class="text-lg font-semibold">
          {{ currentChatInfo.username }}
        </p>
      </div>
    </div>
    <div
      ref="messagesContainer"
      class="p-5 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
    >
      <Message
        v-for="message in reversedMessages"
        :users="
          chatStore.chats.find((c) => c.id === chatStore.currentChat)?.users
        "
        :key="message.id"
        :message="message"
      />
      <br />
    </div>
    <div
      class="absolute bottom-0 left-0 w-full bg-white z-50 flex items-center p-2 gap-5"
    >
      <div class="ml-2">
        <label for="file" class="cursor-pointer">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.6961 24.1961C10.5292 24.196 10.3661 24.1465 10.2274 24.0538C10.0887 23.9611 9.98056 23.8293 9.91671 23.6752C9.85287 23.521 9.83616 23.3514 9.8687 23.1878C9.90124 23.0241 9.98157 22.8738 10.0995 22.7558L20.8531 12.0022C21.3689 11.4864 21.7781 10.8741 22.0572 10.2002C22.3363 9.52627 22.48 8.80398 22.48 8.07454C22.48 7.34511 22.3363 6.62282 22.0572 5.94891C21.7781 5.275 21.3689 4.66267 20.8531 4.14689C20.3373 3.6311 19.725 3.22195 19.0511 2.94281C18.3772 2.66367 17.6549 2.52 16.9255 2.52C16.196 2.52 15.4738 2.66367 14.7998 2.94281C14.1259 3.22195 13.5136 3.6311 12.9978 4.14689L3.66679 13.4779C3.33671 13.8081 3.07488 14.2 2.89626 14.6313C2.71765 15.0626 2.62573 15.5249 2.62577 15.9917C2.62581 16.4586 2.7178 16.9209 2.89649 17.3521C3.07518 17.7834 3.33707 18.1753 3.66721 18.5054C3.99735 18.8355 4.38926 19.0973 4.82059 19.2759C5.25191 19.4545 5.71419 19.5465 6.18104 19.5464C6.64788 19.5464 7.11015 19.4544 7.54144 19.2757C7.97274 19.097 8.36461 18.8351 8.69469 18.505L18.0249 9.17479C18.1693 9.03036 18.2839 8.85889 18.362 8.67019C18.4402 8.48148 18.4804 8.27922 18.4804 8.07496C18.4804 7.87071 18.4402 7.66845 18.362 7.47974C18.2839 7.29103 18.1693 7.11957 18.0249 6.97514C17.8804 6.8307 17.709 6.71613 17.5203 6.63797C17.3316 6.5598 17.1293 6.51957 16.9251 6.51957C16.7208 6.51957 16.5185 6.5598 16.3298 6.63797C16.1411 6.71613 15.9697 6.8307 15.8252 6.97514L7.90832 14.8912C7.83048 14.9718 7.73738 15.0361 7.63444 15.0803C7.5315 15.1245 7.42078 15.1478 7.30875 15.1488C7.19672 15.1497 7.08561 15.1284 6.98192 15.086C6.87823 15.0435 6.78402 14.9809 6.7048 14.9017C6.62558 14.8224 6.56292 14.7282 6.5205 14.6245C6.47808 14.5208 6.45673 14.4097 6.4577 14.2977C6.45867 14.1857 6.48195 14.075 6.52617 13.972C6.57039 13.8691 6.63467 13.776 6.71526 13.6981L14.6322 5.78207C14.9333 5.48097 15.2907 5.24212 15.6841 5.07916C16.0776 4.9162 16.4992 4.83233 16.9251 4.83233C17.3509 4.83233 17.7725 4.9162 18.166 5.07916C18.5594 5.24212 18.9168 5.48097 19.2179 5.78207C19.519 6.08318 19.7579 6.44065 19.9209 6.83406C20.0838 7.22747 20.1677 7.64913 20.1677 8.07496C20.1677 8.50079 20.0838 8.92245 19.9209 9.31587C19.7579 9.70928 19.519 10.0667 19.2179 10.3679L9.88438 19.698C9.39787 20.186 8.81994 20.5732 8.18364 20.8376C7.54735 21.102 6.86517 21.2384 6.17612 21.2389C5.48708 21.2395 4.80469 21.1041 4.16799 20.8407C3.53129 20.5773 2.95276 20.1909 2.46551 19.7037C1.97825 19.2165 1.59182 18.638 1.32833 18.0014C1.06483 17.3647 0.929437 16.6823 0.929887 15.9933C0.930337 15.3042 1.06662 14.622 1.33095 13.9857C1.59528 13.3494 1.98246 12.7714 2.47035 12.2849L11.8048 2.95467C13.1627 1.59668 15.0046 0.833771 16.9251 0.833771C18.8455 0.833771 20.6874 1.59668 22.0453 2.95467C23.4033 4.31265 24.1662 6.15448 24.1662 8.07496C24.1662 9.99545 23.4033 11.8373 22.0453 13.1953L11.2926 23.9489C11.1344 24.1071 10.9198 24.196 10.6961 24.1961Z"
              fill="#9CA3BC"
            />
          </svg>
        </label>
        <input
          @change="handleFileChange"
          type="file"
          name="file"
          id="file"
          accept=".jpg,.png,.jpeg"
          class="hidden"
        />
      </div>
      <div v-if="fileInput" class="flex items-center">
        <span class="mr-2">{{ fileInput.name }}</span>
        <button @click="fileInput = null" class="text-red-500">Отменить</button>
      </div>
      <textarea
        @keyup.enter.prevent="sendMessage()"
        v-model="message"
        name="message"
        id=""
        rows="1"
        placeholder="Написать сообщение"
        class="text-xl active:outline-none focus:outline-none w-full resize-none"
      ></textarea>
      <button
        @click="sendMessage()"
        class="bg-components p-2 text-white rounded-md active:bg-activebutton transition-all"
      >
        Отправить
      </button>
    </div>
  </div>
  <div
    v-else
    class="bg-components w-full h-full flex items-center justify-center"
  >
    <p class="text-xl text-white font-semibold bg-[#1f1f1f36] p-10 rounded-xl">
      Выберите чат или создайте новый
    </p>
  </div>
</template>
