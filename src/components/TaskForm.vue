<script lang="ts" setup>
	import { ref } from 'vue';

	const emit = defineEmits<{ addTask: [newTask: string] }>();

	const newTask = ref('');
	const error = ref('');

	function formSubmitted() {
		if (newTask.value.trim()) {
			emit('addTask', newTask.value);
			newTask.value = '';
		} else {
			error.value = 'Task cannot be empty!';
		}
	}
</script>

<template>
	<form
		method="post"
		@submit.prevent="formSubmitted">
		<label>
			New Task
			<input
				v-model="newTask"
				:aria-invalid="!!error || undefined"
				name="newTask"
				@input="error = ''" />
			<small
				v-if="error"
				id="invalid-helper">
				{{ error }}
			</small>
		</label>
		<div class="button-container">
			<button>Add</button>
		</div>
	</form>
</template>

<style scoped>
	.button-container {
		display: flex;
		justify-content: end;
	}
</style>
