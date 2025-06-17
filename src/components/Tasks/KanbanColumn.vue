<template>
  <div class="kanban-column">
    <h3>{{ title }}</h3>
    <draggable
        v-model="localTasks"
        group="tasks"
        item-key="id"
        @change="onDragChange"
        class="drag-area"
        :animation="200"
        ghost-class="ghost-card"
    >
      <template #item="{ element }">
        <TaskCard
            :task="element"
            @delete="handleTaskDelete"
            :show-archive="status === 'done'"
            @archive="handleTaskArchive"
        />
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';

export default {
  components: { draggable, TaskCard },
  props: {
    title: String,
    status: String,
    tasks: Array,
    showArchive: Boolean
  },
  computed: {
    localTasks: {
      get() { return this.tasks; },
      set(value) { this.$emit('task-updated', value); }
    }
  },
  methods: {
    onDragChange(evt) {
      if (evt.added) {
        const task = evt.added.element;
        this.$emit('task-updated', { ...task, status: this.status });
      }
    },
    handleTaskDelete(taskId) {
      console.log('Deleting task with ID:', taskId);
      this.$emit('task-deleted', taskId);
    },
    handleTaskArchive(taskId) {
      this.$emit('task-archived', taskId);
    }
  }
};
</script>

<style scoped>
.kanban-column {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 15px;
  min-height: 200px;
}

.drag-area {
  min-height: 100px;
}

.kanban-column h3 {
  margin-top: 0;
  color: #ffffff;
  text-align: center;
  font-size: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}
</style>