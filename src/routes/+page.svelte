<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	// export let form: ActionData;
	const pages = [
		{
			title: 'Admin',
			href: '/login'
		},
		{
			title: 'Rooms',
			href: '/rooms'
		}
	];
</script>

<main class="flex gap-5 justify-center m-auto">
	{#each pages as page}
		<a href={page.href}>
			<div class="card w-96 bg-base-100 shadow-xl dark:text-white">
				<div class="card-body">
					<h2 class="card-title text-gray-700">{page.title}</h2>
					<div class="card-actions justify-end">
						<button class="btn btn-primary">GO</button>
					</div>
				</div>
			</div>
		</a>
	{/each}
</main>
