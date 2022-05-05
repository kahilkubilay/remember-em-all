<script>
  import BackCardFace from "./CardBack.svelte";
  import FrontCardFace from "./CardFront.svelte";
  import {
    openCardsCapsule,
    cardFlipperCapsule,
    catchEmAll,
  } from "../../../store/OpenedCards";
  import { scoreUp } from "../../GameAction/ScoreUpdate.svelte";

  export let pokemon;

  let pokemonId = pokemon.id;
  let pokemonNo = pokemon.no;

  const openCard = (card) => {
    let getPokemonNo = card.detail.no;
    let getPokemonId = card.detail.id;

    $openCardsCapsule = [getPokemonId, ...$openCardsCapsule];
    $cardFlipperCapsule = [getPokemonNo, ...$cardFlipperCapsule];

    if ($openCardsCapsule.length >= 2) {
      const firstOpenCard = $openCardsCapsule[0];
      const secondOpenCard = $openCardsCapsule[1];

      if (firstOpenCard === secondOpenCard) {
        $catchEmAll = [firstOpenCard, ...$catchEmAll];

        scoreUp();
      } else {
        console.log(":: none ::");
      }

      setTimeout(() => {
        $openCardsCapsule = [];
        $cardFlipperCapsule = [];
      }, 500);
    }
  };
</script>

<main class="flip-container">
  <div
    class="flipper"
    class:hover={$cardFlipperCapsule.includes(pokemonNo) ||
      $catchEmAll.includes(pokemonId)}
  >
    <BackCardFace {pokemon} on:openCard={openCard} />
    <FrontCardFace {pokemon} />
  </div>
</main>

<style>
  .flip-container {
    perspective: 1000px;
    transform-style: preserve-3d;
    display: inline-block;
    margin: 5px;
    width: 100px;
    height: 100px;
  }

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
