const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = SECOND_IN_MS * 60;

export const secondsToMs = (seconds: number) => seconds * SECOND_IN_MS;
export const minutesToMs = (minutes: number) => minutes * MINUTE_IN_MS;
