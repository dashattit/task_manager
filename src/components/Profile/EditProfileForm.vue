<template>
  <div class="edit-profile-form">
    <h2>Редактировать профиль</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Имя</label>
        <input
            v-model="form.name"
            type="text"
            :class="{ 'is-invalid': errors.name }"
        >
        <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
      </div>

      <div class="form-group">
        <label>Email</label>
        <input
            v-model="form.email"
            type="email"
            :class="{ 'is-invalid': errors.email }"
        >
        <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
      </div>

      <div class="form-group">
        <label>Текущий пароль (для подтверждения изменений)</label>
        <input
            v-model="form.currentPassword"
            type="password"
            :class="{ 'is-invalid': errors.currentPassword }"
        >
        <div v-if="errors.currentPassword" class="invalid-feedback">{{ errors.currentPassword }}</div>
      </div>

      <div class="form-group">
        <label>Новый пароль (оставьте пустым, если не хотите менять)</label>
        <input
            v-model="form.newPassword"
            type="password"
            :class="{ 'is-invalid': errors.newPassword }"
        >
        <div v-if="errors.newPassword" class="invalid-feedback">{{ errors.newPassword }}</div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-save">
          {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
        </button>
        <button type="button" @click="cancel" class="btn-cancel">
          Отмена
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { LocalStorageService } from '@/utils/localStorageService';

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: this.user.name,
        email: this.user.email,
        currentPassword: '',
        newPassword: ''
      },
      errors: {},
      loading: false
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.form.name.trim()) {
        this.errors.name = 'Имя обязательно';
        isValid = false;
      }

      if (!this.form.email) {
        this.errors.email = 'Email обязателен';
        isValid = false;
      } else if (!this.validateEmail(this.form.email)) {
        this.errors.email = 'Введите корректный email';
        isValid = false;
      }

      if (!this.form.currentPassword) {
        this.errors.currentPassword = 'Текущий пароль обязателен';
        isValid = false;
      }

      return isValid;
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      this.loading = true;

      try {
        const token = localStorage.getItem('auth_token');
        const currentUser = LocalStorageService.getCurrentUser(token);

        if (!currentUser) {
          throw new Error('Сессия устарела');
        }

        // Проверяем текущий пароль
        const user = LocalStorageService.loginUser(currentUser.email, this.form.currentPassword);
        if (!user) {
          throw new Error('Неверный пароль');
        }

        // Обновляем данные
        const updates = {
          name: this.form.name,
          email: this.form.email
        };

        if (this.form.newPassword) {
          updates.password = this.form.newPassword;
        }

        await LocalStorageService.updateUser(currentUser.id, updates);

        // Обновляем email в текущей сессии
        const updatedUser = { ...currentUser, ...updates };
        const sessionIndex = LocalStorageService.getDB().sessions.findIndex(s => s.token === token);
        if (sessionIndex !== -1) {
          LocalStorageService.getDB().sessions[sessionIndex].userId = updatedUser.id;
          localStorage.setItem('taskManagerDB', JSON.stringify(LocalStorageService.getDB()));
        }

        this.$emit('saved', updatedUser);
        this.$emit('close');
      } catch (error) {
        if (error.message === 'Неверный пароль') {
          this.errors.currentPassword = 'Неверный пароль';
        } else {
          this.errors.email = 'Пользователь с таким email уже существует';
        }
      } finally {
        this.loading = false;
      }
    },
    cancel() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.edit-profile-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  border-color: #4361ee;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.btn-save {
  flex: 1;
  padding: 0.75rem;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save:disabled {
  background-color: #b5b5b5;
  cursor: not-allowed;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  background-color: #afafaf;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.is-invalid {
  border-color: #ff4444;
}

.invalid-feedback {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>