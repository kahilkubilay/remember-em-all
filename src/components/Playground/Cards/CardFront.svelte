<script>
  export let pokemonNumber;
</script>

<div class="front">
  <img
    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemonNumber}.png"
    alt="card on the playing field"
    class="single-poke"
    pokemonDetail={pokemonNumber}
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
</style>
