<script lang="ts" setup>
	import FilterButton from '@/components/FilterButton.vue';
	import TaskForm from '@/components/TaskForm.vue';
	import TaskList from '@/components/TaskList.vue';
	import { TaskService } from '@/services/TaskService.ts';
	import type { Task, TaskFilter } from '@/types.ts';
	import { computed, onMounted, ref } from 'vue';

	const message = ref('Tasks App');
	const tasks = ref<Task[]>([]);
	const filter = ref<TaskFilter>('all');
	const loading = ref(false);
	const error = ref('');

	const totalDone = computed(() =>
		tasks.value.reduce((total, task) => (task.done ? total + 1 : total), 0)
	);

	const filteredTask = computed(() => {
		let choice = tasks.value;
		switch (filter.value) {
			case 'all':
				choice = tasks.value;
				break;
			case 'todo':
				choice = tasks.value.filter((task) => !task.done);
				break;
			case 'done':
				choice = tasks.value.filter((task) => task.done);
				break;
		}
		return choice;
	});

	onMounted(async () => {
		await loadTasks();
	});

	async function loadTasks(): Promise<void> {
		try {
			loading.value = true;
			error.value = '';
			tasks.value = await TaskService.getTasks();
		} catch (e) {
			error.value = 'Error loading tasks';
			console.error(e);
		} finally {
			loading.value = false;
		}
	}

	async function addTask(newTask: string) {
		try {
			loading.value = true;
			error.value = '';
			const createdTask = await TaskService.createTask({
				id: crypto.randomUUID(),
				title: newTask,
				done: false
			});
			tasks.value.push(createdTask);
		} catch (e) {
			error.value = 'Error adding task';
			console.error(e);
			tasks.value.push({
				id: crypto.randomUUID(),
				title: newTask,
				done: false
			});
		} finally {
			loading.value = false;
		}
	}

	async function toggleDone(id: string) {
		const task = tasks.value.find((task) => task.id === id);
		if (!task) return;
		const newDoneState: boolean = !task.done;
		try {
			task.done = newDoneState;
			await TaskService.toggleTaskDone(id, newDoneState);
		} catch (e) {
			task.done = !newDoneState;
			error.value = 'Error adding task';
			console.error(e);
		}
	}

	async function removeTask(id: string) {
		const index = tasks.value.findIndex((task) => task.id === id);
		if (index === -1) return;
		const removedTask = tasks.value[index];
		try {
			tasks.value.splice(index, 1);
			await TaskService.deleteTask(id);
		} catch (e) {
			tasks.value.splice(index, 0, removedTask);
			error.value = 'Error deleting task';
			console.error(e);
		}
	}

	function setFilter(value: TaskFilter) {
		filter.value = value;
	}

	function dismissError() {
		error.value = '';
	}
</script>

<template>
	<main>
		<h1>{{ message }}</h1>
		<div
			v-if="error"
			class="error-banner">
			<span>{{ error }}</span>
			<button
				class="outline secondary"
				@click="dismissError">
				x
			</button>
		</div>
		<div
			v-if="loading"
			class="loading">
			Loading...
		</div>
		<TaskForm @add-task="addTask" />
		<h3 v-if="!tasks.length && !loading">Add a task to get started</h3>
		<h3 v-else>{{ totalDone }} / {{ tasks.length }} tasks completed</h3>
		<div class="button-container">
			<FilterButton
				:currentFilter="filter"
				filter="all"
				@set-filter="setFilter" />
			<FilterButton
				:currentFilter="filter"
				filter="todo"
				@set-filter="setFilter" />
			<FilterButton
				:currentFilter="filter"
				filter="done"
				@set-filter="setFilter" />
		</div>
		<TaskList
			:tasks="filteredTask"
			@toggle-done="toggleDone"
			@remove-task="removeTask" />
	</main>
</template>

<style scoped>
	main {
		max-width: 800px;
		margin: 1rem auto;
	}

	.button-container {
		display: flex;
		justify-content: end;
		gap: 0.5rem;
	}

	.error-banner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: var(--pico-color-red-500);
		color: white;
		padding: 1rem;
		border-radius: var(--pico-border-radius);
		margin-bottom: 1rem;
	}

	.loading {
		text-align: center;
		padding: 1rem;
		color: var(--pico-muted-color);
	}
</style>
