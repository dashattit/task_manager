<template>
  <div class="auth-form">
    <h2>Регистрация</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label>Имя пользователя</label>
        <input
            v-model="form.name"
            type="text"
            :class="{ 'is-invalid': errors.name }"
            @input="clearError('name')"
        >
        <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
      </div>

      <div class="form-group">
        <label>Email</label>
        <input
            v-model="form.email"
            type="email"
            :class="{ 'is-invalid': errors.email }"
            @input="clearError('email')"
        >
        <div v-if="errors.email" class="invalid-feedback">{{ errors.name }}</div>
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

      <div class="form-group">
        <label>Подтверждение пароля</label>
        <input
            v-model="form.passwordConfirm"
            type="password"
            :class="{ 'is-invalid': errors.passwordConfirm }"
            @input="clearError('passwordConfirm')"
        >
        <div v-if="errors.passwordConfirm" class="invalid-feedback">{{ errors.passwordConfirm }}</div>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
    </form>

    <p class="auth-switch">
      Уже есть аккаунт? <router-link to="/auth/login">Войти</router-link>
    </p>
  </div>
</template>

<script>
import { LocalStorageService } from '@/utils/localStorageService';

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
      },
      errors: {
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
      },
      loading: false
    };
  },
  methods: {
    validateForm() {
      let isValid = true;

      // Валидация имени
      if (!this.form.name.trim()) {
        this.errors.name = 'Имя обязательно';
        isValid = false;
      } else if (this.form.name.length < 3) {
        this.errors.name = 'Имя должно содержать минимум 3 символа';
        isValid = false;
      }

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

      // Подтверждение пароля
      if (this.form.password !== this.form.passwordConfirm) {
        this.errors.passwordConfirm = 'Пароли не совпадают';
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

    async handleRegister() {
      if (!this.validateForm()) return;

      this.loading = true;

      try {
        await LocalStorageService.registerUser({
          name: this.form.name,
          email: this.form.email,
          password: this.form.password
        });

        this.$router.push('/auth/login');
      } catch (err) {
        this.errors.email = 'Пользователь с таким email уже существует';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>