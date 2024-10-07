import { defineStore } from 'pinia';

interface UserState {
    id: number | null;
    username: string | null;
    password: string | null;
    token: string | null;
    profile_picture: string | null;
    role: string | null;
    created_at: Date | null;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
      id: null,
      username: null,
      password: null,
      profile_picture: null,
      token: null,
      role: null,
      created_at: null,
    }),
    getters: {
      isAuthenticated(state): boolean {
        return !!state.token && !!state.id;
      },
    },
    actions: {
      setUser(user: { id?: number; username?: string; password?: string, token?: string, profile_picture?: string, created_at?: Date, role?: string }) {
        if (user.id) {
          this.id = user.id;
        }
        
        if (user.username) {
          this.username = user.username;
        }

        if (user.password) {
          this.password = user.password;
        }

        if (user.token) {
          this.token = user.token;
        }

        if (user.profile_picture) {
          this.profile_picture = user.profile_picture;
        }

        if (user.role) {
          this.role = user.role;
        }

        if (user.created_at) {
          this.created_at = user.created_at;
        }
      },
      logout() {
        this.id = null;
        this.username = null;
        this.password = null;
        this.token = null;
        this.profile_picture = null;
        this.role = null;
        this.created_at = null;
      },
    },
    persist: true,
});
