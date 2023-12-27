<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex gap-5 mx-8 px-8 m-auto justify-center">
	{#each data.names as name}
		<a href="/rooms/{name}">
			<div class="card w-32 bg-base-100 hover:shadow-xl">
				<div class="card-body">
					<h2 class="card-title">{name}</h2>
				</div>
			</div>
		</a>
	{/each}
</div>
