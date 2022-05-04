<script>
  import BackCardFace from "./CardBack.svelte";
  import FrontCardFace from "./CardFront.svelte";
  import { openCardsCapsule, catchEmAll } from "../../../store/OpenedCards";

  export let pokemon;

  let pokemonId = pokemon.id;
  let pokemonNo = pokemon.no;

  // console.log($openCardsCapsule);

  const openCard = (card) => {
    console.log("check=>", $openCardsCapsule);
    console.log("clicked=> ", card.detail);

    let getPokemonNo = card.detail.no;
    let getPokemonId = card.detail.id;

    $openCardsCapsule = [getPokemonNo, ...$openCardsCapsule];

    if ($openCardsCapsule.length >= 2) {
      setTimeout(() => {
        $openCardsCapsule = [];
      }, 1000);
    }
  };

  // let check = pokemonNumber === 2;
  // console.log("here=> ", check);
</script>

<div class="flipper" class:hover={$openCardsCapsule.includes(pokemonNo)}>
  <BackCardFace {pokemon} on:openCard={openCard} />
  <FrontCardFace {pokemon} />
</div>

<style>
  .flipper {
    position: relative;
    transition: 0.8s;
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  :global(.flipper.hover .front) {
    transform: rotateY(0deg);
  }

  :global(.flipper.hover .back) {
    transform: rotateY(180deg);
  }
</style>
