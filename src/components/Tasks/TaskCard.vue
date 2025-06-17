<template>
  <div class="task-card">
    <div class="task-header">
      <h4>{{ task.title }}</h4>
      <div class="task-actions">
        <button
            v-if="showArchive"
            class="btn-archive"
            @click.stop="showArchiveModal = true"
        >
          В архив
        </button>
        <button class="btn-delete" @click.stop="showDeleteModal = true">×</button>
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

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <h3>Удаление задачи</h3>
        <p>Вы уверены, что хотите удалить задачу "{{ task.title }}"?</p>
        <div class="modal-actions">
          <button @click="confirmDelete" class="btn-confirm">Удалить</button>
          <button @click="showDeleteModal = false" class="btn-cancel">Отмена</button>
        </div>
      </div>
    </div>
    <ModalDialog
        v-if="showArchiveModal"
        title="Архивирование задачи"
        message='Вы уверены, что хотите отправить задачу "{{ task.title }}" в архив?'
        @confirm="$emit('archive', task.id)"
        @close="showArchiveModal = false"
    />
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
  data() {
    return {
      showDeleteModal: false,
      showArchiveModal: false
    };
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
    confirmDelete() {
      this.$emit('delete', this.task.id);
      this.showDeleteModal = false;
    },
    confirmArchive() {
      if (confirm(`Отправить задачу "${this.task.title}" в архив?`)) {
        this.$emit('archive', this.task.id);
      }
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
  position: relative;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-header h4 {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.btn-delete {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #ff4444;
  padding: 0 5px;
  line-height: 1;
}

.btn-delete:hover {
  color: #cc0000;
}

.btn-archive {
  background: none;
  border: 1px solid #3a56d4;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  color: #666;
}

.task-description {
  margin: 0 0 10px;
  color: #666;
  font-size: 14px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.task-deadline {
  color: #ff4444;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-confirm {
  padding: 8px 16px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  padding: 8px 16px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-archive {
  background: none;
  border: 1px solid #3a56d4;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  color: #3a56d4;
  cursor: pointer;
}
</style>

