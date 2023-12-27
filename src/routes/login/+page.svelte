<script lang="ts">
	import { login } from '$lib/firebase/utils';
	import { authUser } from '$lib/stores/auth';

	let email: string;
	let password: string;
	let success: boolean | undefined;

	function fillTestAcc() {
		(email = 'test@example.com'), (password = 'password');
	}

	const handleLogin = () => {
		login(email, password);
		localStorage.setItem('authUser', JSON.stringify($authUser));
	};
</script>

<!-- <form
	class="flex flex-col gap-5 m-auto w-1/3"
	method="post"
	action="?/login"
	use:enhance={() => {
		return async ({ result }) => {
			goto('/protected/admin/bookings');
		};
	}}
> -->
<form class="flex flex-col gap-5 m-auto w-1/3" on:submit|preventDefault={handleLogin}>
	<label for="email" class="text-4xl"> email </label>
	<input
		class="p-4 m-2 rounded-md"
		type="email"
		name="email"
		placeholder="email"
		required
		bind:value={email}
	/>

	<label for="password" class="text-4xl"> password </label>
	<input
		class="p-4 m-2 rounded-md"
		type="password"
		name="password"
		placeholder="password"
		required
		bind:value={password}
	/>

	<button
		class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-1/2 self-center"
		type="submit"
	>
		login
	</button>

	<button class="text-sm underline text-whtie hover:text-secondary" on:click={fillTestAcc}>
		Test Account
	</button>
</form>
