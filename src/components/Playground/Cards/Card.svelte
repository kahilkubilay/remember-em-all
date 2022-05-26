<script>
  import BackCardFace from "./CardBack.svelte";
  import FrontCardFace from "./CardFront.svelte";
  import {
    openCardsCapsule,
    cardFlipperCapsule,
    catchEmAll,
  } from "../../../store/OpenedCards";
  import { scoreUp } from "../../GameAction/ScoreUpdate.svelte";
  import { levelUp } from "../../GameAction/LevelUpdate.svelte";
  import {
    closeAllCards,
    mismatchedCards,
  } from "../../GameAction/CloseOpenCards.svelte";

  export let pokemon;

  $: pokemonId = pokemon.id;
  $: pokemonNo = pokemon.no;

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

        if ($catchEmAll.length === 5) {
          closeAllCards(1000, levelUp);
        }
      }

      mismatchedCards(500);
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
  }
</style>
