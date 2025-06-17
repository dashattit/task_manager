<template>
  <div class="profile-container">
    <div v-if="!isEditing">
      <h1>Мой профиль</h1>
      <div class="profile-card">
        <div class="profile-avatar">{{ userInitials }}</div>

        <div class="profile-info">
          <div class="profile-field">
            <label>Имя:</label>
            <span>{{ currentUser.name }}</span>
          </div>
          <div class="profile-field">
            <label>Email:</label>
            <span>{{ currentUser.email }}</span>
          </div>
          <div class="profile-field">
            <label>Дата регистрации:</label>
            <span>{{ formattedDate }}</span>
          </div>
        </div>

        <div class="profile-actions">
          <button @click="startEditing" class="btn-edit">Редактировать</button>
          <button @click="toggleArchive" class="btn-archive">
            {{ showArchive ? 'Скрыть архив' : 'Показать архив' }}
          </button>
          <button @click="logout" class="btn-logout">Выйти</button>
        </div>

        <div v-if="showArchive" class="archive-section">
          <h2>Архив задач ({{ archivedTasks.length }})</h2>

          <div class="archive-controls">
            <div class="date-filter">
              <label>Фильтр по дате:</label>
              <select v-model="dateFilter">
                <option value="all">Все</option>
                <option value="today">Сегодня</option>
                <option value="week">Эта неделя</option>
                <option value="month">Этот месяц</option>
              </select>
            </div>
          </div>

          <div v-if="filteredArchivedTasks.length" class="task-list">
            <div
                v-for="task in filteredArchivedTasks"
                :key="task.id"
                class="archived-task"
            >
              <h4>{{ task.title }}</h4>
              <p v-if="task.description" class="task-description">{{ task.description }}</p>
              <div class="task-meta">
                <span>Завершено: {{ formatDate(task.archivedAt) }}</span>
                <span>Статус: {{ getStatusText(task.status) }}</span>
              </div>
            </div>
          </div>
          <p v-else class="empty-archive">Нет задач в архиве</p>
        </div>
      </div>
    </div>

    <EditProfileForm
        v-else
        :user="currentUser"
        @saved="handleProfileUpdated"
        @close="isEditing = false"
    />
  </div>
</template>

<script>
import { LocalStorageService } from '@/utils/localStorageService';
import EditProfileForm from '@/components/Profile/EditProfileForm.vue';

export default {
  components: { EditProfileForm },
  data() {
    return {
      isEditing: false,
      showArchive: false,
      archivedTasks: [],
      dateFilter: 'all'
    };
  },
  computed: {
    currentUser() {
      const token = localStorage.getItem('auth_token');
      return LocalStorageService.getCurrentUser(token) || {};
    },
    userInitials() {
      if (!this.currentUser.name) return '?';
      return this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    },
    formattedDate() {
      return new Date(this.currentUser.createdAt).toLocaleDateString();
    },
    filteredArchivedTasks() {
      const now = new Date();
      return this.archivedTasks.filter(task => {
        if (!task.archivedAt) return false;
        const taskDate = new Date(task.archivedAt);

        switch (this.dateFilter) {
          case 'today':
            return taskDate.toDateString() === now.toDateString();
          case 'week':
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            return taskDate >= startOfWeek;
          case 'month':
            return taskDate.getMonth() === now.getMonth() &&
                taskDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }
  },
  methods: {
    startEditing() {
      this.isEditing = true;
    },
    handleProfileUpdated() {
      this.isEditing = false;
    },
    logout() {
      localStorage.removeItem('auth_token');
      this.$router.push('/auth/login');
    },
    toggleArchive() {
      this.showArchive = !this.showArchive;
      if (this.showArchive) {
        this.loadArchivedTasks();
      }
    },
    loadArchivedTasks() {
      const token = localStorage.getItem('auth_token');
      const user = LocalStorageService.getCurrentUser(token);
      if (user) {
        this.archivedTasks = LocalStorageService.getTasks(true)
            .filter(task => task.authorId === user.id && task.archived)
            .sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt));
      }
    },
    getStatusText(status) {
      const statusMap = {
        'new': 'Новая',
        'in-progress': 'В работе',
        'done': 'Завершена'
      };
      return statusMap[status] || status;
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  },
  mounted() {
    if (this.showArchive) {
      this.loadArchivedTasks();
    }
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px;
}

.profile-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: #3a56d4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin: 0 auto 24px;
}

.profile-info {
  margin-bottom: 32px;
}

.profile-field {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.profile-field label {
  font-weight: 500;
  color: #666;
  display: inline-block;
  min-width: 150px;
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 32px;
}

.profile-actions button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  color: white;
}

.btn-edit { background: #3a56d4; }
.btn-archive { background: #666; }
.btn-logout { background: #ff4444; }

.archive-section {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.archive-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-filter select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.archived-task {
  background: #f9f9f9;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #3a56d4;
}

.archived-task h4 {
  margin: 0 0 10px;
  color: #2c3e50;
}

.task-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
  margin-top: 10px;
}

.empty-archive {
  color: #888;
  text-align: center;
  padding: 16px;
}
</style>