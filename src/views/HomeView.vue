<template>
  <div class="home">
    <h1>Мой Канбан</h1>

    <div class="kanban-board">
      <!-- Колонка для создания задач -->
      <div class="kanban-column create-column">
        <h2>Создать задачу</h2>
        <TaskCreator @task-created="handleTaskCreated" />
      </div>

      <!-- Колонка "Новые" -->
      <KanbanColumn
          title="Новые"
          status="new"
          :tasks="filteredTasks('new')"
          @task-updated="handleTaskUpdated"
          @task-deleted="handleTaskDeleted"
      />

      <!-- Колонка "В работе" -->
      <KanbanColumn
          title="В работе"
          status="in-progress"
          :tasks="filteredTasks('in-progress')"
          @task-updated="handleTaskUpdated"
          @task-deleted="handleTaskDeleted"
      />

      <!-- Колонка "Завершённые" -->
      <KanbanColumn
          title="Завершённые"
          status="done"
          :tasks="filteredTasks('done')"
          @task-updated="handleTaskUpdated"
          @task-deleted="handleTaskDeleted"
          show-archive
          @task-archived="handleTaskArchived"
      />
    </div>
  </div>
</template>

<script>
import { LocalStorageService } from '@/utils/localStorageService';
import TaskCreator from '@/components/Tasks/TaskCreator.vue';
import KanbanColumn from '@/components/Tasks/KanbanColumn.vue';

export default {
  components: { TaskCreator, KanbanColumn },
  data() {
    return {
      tasks: []
    };
  },
  computed: {
    currentUser() {
      const token = localStorage.getItem('auth_token');
      return LocalStorageService.getCurrentUser(token) || {};
    }
  },
  created() {
    this.loadTasks();
  },
  methods: {
    loadTasks() {
      this.tasks = LocalStorageService.getTasks()
          .filter(task => task.authorId === this.currentUser.id && !task.archived);
    },
    filteredTasks(status) {
      return this.tasks.filter(task => task.status === status);
    },
    async handleTaskCreated(newTask) {
      try {
        const task = await LocalStorageService.createTask({
          ...newTask,
          authorId: this.currentUser.id,
          status: 'new'
        });
        this.tasks.push(task);
      } catch (error) {
        console.error('Ошибка создания задачи:', error);
      }
    },
    async handleTaskUpdated(updatedTask) {
      try {
        await LocalStorageService.updateTask(updatedTask.id, updatedTask);
        this.loadTasks();
      } catch (error) {
        console.error('Ошибка обновления задачи:', error);
      }
    },
    async handleTaskDeleted(taskId) {
      try {
        await LocalStorageService.deleteTask(taskId);
        this.loadTasks();
      } catch (error) {
        console.error('Ошибка удаления задачи:', error);
      }
    },
    async handleTaskArchived(taskId) {
      try {
        await LocalStorageService.updateTask(taskId, {
          archived: true,
          archivedAt: new Date().toISOString(),
          status: 'done'
        });
        this.loadTasks();
      } catch (error) {
        console.error('Ошибка архивирования задачи:', error);
      }
    }
  }
};
</script>

<style scoped>
.home {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
  overflow: hidden;
}

.kanban-column {
  background: #e6e6e6;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 200px;
}

.create-column {
  background: #e3f2fd;
}

.kanban-column h2 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

@media (max-width: 1200px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }
}
</style>