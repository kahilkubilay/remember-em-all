import { Writable, writable } from "svelte/store";

export const catchEmAll:Writable<number[]> = writable([]);
export const openCardsCapsule:Writable<number[]> = writable([]);
export const cardFlipperCapsule:Writable<number[]> = writable([]);