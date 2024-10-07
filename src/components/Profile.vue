<script setup lang="ts">
import { defineEmits, ref, watch } from "vue";
import { useUserStore } from "../stores/userStore";
import axios from "axios";
import { useRouter } from "vue-router";
import { useChatStore } from "@/stores/chatsStore";

const router = useRouter();
const userStore = useUserStore();
const chatStore = useChatStore();
const fileInput = ref<File | null>(null);

interface Emits {
  (e: "changeSettingsValue"): void;
}

const emit = defineEmits<Emits>();

const currentPassword = ref("");
const newPassword = ref("");
const newConfirmPassword = ref("");
const errorTitle = ref("");

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    fileInput.value = target.files[0];
  }

  uploadProfilePicture();
};

const uploadProfilePicture = async () => {
  if (!fileInput.value) return;

  const username: string | null = userStore.username;

  const formData = new FormData();
  formData.append("username", userStore.username!!);
  formData.append("profile_picture", fileInput.value);
  console.log(formData.get("username"));

  try {
    const response = await axios.post(
      "http://localhost:3000/update/profile_picture",
      formData,
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    userStore.setUser({
      profile_picture: response.data.filename,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
  }
};

const changePassword = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/update/password",
      {
        username: userStore.username,
        password: currentPassword.value,
        newPassword: newPassword.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userStore.token}`,
        },
        withCredentials: true,
      }
    );

    userStore.setUser({
      password: newPassword.value,
    });

    chatStore.chats = [];
    chatStore.currentChat = null;
    chatStore.newChatUsers = [];

    userStore.logout();

    router.push("/auth");
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

watch(newPassword, () => {
  if (newPassword.value === currentPassword.value) {
    errorTitle.value = "Новый пароль не должен совпадать с текущим";
  } else {
    errorTitle.value = "";
  }
});

watch(currentPassword, () => {
  if (currentPassword.value !== userStore.password) {
    errorTitle.value = "Неверный пароль";
  } else {
    errorTitle.value = "";
  }
});

watch(newConfirmPassword, () => {
  if (newPassword.value !== newConfirmPassword.value) {
    errorTitle.value = "Пароли не совпадают";
  } else {
    errorTitle.value = "";
  }
});
</script>

<template>
  <div
    class="absolute top-0 left-0 w-full settings-bg h-screen z-[9999] flex items-center justify-center transition-all"
  >
    <div
      @click="emit('changeSettingsValue')"
      class="absolute top-0 left-0 w-full h-screen z-[20]"
    ></div>
    <div
      class="bg-white flex flex-col items-center w-[500px] z-[9999] justify-center gap-5 p-5 rounded-xl"
    >
      <div class="w-full flex flex-row items-center gap-20">
        <button @click="emit('changeSettingsValue')">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.6652 18.1609C21.3696 18.8652 21.3696 19.9609 20.6652 20.6652C20.313 21.0174 19.8826 21.1739 19.413 21.1739C18.9435 21.1739 18.513 21.0174 18.1609 20.6652L11 13.5043L3.83913 20.6652C3.48695 21.0174 3.05652 21.1739 2.58695 21.1739C2.11739 21.1739 1.68695 21.0174 1.33478 20.6652C0.630432 19.9609 0.630432 18.8652 1.33478 18.1609L8.49565 11L1.33478 3.83913C0.630432 3.13478 0.630432 2.03913 1.33478 1.33478C2.03913 0.630432 3.13478 0.630432 3.83913 1.33478L11 8.49565L18.1609 1.33478C18.8652 0.630432 19.9609 0.630432 20.6652 1.33478C21.3696 2.03913 21.3696 3.13478 20.6652 3.83913L13.5043 11L20.6652 18.1609Z"
              fill="#9CA3BC"
            />
          </svg>
        </button>

        <h1 class="text-xl font-semibold">Настройки пользователя</h1>
      </div>
      <div class="relative w-full">
        <div class="flex w-full items-center justify-center">
          <label for="file" class="cursor-pointer relative">
            <img
              :src="
                userStore.profile_picture
                  ? `http://localhost:3000/images/${userStore.profile_picture}`
                  : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
              "
              class="w-[15vh] h-[15vh] rounded-[70px] object-cover pointer-events-none"
              alt=""
            />
            <div
              class="absolute bg-white p-2 rounded-md bottom-0 left-0 shadow"
            >
              <svg
                class=""
                width="25"
                height="25"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 0H3C2.20435 0 1.44129 0.316071 0.87868 0.87868C0.316071 1.44129 0 2.20435 0 3V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.1645 19.9977 17.3284 19.981 17.49 19.95L17.79 19.88H17.86H17.91L18.28 19.74L18.41 19.67C18.51 19.61 18.62 19.56 18.72 19.49C18.8535 19.3918 18.9805 19.2849 19.1 19.17L19.17 19.08C19.2682 18.9805 19.3585 18.8735 19.44 18.76L19.53 18.63C19.5998 18.5187 19.6601 18.4016 19.71 18.28C19.7374 18.232 19.7609 18.1818 19.78 18.13C19.83 18.01 19.86 17.88 19.9 17.75V17.6C19.9567 17.4046 19.9903 17.2032 20 17V3C20 2.20435 19.6839 1.44129 19.1213 0.87868C18.5587 0.316071 17.7956 0 17 0ZM3 18C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V12.69L5.29 9.39C5.38296 9.29627 5.49356 9.22188 5.61542 9.17111C5.73728 9.12034 5.86799 9.0942 6 9.0942C6.13201 9.0942 6.26272 9.12034 6.38458 9.17111C6.50644 9.22188 6.61704 9.29627 6.71 9.39L15.31 18H3ZM18 17C17.9991 17.1233 17.9753 17.2453 17.93 17.36C17.9071 17.4087 17.8804 17.4556 17.85 17.5C17.8232 17.5423 17.7931 17.5825 17.76 17.62L12.41 12.27L13.29 11.39C13.383 11.2963 13.4936 11.2219 13.6154 11.1711C13.7373 11.1203 13.868 11.0942 14 11.0942C14.132 11.0942 14.2627 11.1203 14.3846 11.1711C14.5064 11.2219 14.617 11.2963 14.71 11.39L18 14.69V17ZM18 11.86L16.12 10C15.5477 9.45699 14.7889 9.15428 14 9.15428C13.2111 9.15428 12.4523 9.45699 11.88 10L11 10.88L8.12 8C7.54772 7.45699 6.7889 7.15428 6 7.15428C5.2111 7.15428 4.45228 7.45699 3.88 8L2 9.86V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H17C17.2652 2 17.5196 2.10536 17.7071 2.29289C17.8946 2.48043 18 2.73478 18 3V11.86ZM11.5 4C11.2033 4 10.9133 4.08797 10.6666 4.2528C10.42 4.41762 10.2277 4.65189 10.1142 4.92597C10.0006 5.20006 9.97094 5.50166 10.0288 5.79264C10.0867 6.08361 10.2296 6.35088 10.4393 6.56066C10.6491 6.77044 10.9164 6.9133 11.2074 6.97118C11.4983 7.02906 11.7999 6.99935 12.074 6.88582C12.3481 6.77229 12.5824 6.58003 12.7472 6.33335C12.912 6.08668 13 5.79667 13 5.5C13 5.10218 12.842 4.72064 12.5607 4.43934C12.2794 4.15804 11.8978 4 11.5 4Z"
                  fill="#9CA3BC"
                />
              </svg>
            </div>
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
        <div class="w-full mt-2">
          <p class="text-gray-500 text-xl text-center">
            @{{ userStore.username }}
          </p>
          <div class="mt-5">
            <p class="mb-2 text-lg text-gray-500 text-center">Сменить пароль</p>
            <div class="w-full relative">
              <svg
                class="absolute left-0 top-1/2 -translate-y-1/2"
                width="25"
                height="25"
                viewBox="2 0 25 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 15.1667C13.6448 15.1625 13.2969 15.2673 13.003 15.4669C12.7092 15.6664 12.4835 15.9512 12.3564 16.283C12.2293 16.6147 12.2069 16.9773 12.2922 17.3222C12.3774 17.667 12.5663 17.9774 12.8333 18.2117V19.8333C12.8333 20.1428 12.9562 20.4395 13.175 20.6583C13.3938 20.8771 13.6906 21 14 21C14.3094 21 14.6062 20.8771 14.8249 20.6583C15.0437 20.4395 15.1667 20.1428 15.1667 19.8333V18.2117C15.4337 17.9774 15.6225 17.667 15.7078 17.3222C15.7931 16.9773 15.7707 16.6147 15.6436 16.283C15.5165 15.9512 15.2908 15.6664 14.997 15.4669C14.7031 15.2673 14.3552 15.1625 14 15.1667ZM19.8333 10.5V8.16668C19.8333 6.61958 19.2187 5.13585 18.1248 4.04189C17.0308 2.94793 15.5471 2.33334 14 2.33334C12.4529 2.33334 10.9692 2.94793 9.8752 4.04189C8.78124 5.13585 8.16666 6.61958 8.16666 8.16668V10.5C7.2384 10.5 6.34816 10.8688 5.69178 11.5251C5.03541 12.1815 4.66666 13.0718 4.66666 14V22.1667C4.66666 23.0949 5.03541 23.9852 5.69178 24.6416C6.34816 25.2979 7.2384 25.6667 8.16666 25.6667H19.8333C20.7616 25.6667 21.6518 25.2979 22.3082 24.6416C22.9646 23.9852 23.3333 23.0949 23.3333 22.1667V14C23.3333 13.0718 22.9646 12.1815 22.3082 11.5251C21.6518 10.8688 20.7616 10.5 19.8333 10.5ZM10.5 8.16668C10.5 7.23842 10.8687 6.34818 11.5251 5.6918C12.1815 5.03543 13.0717 4.66668 14 4.66668C14.9282 4.66668 15.8185 5.03543 16.4749 5.6918C17.1312 6.34818 17.5 7.23842 17.5 8.16668V10.5H10.5V8.16668ZM21 22.1667C21 22.4761 20.8771 22.7728 20.6583 22.9916C20.4395 23.2104 20.1427 23.3333 19.8333 23.3333H8.16666C7.85724 23.3333 7.56049 23.2104 7.3417 22.9916C7.12291 22.7728 6.99999 22.4761 6.99999 22.1667V14C6.99999 13.6906 7.12291 13.3938 7.3417 13.1751C7.56049 12.9563 7.85724 12.8333 8.16666 12.8333H19.8333C20.1427 12.8333 20.4395 12.9563 20.6583 13.1751C20.8771 13.3938 21 13.6906 21 14V22.1667Z"
                  fill="#9CA3BC"
                />
              </svg>

              <input
                v-model="currentPassword"
                type="password"
                placeholder="Пароль"
                class="w-full pl-7 py-1 text-lg active:outline-none rounded-sm focus:outline-none"
              />
            </div>
            <div>
              <div class="w-full relative">
                <svg
                  class="absolute left-0 top-1/2 -translate-y-1/2"
                  width="25"
                  height="25"
                  viewBox="2 0 25 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 15.1667C13.6448 15.1625 13.2969 15.2673 13.003 15.4669C12.7092 15.6664 12.4835 15.9512 12.3564 16.283C12.2293 16.6147 12.2069 16.9773 12.2922 17.3222C12.3774 17.667 12.5663 17.9774 12.8333 18.2117V19.8333C12.8333 20.1428 12.9562 20.4395 13.175 20.6583C13.3938 20.8771 13.6906 21 14 21C14.3094 21 14.6062 20.8771 14.8249 20.6583C15.0437 20.4395 15.1667 20.1428 15.1667 19.8333V18.2117C15.4337 17.9774 15.6225 17.667 15.7078 17.3222C15.7931 16.9773 15.7707 16.6147 15.6436 16.283C15.5165 15.9512 15.2908 15.6664 14.997 15.4669C14.7031 15.2673 14.3552 15.1625 14 15.1667ZM19.8333 10.5V8.16668C19.8333 6.61958 19.2187 5.13585 18.1248 4.04189C17.0308 2.94793 15.5471 2.33334 14 2.33334C12.4529 2.33334 10.9692 2.94793 9.8752 4.04189C8.78124 5.13585 8.16666 6.61958 8.16666 8.16668V10.5C7.2384 10.5 6.34816 10.8688 5.69178 11.5251C5.03541 12.1815 4.66666 13.0718 4.66666 14V22.1667C4.66666 23.0949 5.03541 23.9852 5.69178 24.6416C6.34816 25.2979 7.2384 25.6667 8.16666 25.6667H19.8333C20.7616 25.6667 21.6518 25.2979 22.3082 24.6416C22.9646 23.9852 23.3333 23.0949 23.3333 22.1667V14C23.3333 13.0718 22.9646 12.1815 22.3082 11.5251C21.6518 10.8688 20.7616 10.5 19.8333 10.5ZM10.5 8.16668C10.5 7.23842 10.8687 6.34818 11.5251 5.6918C12.1815 5.03543 13.0717 4.66668 14 4.66668C14.9282 4.66668 15.8185 5.03543 16.4749 5.6918C17.1312 6.34818 17.5 7.23842 17.5 8.16668V10.5H10.5V8.16668ZM21 22.1667C21 22.4761 20.8771 22.7728 20.6583 22.9916C20.4395 23.2104 20.1427 23.3333 19.8333 23.3333H8.16666C7.85724 23.3333 7.56049 23.2104 7.3417 22.9916C7.12291 22.7728 6.99999 22.4761 6.99999 22.1667V14C6.99999 13.6906 7.12291 13.3938 7.3417 13.1751C7.56049 12.9563 7.85724 12.8333 8.16666 12.8333H19.8333C20.1427 12.8333 20.4395 12.9563 20.6583 13.1751C20.8771 13.3938 21 13.6906 21 14V22.1667Z"
                    fill="#9CA3BC"
                  />
                </svg>

                <input
                  v-model="newPassword"
                  type="password"
                  placeholder="Новый пароль"
                  class="w-full pl-7 py-1 text-lg active:outline-none rounded-sm focus:outline-none"
                />
              </div>
              <div class="w-full relative">
                <svg
                  class="absolute left-0 top-1/2 -translate-y-1/2"
                  width="25"
                  height="25"
                  viewBox="2 0 25 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 15.1667C13.6448 15.1625 13.2969 15.2673 13.003 15.4669C12.7092 15.6664 12.4835 15.9512 12.3564 16.283C12.2293 16.6147 12.2069 16.9773 12.2922 17.3222C12.3774 17.667 12.5663 17.9774 12.8333 18.2117V19.8333C12.8333 20.1428 12.9562 20.4395 13.175 20.6583C13.3938 20.8771 13.6906 21 14 21C14.3094 21 14.6062 20.8771 14.8249 20.6583C15.0437 20.4395 15.1667 20.1428 15.1667 19.8333V18.2117C15.4337 17.9774 15.6225 17.667 15.7078 17.3222C15.7931 16.9773 15.7707 16.6147 15.6436 16.283C15.5165 15.9512 15.2908 15.6664 14.997 15.4669C14.7031 15.2673 14.3552 15.1625 14 15.1667ZM19.8333 10.5V8.16668C19.8333 6.61958 19.2187 5.13585 18.1248 4.04189C17.0308 2.94793 15.5471 2.33334 14 2.33334C12.4529 2.33334 10.9692 2.94793 9.8752 4.04189C8.78124 5.13585 8.16666 6.61958 8.16666 8.16668V10.5C7.2384 10.5 6.34816 10.8688 5.69178 11.5251C5.03541 12.1815 4.66666 13.0718 4.66666 14V22.1667C4.66666 23.0949 5.03541 23.9852 5.69178 24.6416C6.34816 25.2979 7.2384 25.6667 8.16666 25.6667H19.8333C20.7616 25.6667 21.6518 25.2979 22.3082 24.6416C22.9646 23.9852 23.3333 23.0949 23.3333 22.1667V14C23.3333 13.0718 22.9646 12.1815 22.3082 11.5251C21.6518 10.8688 20.7616 10.5 19.8333 10.5ZM10.5 8.16668C10.5 7.23842 10.8687 6.34818 11.5251 5.6918C12.1815 5.03543 13.0717 4.66668 14 4.66668C14.9282 4.66668 15.8185 5.03543 16.4749 5.6918C17.1312 6.34818 17.5 7.23842 17.5 8.16668V10.5H10.5V8.16668ZM21 22.1667C21 22.4761 20.8771 22.7728 20.6583 22.9916C20.4395 23.2104 20.1427 23.3333 19.8333 23.3333H8.16666C7.85724 23.3333 7.56049 23.2104 7.3417 22.9916C7.12291 22.7728 6.99999 22.4761 6.99999 22.1667V14C6.99999 13.6906 7.12291 13.3938 7.3417 13.1751C7.56049 12.9563 7.85724 12.8333 8.16666 12.8333H19.8333C20.1427 12.8333 20.4395 12.9563 20.6583 13.1751C20.8771 13.3938 21 13.6906 21 14V22.1667Z"
                    fill="#9CA3BC"
                  />
                </svg>

                <input
                  v-model="newConfirmPassword"
                  type="password"
                  placeholder="Подтвердите пароль"
                  class="w-full pl-7 py-1 text-lg active:outline-none rounded-sm focus:outline-none"
                />
              </div>
            </div>
            <div class="mt-2 h-6">
              <p v-if="errorTitle" class="text-red-500 text-sm">
                {{ errorTitle }}
              </p>
            </div>
            <div class="h-10 mt-5 w-full flex items-center justify-center">
              <button
                @click="changePassword()"
                :disabled="errorTitle || !newPassword || !newConfirmPassword"
                class="bg-components text-white p-2 rounded-md w-full disabled:bg-gray-400 disabled:p-2 disabled:w-full active:bg-activebutton active:p-1 active:w-[98%] transition-all"
              >
                Сменить пароль
              </button>
            </div>
            <div
              v-if="userStore.role === 'admin'"
              class="h-10 mt-5 w-full flex items-center justify-center"
            >
              <button
                @click="router.push('/admin')"
                class="bg-components text-white p-2 rounded-md w-full disabled:bg-gray-400 disabled:p-2 disabled:w-full active:bg-activebutton active:p-1 active:w-[98%] transition-all"
              >
                Список всех пользователей
              </button>
            </div>
            <div class="h-10 mt-5 w-full flex items-center justify-center">
              <button
                @click="
                  router.push('/auth');
                  userStore.logout();
                "
                class="bg-red-500 text-white p-2 rounded-md w-full disabled:bg-red-700 disabled:p-2 disabled:w-full active:bg-red-700 active:p-1 active:w-[98%] transition-all"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
