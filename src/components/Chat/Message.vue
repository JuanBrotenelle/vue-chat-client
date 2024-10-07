<script setup lang="ts">
import { defineProps } from "vue";
import { useUserStore } from "../../stores/userStore";

const userStore = useUserStore();

const props = defineProps({
  message: Object,
  users: Array,
});

const checkMessage = () => {
  if (props.message?.user_id === userStore.id) {
    return true;
  } else {
    return false;
  }
};

function formatDateToMoscowTime(createdAt: string): string {
  const date = new Date(createdAt);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
  };
  return date.toLocaleString("ru-RU", options).replace(",", "");
}
</script>

<template>
  <div class="flex justify-start w-full" v-if="checkMessage() === false">
    <div class="bg-white p-5 rounded-xl shadow-xl max-w-[750px] w-fit relative">
      <p class="text-left text-gray-500 text-sm">
        <span class="text-sm">{{
          props.users!.find((user: any) => user.id_user === message?.user_id)
            .username_user
        }}</span>
        - {{ formatDateToMoscowTime(message!.created_at) }}
      </p>
      <div
        v-show="message?.photo"
        class="w-full flex justify-center max-w-[750px] items-center relative overflow-hidden rounded-t-xl"
      >
        <img
          :src="message!.photo ? `http://localhost:3000/images/${message!.photo}` : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'"
          alt=""
          class="h-full rounded-t-xl z-[2]"
        />
        <img
          :src="message!.photo ? `http://localhost:3000/images/${message!.photo}` : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'"
          alt=""
          class="absolute w-full left-0 z-[1] rounded-t-xl blur-2xl"
        />
      </div>
      <p class="text-pretty break-words">{{ message!.message }}</p>
    </div>
  </div>
  <div class="flex justify-end w-full" v-if="checkMessage() === true">
    <div
      class="bg-[#d0e6f7] p-5 rounded-xl shadow-xl max-w-[750px] w-fit relative"
    >
      <p class="text-left text-gray-500 text-sm">
        {{ formatDateToMoscowTime(message!.created_at) }}
      </p>
      <div
        v-show="message?.photo"
        class="w-full flex justify-center max-w-[750px] items-center relative overflow-hidden rounded-t-xl"
      >
        <img
          :src="message!.photo ? `http://localhost:3000/images/${message!.photo}` : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'"
          alt=""
          class="h-full rounded-t-xl z-[2]"
        />
        <img
          :src="message!.photo ? `http://localhost:3000/images/${message!.photo}` : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'"
          alt=""
          class="absolute w-full left-0 z-[1] rounded-t-xl blur-2xl"
        />
      </div>
      <p class="text-pretty break-words">{{ message!.message }}</p>
    </div>
  </div>
</template>
