<script lang="ts">
	import { goto } from '$app/navigation';
	import { firebaseAuth } from '$lib/firebase/firebase';
	import { createUserWithEmailAndPassword } from 'firebase/auth';

	let email: string;
	let password: string;
	let success: boolean | undefined;

	function register() {
		createUserWithEmailAndPassword(firebaseAuth, email, password)
			.then((userCredentials) => {
				console.log(userCredentials);
				goto('/login');
			})
			.catch((err) => {
				const errCode = err.code;
				const errMessage = err.message;
				console.error({ errCode, errMessage });
				success = false;
			});
	}
</script>

{#if !success && success !== undefined}
	<div>There is an error while registering.</div>
{/if}

<form on:submit|preventDefault={register} class="flex flex-col gap-5 m-auto w-1/3">
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
		class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-1/2 self-center"
		type="submit"
	>
		register
	</button>
</form>
