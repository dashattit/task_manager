<template>
  <div class="home">
    <div class="kanban-board">

      <div class="kanban-column create-column">
        <h2>Создать задачу</h2>
        <TaskCreator @task-created="handleTaskCreated" />
      </div>
      <KanbanColumn
          title="Новые"
          status="new"
          :tasks="filteredTasks('new')"
          @task-updated="handleTaskUpdated"
          @task-deleted="handleTaskDeleted"
      />
      <KanbanColumn
          title="В работе"
          status="in-progress"
          :tasks="filteredTasks('in-progress')"
          @task-updated="handleTaskUpdated"
          @task-deleted="handleTaskDeleted"
      />
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
      console.log('Received delete for task ID:', taskId);
      try {
        await LocalStorageService.deleteTask(taskId);

        this.tasks = this.tasks.filter(task => {
          console.log(task.id, 'vs', taskId);
          return task.id !== taskId;
        });
      } catch (error) {
        console.error('Ошибка удаления задачи:', error);
      }
    },
    async handleTaskArchived(taskId) {
      try {
        // 1. Помечаем задачу как архивную
        await LocalStorageService.updateTask(taskId, {
          archived: true,
          archivedAt: new Date().toISOString(),
          status: 'done' // На всякий случай обновляем статус
        });

        // 2. Удаляем задачу из текущего списка
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      } catch (error) {
        console.error('Ошибка архивации:', error);
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
  background: #3a56d4;
  border-radius: 8px;
  padding: 15px;
  min-height: 200px;
}

.create-column {
  background: #3a56d4;
}

.kanban-column h2 {
  margin-top: 0;
  color: white;
  font-size: 16px;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

@media (max-width: 1200px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }
}
</style>