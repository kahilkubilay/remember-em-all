import { Writable, writable } from "svelte/store";

export const level:Writable<number> = writable(1);