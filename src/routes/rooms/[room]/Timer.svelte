<script lang="ts">
	export let mins: number = 0,
		minName: string = '',
		secs: number = 0;

	export let isCardView: boolean = false;

	$: twClass = mins < 10 ? `${$$props.class} text-error m-0` : `${$$props.class} m-none`;
	$: secsL = secs;

	let minFontSize = isCardView ? 'text-[3rem]' : 'lg:text-[36rem] text-[28rem] text-white';
	let secsFontSize = isCardView ? 'text-[3rem]' : 'lg:text-[18rem] text-[12rem] text-white';
	let minsFontSize = isCardView ? 'text-[1rem]' : 'lg:text-[5rem] text-[3rem] text-white';
</script>

<h1 class={twClass}>
	<span class="countdown {minFontSize} ">
		<!-- <span style="--value:{isNaN(mins) ? '00' : mins}" /> -->
		{isNaN(mins) || mins < 0 ? '00' : mins}
	</span>
	<span class={minsFontSize}>{minName} </span>

	<span style="--value:{isNaN(mins) ? '00' : mins}" />
	<span class="countdown {secsFontSize}">
		{isNaN(secs) || secs < 0 ? '00' : secs >= 10 ? secs : '0' + secs}
	</span>
	<span class={minsFontSize}> s </span>
</h1>
