<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { BG } from '$lib/constants/backgounds';
	import { logout } from '$lib/firebase/utils';
	import { authUser } from '$lib/stores/auth';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import '../app.css';

	const handleLogout = () => {
		logout();
	};

	$: params = $page.url.pathname.split('/').findLast((x) => x) ?? 'root';
	const twBg = writable('');
	// from-teal-400 to-emerald-500
	$: if (params) {
		switch (params) {
			case 'pink':
				$twBg = BG.BUBBLEGUM;
				break;
			case 'blue':
				$twBg = BG.OCEANIC;
				break;
			case 'green':
				$twBg = BG.MINT_CORAL;
				break;
			case 'yellow':
				$twBg = BG.PASTEL;
				break;
			default:
				$twBg = BG.BLUE_PURPLE;
				break;
		}
	}

	let refresher = writable(false);

	setContext('topLevelContext', {
		getBg: () => twBg
	});
	setContext('refresher', {
		refresh: () => refresher
	});

	$authUser = (browser && window.sessionStorage.getItem('authUser')) ?? undefined;
</script>

<!-- flex flex-col justify-center -->
<main class="min-h-screen text-gray-700 dark:text-gray-700 flex">
	<div class="drawer">
		<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col">
			<!-- Navbar -->
			<div class="w-full navbar bg-base-300">
				<div class="flex-none lg:hidden">
					<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block w-6 h-6 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</label>
				</div>
				<div class="flex-1 px-2 mx-2">
					<a href="/" class="hover:underline" class:active={$page.url.pathname === '/'}>
						Synced Rooms
					</a>
				</div>
				<div class="flex-none hidden lg:block">
					<ul class="menu menu-horizontal">
						<!-- Navbar menu content here -->
						<!-- {#if $authUser} -->
							<!-- <li>
								<a
									href="/protected/admin"
									class="hover:underline"
									class:active={$page.url.pathname === '/protected/admin'}>Admin Panel</a
								>
							</li> -->
							<!-- <li>
								<a
									href="/register"
									class="hover:underline"
									class:active={$page.url.pathname === '/register'}>Register</a
								>
							</li> -->

							<!-- <li> -->
								<!-- <button class="hover:underline" on:click={handleLogout}>Logout</button> -->
							<!-- </li> -->
						<!-- {:else if $page.url.pathname.includes('/protected')} -->
							<!-- <li>
								<a href="/" class="hover:underline" class:active={$page.url.pathname === '/'}
									>Home</a
								>
							</li>

							<li>
								<a
									href="/login"
									class="hover:underline"
									class:active={$page.url.pathname === '/login'}>Login</a
								>
							</li> -->
						<!-- {:else} -->
							<li>
								<a
									href="/rooms"
									class="hover:underline"
									class:active={$page.url.pathname === '/rooms'}>Rooms</a
								>
							</li>
						<!-- {/if} -->
					</ul>
				</div>
			</div>
			<!-- Page content here -->
			<slot />
		</div>
		<div class="drawer-side">
			<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay" />
			<ul class="menu p-4 w-80 min-h-full bg-base-200">
				<!-- Sidebar content here -->
				{#if $authUser}
					<li>
						<a
							href="/protected/admin"
							class="hover:underline"
							class:active={$page.url.pathname === '/protected/admin'}>Admin Panel</a
						>
					</li>

					<li>
						<button class="hover:underline" on:click={handleLogout}>Logout</button>
					</li>
				{:else}
					<li>
						<a href="/" class="hover:underline" class:active={$page.url.pathname === '/'}>Home</a>
					</li>
					<li>
						<a href="/rooms" class="hover:underline" class:active={$page.url.pathname === '/rooms'}
							>Rooms</a
						>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</main>
