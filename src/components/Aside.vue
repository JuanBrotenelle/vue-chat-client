<script setup lang="ts">
import { defineEmits, ref, watch, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "../stores/userStore";
import { useChatStore } from "@/stores/chatsStore";
import GetUser from "./aside/GetUser.vue";
import ChatUsers from "./aside/ChatUsers.vue";

const userStore = useUserStore();
const chatStore = useChatStore();

const searchValue = ref("");
const searchFocusValue = ref(false);
const gotUserList = ref([]);

const getUserList = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/getuserlist/${searchValue.value}`,
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      }
    );
    if (response.data.length > 0) {
      gotUserList.value = response.data;
    } else {
      gotUserList.value = [];
    }
  } catch (error) {
    console.error(error);
  }
};

const createChat = async () => {
  chatStore.newChatUsers.unshift({ id: userStore.id as number });
  const user_ids = chatStore.newChatUsers;

  console.log(user_ids);

  if (user_ids.length > 1) {
    try {
      const response = await axios.post(
        `http://localhost:3000/group-chat`,
        {
          user_ids,
        },
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        }
      );

      chatStore.newChatUsers = [];
    } catch (e) {
      console.error(e);
    }
  }
};

interface Emits {
  (e: "changeSettingsValue"): void;
}

watch(searchValue, () => {
  if (searchValue.value.length > 0) {
    getUserList();
  }
  if (searchValue.value === "") {
    gotUserList.value = [];
  }
});

const emit = defineEmits<Emits>();

onMounted(async () => {
  try {
    const userId = userStore.id;
    const response = await axios.get(
      `http://localhost:3000/user/${userId}/chats`,
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      }
    );
    chatStore.chats = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке чатов:", error);
  }
});
</script>

<template>
  <aside class="w-full max-h-screen z-[55] shadow-lg overflow-y-auto">
    <div class="flex flex-row items-center gap-20 justify-start pl-5 pt-5">
      <button @click="emit('changeSettingsValue')" class="spin-animation">
        <svg
          width="25"
          height="25"
          viewBox="2 2 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.4779 15.6842C23.5262 15.2975 23.5625 14.9108 23.5625 14.5C23.5625 14.0892 23.5262 13.7025 23.4779 13.3158L26.0275 11.3221C26.2571 11.1408 26.3175 10.8146 26.1725 10.5487L23.7558 6.36791C23.6108 6.10207 23.2846 6.00541 23.0187 6.10207L20.01 7.31041C19.3817 6.82707 18.705 6.42832 17.9679 6.12624L17.5087 2.92416C17.4725 2.63416 17.2187 2.41666 16.9167 2.41666H12.0833C11.7812 2.41666 11.5275 2.63416 11.4912 2.92416L11.0321 6.12624C10.295 6.42832 9.61832 6.83916 8.98999 7.31041L5.98124 6.10207C5.70332 5.99332 5.38916 6.10207 5.24416 6.36791L2.82749 10.5487C2.67041 10.8146 2.74291 11.1408 2.97249 11.3221L5.52207 13.3158C5.47374 13.7025 5.43749 14.1012 5.43749 14.5C5.43749 14.8987 5.47374 15.2975 5.52207 15.6842L2.97249 17.6779C2.74291 17.8592 2.68249 18.1854 2.82749 18.4512L5.24416 22.6321C5.38916 22.8979 5.71541 22.9946 5.98124 22.8979L8.98999 21.6896C9.61832 22.1729 10.295 22.5717 11.0321 22.8737L11.4912 26.0758C11.5275 26.3658 11.7812 26.5833 12.0833 26.5833H16.9167C17.2187 26.5833 17.4725 26.3658 17.5087 26.0758L17.9679 22.8737C18.705 22.5717 19.3817 22.1608 20.01 21.6896L23.0187 22.8979C23.2967 23.0067 23.6108 22.8979 23.7558 22.6321L26.1725 18.4512C26.3175 18.1854 26.2571 17.8592 26.0275 17.6779L23.4779 15.6842ZM14.5 18.7292C12.1679 18.7292 10.2708 16.8321 10.2708 14.5C10.2708 12.1679 12.1679 10.2708 14.5 10.2708C16.8321 10.2708 18.7292 12.1679 18.7292 14.5C18.7292 16.8321 16.8321 18.7292 14.5 18.7292Z"
            fill="black"
          />
        </svg>
      </button>

      <p class="font-semibold ml-7 text-xl">Личные сообщения</p>
    </div>
    <hr class="mt-5" />
    <div class="my-5 px-5 w-full relative">
      <svg
        class="absolute left-7 top-1/2 -translate-y-1/2"
        width="20"
        height="20"
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M28.1536 24.3092L21.7826 17.9383C22.8919 16.1421 23.5625 14.0469 23.5625 11.7812C23.5625 5.27437 18.2881 0 11.7812 0C5.27437 0 0 5.27437 0 11.7812C0 18.2881 5.27437 23.5625 11.7812 23.5625C14.0469 23.5625 16.1421 22.8919 17.9365 21.7844L24.3092 28.1554C24.8221 28.6513 25.5093 28.9258 26.2227 28.9197C26.9361 28.9136 27.6185 28.6274 28.1228 28.1229C28.6272 27.6183 28.913 26.9357 28.9188 26.2223C28.9245 25.509 28.6497 24.8219 28.1536 24.3092ZM11.7812 19.9375C7.27719 19.9375 3.625 16.2853 3.625 11.7812C3.625 7.27719 7.27719 3.625 11.7812 3.625C16.2853 3.625 19.9375 7.27719 19.9375 11.7812C19.9375 16.2853 16.2853 19.9375 11.7812 19.9375Z"
          fill="#9CA3BC"
        />
      </svg>
      <input
        @focus="searchFocusValue = true"
        @blur="searchFocusValue = false"
        v-model="searchValue"
        type="text"
        placeholder="Поиск пользователей"
        class="w-full text-lg active:outline-none focus:outline-none pl-8 pr-2 py-2 border-2 border-gray-300 rounded-md"
      />
    </div>
    <hr />
    <div v-if="searchFocusValue || gotUserList.length > 0">
      <p
        v-show="gotUserList.length < 1 && searchValue.length === 0"
        class="p-5 text-center text-gray-500"
      >
        Введите никнейм пользователя
      </p>
      <p
        v-show="gotUserList.length < 1 && searchValue.length > 0"
        class="p-5 text-center text-gray-500"
      >
        Ничего не найдено
      </p>
      <GetUser v-for="user in gotUserList" :key="user.id" :user="user" />
      <div
        v-if="chatStore.newChatUsers.length > 0"
        class="h-10 my-5 px-5 w-full flex items-center justify-center"
      >
        <button
          @click="createChat()"
          class="bg-components text-white p-2 rounded-md w-full disabled:bg-gray-400 disabled:p-2 disabled:w-full active:bg-activebutton active:p-1 active:w-[98%] transition-all"
        >
          Создать чат
        </button>
      </div>
      <hr />
    </div>

    <ChatUsers v-for="chat in chatStore.chats" :key="chat.id" :chat="chat" />
  </aside>
</template>

<style scoped></style>
