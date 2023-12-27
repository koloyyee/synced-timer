<script lang="ts">
	import CreateRoomModal from '$components/admin/CreateRoomModal.svelte';
	import { DateTime } from 'luxon';
	import type { PageData } from '../$types';

	export let data: PageData;
	const dateFormatter = (date: Date) => {
		if (!date) return null;
		return DateTime.fromISO(date).toFormat('yyyy-MM hh:mm');
	};
</script>

<table class="table bg-whtie text-2xl m-auto text-center">
	<thead>
		<tr class="text-gray-800">
			<th> In use </th>
			<th> Room Name</th>
			<th> Make a Booking</th>
			<th> Current Booking Start</th>
			<th> Current Booking End</th>
			<th> Next Booking Start </th>
			<th> Next Booking End</th>
		</tr>
	</thead>
	<tbody>
		{#each Object.entries(data.rooms) as [name, status]}
			<tr class="hover">
				<a href="/rooms/{name}">
					<div class="tooltip" data-tip="Check out details">
						<td>
							<span class="badge {status.occupied ? 'badge-error' : 'badge-success'}">
								{status.occupied ? 'Occupied' : 'Available'}
							</span>
						</td>
					</div>
				</a>
				<td>
					{name}
				</td>
				<td>
					<a href="/protected/admin/bookings/{name}">
						<button class="btn btn-info btn-outline">
							{!status.current.start && !status.next.start ? 'Book me!' : 'Check out'}</button
						>
					</a>
				</td>
				<td>
					{dateFormatter(status.current?.start) ?? ''}
				</td>
				<td> {dateFormatter(status.current?.end) ?? ''}</td>
				<td> {dateFormatter(status.next?.start) ?? ''}</td>
				<td> {dateFormatter(status.next?.end) ?? ''}</td>
			</tr>
		{/each}
	</tbody>
</table>
<!-- 
<div class="create self-end mr-8 mb-8">
	<CreateRoomModal />
</div> -->
