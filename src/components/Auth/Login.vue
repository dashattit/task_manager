<template>
  <div class="auth-form">
    <h2>Вход</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Email</label>
        <input
            v-model="form.email"
            type="email"
            :class="{ 'is-invalid': errors.email }"
            @input="clearError('email')"
        >
        <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
      </div>

      <div class="form-group">
        <label>Пароль</label>
        <input
            v-model="form.password"
            type="password"
            :class="{ 'is-invalid': errors.password }"
            @input="clearError('password')"
        >
        <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Вход...' : 'Войти' }}
      </button>
    </form>

    <p class="auth-switch">
      Нет аккаунта? <router-link to="/auth/register">Зарегистрироваться</router-link>
    </p>
  </div>
</template>

<script>
import { LocalStorageService } from '@/utils/localStorageService';

export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {
        email: '',
        password: ''
      },
      loading: false
    };
  },
  methods: {
    validateForm() {
      let isValid = true;

      // Валидация email
      if (!this.form.email) {
        this.errors.email = 'Email обязателен';
        isValid = false;
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Введите корректный email';
        isValid = false;
      }

      // Валидация пароля
      if (!this.form.password) {
        this.errors.password = 'Пароль обязателен';
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Пароль должен содержать минимум 6 символов';
        isValid = false;
      }

      return isValid;
    },

    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    clearError(field) {
      this.errors[field] = '';
    },

    async handleLogin() {
      if (!this.validateForm()) return;

      this.loading = true;

      try {
        const { token } = await LocalStorageService.loginUser(
            this.form.email,
            this.form.password
        );

        localStorage.setItem('auth_token', token);
        this.$router.push('/');
      } catch (err) {
        this.errors.password = 'Неверный email или пароль';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 0.25rem;
}
</style>