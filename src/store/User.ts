import { Writable, writable } from "svelte/store";

export class UserInfo {
    constructor(
        public name: Writable<string> = writable(''),
        public avatar: Writable<string> = writable(''),
        // public score: Writable<number> = writable(0),
        public isStart: Writable<boolean> = writable(false)
    ){}
}

export const userInfo = new UserInfo();