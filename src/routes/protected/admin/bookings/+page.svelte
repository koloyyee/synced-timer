<script lang="ts">
	import RoomCard from '$components/RoomCard.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
</script>

<!-- list all the books by rooms. -->
<!-- show availabilities and click -->
<div class="flex gap-1 justify-center mx-2">
	<!-- <div class="grid grid-cols-2 grid-rows-2 gap-1 justify-center mx-2"> -->
	{#each Object.entries(data.rooms) as [room, roomData]}
		<RoomCard data={roomData} {room} />
	{/each}
</div>
