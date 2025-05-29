<script lang="ts" setup>
	import type { TaskFilter } from '@/types.ts';

	const props = defineProps<{ filter: TaskFilter; currentFilter: TaskFilter }>();
	const emits = defineEmits<{ setFilter: [filter: TaskFilter] }>();
</script>

<template>
	<button
		:class="{ contrast: props.currentFilter === props.filter }"
		class="secondary"
		@click="emits('setFilter', props.filter)">
		{{ props.filter }}
	</button>
</template>

<style scoped></style>
