<script>
  export let pokemonNumber;
</script>

<div class="back">
  <img
    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
    class="single-poke"
    alt={pokemonNumber}
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
  }
</style>
