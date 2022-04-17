<script lang="ts">
  export let pokemonNumber: Number;

  import BackCardFace from "./CardBack.svelte";
  import FrontCardFace from "./CardFront.svelte";
</script>

<div class="flipper">
  <BackCardFace {pokemonNumber} />
  <FrontCardFace {pokemonNumber} />
</div>

<style>
  .flipper {
    transition: 0.8s;
    transform-style: preserve-3d;
    position: relative;
  }
</style>
