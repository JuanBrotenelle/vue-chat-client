import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useStorage } from '@vueuse/core';
import { useUserStore } from './userStore';


const userStore = useUserStore();
console.log(userStore.token);
const socket = io('http://localhost:3000', {
  query: {
      token: userStore.token,
  }
});

interface Chat {
  id: number;
  chat_name: string | null;
  is_group: boolean;
  users: Array<{ id: number; username: string; profile_picture: string | null }>;
  messages: Array<Message>;
  lastMessage?: Message;
}

interface Message {
  id: number;
  chat_id: number;
  user_id: number;
  message: FormData;
  photo: string | null;
  created_at: Date;
}

interface Users {
  id: number
}

export const useChatStore = defineStore('chat', () => {
  const chats = useStorage<Chat[]>('chats', []);
  const currentChat = useStorage('currentChat', null);
  const newChatUsers = <Users[]>[]

  const fetchChats = async (userId: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/user/${userId}/chats`);
      chats.value = response.data;
    } catch (error) {
      console.error('Failed to fetch chats', error);
    }
  };


  const fetchLastMessage = async (chatId: number) => {
    try {
      const response = await axios.get(`/api/chats/${chatId}/lastMessage`);
      const chat = chats.value.find(c => c.id === chatId);
      if (chat) {
        chat.lastMessage = response.data;
      }
    } catch (error) {
      console.error('Failed to fetch last message', error);
    }
  };

  const sendMessage = async (messageFormData: FormData, chatId: number, userId: number, token: string) => {
    try {
      const response = await axios.post(`http://localhost:3000/message/${chatId}/${userId}/send`, messageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });

      socket.emit('send_message', {
        chat_id: response.data.chat_id,
        user_id: response.data.user_id,
        message: response.data.message,
        photo: response.data.photo,
      });

    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const fetchMessages = async (chatId: number) => { 
    try {
      const response = await axios.get(`http://localhost:3000/chat/${chatId}/messages`);
      const chat = chats.value.find(c => c.id === chatId);
      if (chat) {
        chat.messages = response.data;
      }
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  socket.on('new_group_chat', (chat: any) => {
    console.log("Received chat: ", chat);
    chats.value.unshift(chat.chat);
    subscribeToChat(chat.chat.id);
  });

  function subscribeToChat(chatId: number) {
    socket.on(`receive_message_${chatId}`, (message: Message) => {
      console.log("Received message: ", message);
      const chat = chats.value.find(c => c.id === Number(message.chat_id));
      if (chat) {
        const msg = {
          id: message.id,
          user_id: Number(message.user_id),
          message: message.message,
          photo: message.photo,
          created_at: message.created_at,
        }
        chat.messages.unshift(msg as Message);
        console.log("Message pushed to chat: ", chat.id);
      }
    });
  };

  chats.value.forEach(chat => {
    console.log("Completed for chat: ", chat.id);
    subscribeToChat(chat.id);
  });

  return {
    chats,
    currentChat,
    fetchChats,
    sendMessage,
    fetchLastMessage,
    fetchMessages,
    newChatUsers
  };
}, {
  persist: true,
});
