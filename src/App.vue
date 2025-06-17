<template>
  <div id="app">
    <header class="app-header">
      <nav class="nav-container">
        <router-link to="/" class="nav-logo">Task Manager</router-link>
        <div class="nav-links">
          <router-link v-if="isAuthenticated" to="/profile" class="nav-link">
            <span class="user-avatar">{{ userInitials }}</span>
            Профиль
          </router-link>
          <router-link v-else to="/auth/login" class="nav-link">
            Войти
          </router-link>
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
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
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
  gap: 24px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
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

.main-content {
  flex: 1;
  padding: 32px 16px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
</style>