<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  dataValue: Boolean,
});

interface Emits {
  (e: "changeForm"): void;
  (e: "checkUserName", username: string): void;
  (e: "checkPassword", password: string): void;
}

const username = ref("");
const password = ref("");
const confirmPassword = ref("");

const errorTitle = ref("");

const emit = defineEmits<Emits>();

const completeRegister = async () => {
  fetch;
};

watch(username, () => {
  emit("checkUserName", username.value);
  if (props.dataValue === false) {
    errorTitle.value = "Логин должен содержать латинские буквы или цифры";
  } else {
    errorTitle.value = "";
  }
});

watch(password, () => {
  emit("checkPassword", password.value);
  if (props.dataValue === false) {
    errorTitle.value =
      "Пароль должен содержать латинские буквы, цифры или специальные символы";
  } else {
    errorTitle.value = "";
  }
});

watch(confirmPassword, () => {
  if (password.value !== confirmPassword.value) {
    errorTitle.value = "Пароли не совпадают";
  } else {
    errorTitle.value = "";
  }
});

const registerUser = async () => {
  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400 && data.error === "Username already exists") {
        errorTitle.value = "Пользователь с таким именем уже существует";
      } else {
        errorTitle.value = data.error || "Ошибка регистрации";
      }
      return;
    }

    errorTitle.value = "";
    emit("changeForm");
  } catch (error) {
    errorTitle.value = "Ошибка сети или сервера. Попробуйте позже.";
  }
};
</script>

<template>
  <div class="bg-white flex flex-col px-20 py-10 rounded-xl shadow-xl z-10">
    <h1 class="text-3xl font-semibold">Регистрация</h1>
    <p class="text-gray-500 mt-2">
      Если у вас еще нет аккаунта, то создайте его
    </p>
    <div class="flex flex-col mt-8 gap-4 items-center w-full">
      <div class="w-full relative">
        <svg
          class="absolute left-0 top-1/2 -translate-y-1/2"
          width="22"
          height="22"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 0C9.18593 0.00370554 6.00866 1.32186 3.66526 3.66526C1.32186 6.00866 0.00370554 9.18593 0 12.5C0.0055527 15.8135 1.3243 18.9897 3.6673 21.3327C6.0103 23.6757 9.1865 24.9944 12.5 25C15.8152 25 18.9946 23.683 21.3388 21.3388C23.683 18.9946 25 15.8152 25 12.5C25 9.18479 23.683 6.00537 21.3388 3.66117C18.9946 1.31696 15.8152 0 12.5 0ZM20.103 19.713C19.401 18.297 18.3172 17.1054 16.974 16.2726C15.6307 15.4397 14.0815 14.9989 12.501 14.9997C10.9206 15.0005 9.37177 15.443 8.02941 16.2773C6.68705 17.1115 5.60453 18.3043 4.904 19.721C3.03491 17.7825 1.99344 15.1928 2 12.5C2 9.71523 3.10625 7.04451 5.07538 5.07538C7.04451 3.10625 9.71523 2 12.5 2C15.2848 2 17.9555 3.10625 19.9246 5.07538C21.8938 7.04451 23 9.71523 23 12.5C23.0063 15.189 21.9675 17.7753 20.103 19.713ZM12.5 5C11.61 5 10.74 5.26392 9.99993 5.75839C9.25991 6.25285 8.68314 6.95566 8.34254 7.77792C8.00195 8.60019 7.91283 9.50499 8.08647 10.3779C8.2601 11.2508 8.68868 12.0526 9.31802 12.682C9.94736 13.3113 10.7492 13.7399 11.6221 13.9135C12.495 14.0872 13.3998 13.9981 14.2221 13.6575C15.0443 13.3169 15.7471 12.7401 16.2416 12.0001C16.7361 11.26 17 10.39 17 9.5C17 8.90905 16.8836 8.32389 16.6575 7.77792C16.4313 7.23196 16.0998 6.73588 15.682 6.31802C15.2641 5.90016 14.768 5.56869 14.2221 5.34254C13.6761 5.1164 13.0909 5 12.5 5Z"
            fill="#9CA3BC"
          />
        </svg>

        <input
          v-model="username"
          type="text"
          placeholder="Логин"
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
          v-model="password"
          type="password"
          placeholder="Пароль"
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
          v-model="confirmPassword"
          type="password"
          placeholder="Подтвердите пароль"
          class="w-full pl-7 py-1 text-lg active:outline-none rounded-sm focus:outline-none"
        />
      </div>
    </div>
    <div class="mt-2 h-6">
      <p v-if="errorTitle" class="text-red-500 text-sm">{{ errorTitle }}</p>
    </div>
    <div class="h-10 mt-5 w-full flex items-center justify-center">
      <button
        @click="registerUser()"
        :disabled="errorTitle || !username || !password || !confirmPassword"
        class="bg-components text-white p-2 rounded-md w-full disabled:bg-gray-400 disabled:p-2 disabled:w-full active:bg-activebutton active:p-1 active:w-[98%] transition-all"
      >
        Зарегистрироваться
      </button>
    </div>
    <button
      @click="emit('changeForm')"
      class="mt-2 text-sm underline text-gray-500"
    >
      Уже есть аккаунт? Войти
    </button>
  </div>
</template>

<style scoped></style>
