<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import axios from "axios";
import User from "@/components/AdminPanel/User.vue";

const userStore = useUserStore();
const users = ref([]);

const getUsers = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/users",
      {
        username: userStore.username,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userStore.token}`,
        },
        withCredentials: true,
      }
    );
    users.value = response.data;
    console.log(users.value);
  } catch (error) {
    console.error("Error:", error);
  }
};

onMounted(async () => {
  getUsers();
});
</script>

<template>
  <div
    class="w-full bg-components flex flex-col items-center justify-start gap-5 py-5"
  >
    <button class="fixed top-5 left-5" @click="$router.go(-1)">Назад</button>
    <User v-for="user in users" :key="user.id" :user="user" />
  </div>
</template>

<style scoped></style>
