<script context="module">
  import {
    openCardsCapsule,
    cardFlipperCapsule,
    catchEmAll,
  } from "../../store/OpenedCards";

  export const mismatchedCards = (flipTime) => {
    setTimeout(() => {
      cardFlipperCapsule.set([]);
      openCardsCapsule.set([]);
    }, flipTime);
  };

  export const closeAllCards = (flipTime, callback) => {
    setTimeout(() => {
      catchEmAll.set([]);
      cardFlipperCapsule.set([]);
      openCardsCapsule.set([]);

      callback();
    }, flipTime);
  };
</script>
