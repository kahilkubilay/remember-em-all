/**
 * Store data showing the status of fired cards
 * 
 * status:
 * first click: true
 * second click (both): false
 * 
 * reference: 
 * openFirstCard: Clicked on first card variables
 * openSecondCard: Clicked on first card variables
*/


// store module
import { Writable, writable } from "svelte/store";

export class CardStatus {
    constructor(
        public cardClickFace: Writable<boolean> = writable(false),
        public openFirstCard: Writable<string> = writable(''),
        public openSecondCard: Writable<string> = writable(''),
        public clickCounter: Writable<number> = writable(0)
    ){}
}

export const cardStatus = new CardStatus();