<template>
  <div id="app">
    <header v-if="isAuthenticated" class="app-header">
      <nav class="nav-container">
        <router-link to="/" class="nav-logo">Task Manager</router-link>
        <div class="nav-links">
          <router-link to="/profile" class="nav-link">
            <span class="user-avatar">{{ userInitials }}</span>
            Профиль
          </router-link>
          <button @click="logout" class="logout-btn">Выйти</button>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { LocalStorageService } from '@/utils/localStorageService';

export default {
  name: 'App',
  computed: {
    isAuthenticated() {
      const token = localStorage.getItem('auth_token');
      return token && LocalStorageService.getCurrentUser(token);
    },
    currentUser() {
      const token = localStorage.getItem('auth_token');
      return LocalStorageService.getCurrentUser(token);
    },
    userInitials() {
      if (!this.currentUser?.name) return '?';
      const names = this.currentUser.name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase();
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('auth_token');
      this.$router.push('/auth/login');
    }
  }
}
</script>

<style>
/* Основные стили приложения */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Стили шапки */
.app-header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  padding: 0 1rem;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.nav-logo {
  font-weight: bold;
  font-size: 1.2rem;
  color: #2c3e50;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #006fff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.logout-btn {
  background: none;
  border: none;
  color: #000000;
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem;

}

.logout-btn:hover {
  text-decoration: underline;
}

/* Основное содержимое */
.main-content {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
</style>