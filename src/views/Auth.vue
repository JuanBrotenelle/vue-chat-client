<script lang="ts" setup>
import { ref } from "vue";
import Register from "@/components/auth/Register.vue";
import Login from "@/components/auth/Login.vue";

const defaultForm = ref("login");
const changeForm = () => {
  defaultForm.value = defaultForm.value === "login" ? "register" : "login";
};

const dataValue = ref(true);
const checkUserName = (username: string): boolean => {
  dataValue.value = false;
  const allowedChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < username.length; i++) {
    if (!allowedChars.includes(username[i])) {
      dataValue.value = false;
      return false;
    }
  }

  dataValue.value = true;
  return true;
};
const checkPassword = (password: string) => {
  dataValue.value = false;

  let register =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&!@#$%";

  for (let i = 0; i < password.length; i++) {
    if (!register.includes(password[i])) {
      dataValue.value = false;
      return false;
    }
  }

  dataValue.value = true;
  return true;
};
</script>

<template>
  <div
    class="w-full h-screen flex flex-col justify-center items-center bg-components relative"
  >
    <Login
      v-if="defaultForm === 'login'"
      @changeForm="changeForm"
      @checkUserName="checkUserName"
      @checkPassword="checkPassword"
      :dataValue="dataValue"
    />
    <Register
      v-if="defaultForm === 'register'"
      @changeForm="changeForm"
      @checkUserName="checkUserName"
      @checkPassword="checkPassword"
      :dataValue="dataValue"
    />
    <img
      src="https://img.freepik.com/free-vector/abstract-organic-pattern-design-background_1048-19286.jpg?t=st=1728051949~exp=1728055549~hmac=fb9d375cde90af29758034507c7142c3a85864411a93b5a146183895c1ce9b59&w=1380"
      alt=""
      class="absolute top-0 left-0 w-full h-full object-cover z-[0] blur-sm opacity-10 pointer-events-none"
    />
  </div>
</template>

<style scoped></style>
