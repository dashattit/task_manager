<template>
  <div class="task-card">
    <div class="task-header">
      <h4>{{ task.title }}</h4>
      <div class="task-actions">
        <button
            v-if="showArchive"
            class="btn-archive"
            @click.stop="handleArchive"
        >
          В архив
        </button>
        <button class="btn-delete" @click.stop="handleDelete">×</button>
      </div>
    </div>

    <p v-if="task.description" class="task-description">{{ task.description }}</p>

    <div class="task-footer">
      <span class="task-date">
        Создано: {{ formattedCreatedAt }}
      </span>
      <span v-if="task.deadline" class="task-deadline">
        Дэдлайн: {{ formattedDeadline }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true
    },
    showArchive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedCreatedAt() {
      return new Date(this.task.createdAt).toLocaleDateString();
    },
    formattedDeadline() {
      return new Date(this.task.deadline).toLocaleDateString();
    }
  },
  methods: {
    handleDelete() {
      if (confirm('Удалить задачу?')) this.$emit('delete', this.task.id);
    },
    handleArchive() {
      if (confirm('Отправить в архив?')) this.$emit('archive', this.task.id);
    }
  }
};
</script>

<style scoped>
.task-card {
  background: white;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
}

.task-actions {
  display: flex;
  gap: 5px;
}

.btn-delete {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #ff4444;
  padding: 0 5px;
}

.btn-archive {
  background: none;
  border: 1px solid #666;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.8rem;
  cursor: pointer;
  color: #666;
}

.btn-archive:hover {
  background: #f0f0f0;
}

.task-description {
  margin: 0 0 10px;
  color: #666;
  font-size: 0.9rem;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.8rem;
  color: #666;
}

.task-deadline {
  color: #ff4444;
  font-weight: bold;
}
</style>