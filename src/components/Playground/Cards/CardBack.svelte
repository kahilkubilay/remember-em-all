<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let pokemon;

  const pokemonNo = pokemon.no;
  const pokemonId = pokemon.id;
</script>

<!-- <div class="back" on:click={() => dispatch("openCard", pokemonNo)}> -->
  <div class="back" on:click={() => dispatch("openCard", pokemon)}>
  <img
    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
    class="single-poke"
    alt="tester"
  />
</div>

<style>
  .back {
    width: 100px;
    height: 100px;
    backface-visibility: hidden;
    transition: 0.6s;
    transform-style: preserve-3d;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    transform: rotateY(0deg);
    border-radius: 11px;
  }

  .back:hover {
    cursor: pointer;
  }
</style>
