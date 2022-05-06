<script>
  export let pokemon;

  $: pokemonId = pokemon.id;
</script>

<div class="front">
  <img
    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemonId}.png"
    alt="card on the playing field"
    class="single-poke"
    pokemonDetail={pokemonId}
  />
</div>

<style>
  .front {
    width: 100px;
    height: 100px;
    backface-visibility: hidden;
    transition: 0.6s;
    transform-style: preserve-3d;
    position: absolute;
    top: 0;
    left: 0;
    transform: rotateY(-180deg);
  }

  .single-poke {
    border-radius: 11px;
    background: #ffffff;
    box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #ffffff;
  }
</style>
