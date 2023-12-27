export type Status = 'current' | 'next';

export const emptyRoom = (key: Status) => {
	return {
		[key]: {
			start: 0,
			end: 0,
			duration: 0,
			employee: '',
			startAt: 0
		}
	};
};
