<script lang="ts" setup>
	import type { Task } from '@/types.ts';

	const props = defineProps<{ tasks: Task[] }>();
	const emits = defineEmits<{
		toggleDone: [id: string];
		removeTask: [id: string];
	}>();
</script>

<template>
	<TransitionGroup
		class="task-list"
		name="task-list"
		tag="ul">
		<article
			v-for="task in props.tasks"
			:key="task.id"
			class="task">
			<label>
				<input
					v-model="task.done"
					:checked="task.done"
					type="checkbox"
					@input="emits('toggleDone', task.id)" />
				<span :class="{ done: task.done }">{{ task.title }}</span>
			</label>
			<button
				class="outline"
				@click="emits('removeTask', task.id)">
				Remove
			</button>
		</article>
	</TransitionGroup>
</template>

<style scoped>
	.task-list {
		margin-top: 1rem;
	}

	.task {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.done {
		text-decoration: line-through;
	}

	.task-list-enter-active,
	.task-list-leave-active {
		transition: all 0.5s ease;
	}

	.task-list-enter-from,
	.task-list-leave-to {
		opacity: 0;
		transform: translateX(30px);
	}
</style>
