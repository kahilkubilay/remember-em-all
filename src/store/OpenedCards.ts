import { Writable, writable } from "svelte/store";

export const userOpenCards:Writable<number[]> = writable([]);
export const catchEmAll:Writable<number[]> = writable([]);
export const openCardsCapsule:Writable<number[]> = writable([]);