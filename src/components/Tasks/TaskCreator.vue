<template>
  <div class="task-creator">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Название задачи:</label>
        <input
            v-model="form.title"
            type="text"
            required
            class="narrow-input"
        >
      </div>

      <div class="form-group">
        <textarea
            v-model="form.description"
            placeholder="Описание"
            rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Дэдлайн:</label>
        <input
            v-model="form.deadline"
            type="date"
            class="narrow-input"
        >
      </div>

      <button type="submit">Создать задачу</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: '',
        description: '',
        deadline: ''
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('task-created', {
        ...this.form
      });
      this.form = {
        title: '',
        description: '',
        deadline: ''
      };
    }
  }
};
</script>

<style scoped>
.task-creator {
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.narrow-input {
  width: 50%;
  min-width: 200px;
  padding: 8px;
  border: 1px solid #3a56d4;
  border-radius: 4px;
  height: 36px; /* Добавлено для уменьшения высоты */
}

textarea {
  width: 90%;
  padding: 8px;
  border: 1px solid #3a56d4;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #006fff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>