<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps({
  user: Object,
});
</script>

<template>
  <div
    class="bg-white p-2 rounded-xl shadow-xl flex flex-row items-center py-5"
  >
    <div class="flex flex-col items-start w-full gap-2">
      <h1 class="text-xl font-semibold">
        Пользователь {{ props.user!.username }}
      </h1>
      <div class="flex flex-row items-start justify-between gap-10 w-full">
        <img
          :src="props.user!.profile_picture ? `http://localhost:3000/images/${props.user!.profile_picture}` : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'"
          alt=""
          class="w-20 h-20 rounded-xl object-cover pointer-events-none"
        />
        <div>
          <p>id: {{ props.user!.id }}</p>
          <p>password: {{ props.user!.password }}</p>
          <p>created_at: {{ props.user!.created_at }}</p>
          <p>role: {{ props.user!.role }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
