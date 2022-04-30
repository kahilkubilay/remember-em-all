import { Writable, writable } from "svelte/store";

export const score:Writable<number> = writable(0);