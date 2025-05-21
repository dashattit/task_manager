<template>
  <div class="kanban-column">
    <h3>{{ title }}</h3>
    <draggable
        v-model="localTasks"
        group="tasks"
        item-key="id"
        @change="onDragChange"
        class="drag-area"
    >
      <template #item="{ element }">
        <TaskCard
            :task="element"
            @delete="handleTaskDelete"
            :show-archive="showArchive"
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
  background: #e6e6e6;
  border-radius: 8px;
  padding: 15px;
  min-height: 200px;
}

.drag-area {
  min-height: 100px;
}

.kanban-column h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}
</style>