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
            disabled
        >
        <small class="text-muted">Для изменения email обратитесь в поддержку</small>
      </div>

      <div class="form-group">
        <label>Текущий пароль</label>
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

      return isValid;
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

        const updates = {
          name: this.form.name
        };

        if (this.form.newPassword) {
          updates.password = this.form.newPassword;
        }

        await LocalStorageService.updateUser(currentUser.id, updates);
        this.$emit('saved');
        this.$emit('close');
      } catch (error) {
        this.errors.currentPassword = 'Неверный пароль';
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
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
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
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group input[disabled] {
  background-color: #f5f5f5;
}

.text-muted {
  color: #666;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-save {
  flex: 1;
  padding: 0.75rem;
  background-color: #006fff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  background-color: #bfbfbf;
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