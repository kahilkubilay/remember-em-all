<script lang="ts">
  import Card from "../Cards/Card.svelte";
  import { Pokemons } from "../../Pokemons/Pokemons";
  import UserGround from "../../User/UserGround.svelte";
  import { userInfo } from "../../../store/User";
  import OpenCard from "../../Trigger/OpenCard.svelte";
  import { catchEmAll } from "../../../store/OpenedCards";
  import UserDetail from "../../User/UserDetail.svelte";
  let handler;

  const { isStart, level } = userInfo;

  $: pokemons = new Pokemons($level);
  $: mixedListOfPokemon = pokemons.shakeList(pokemons.list());
</script>

<main class="pokemon-cards">
  {#if $isStart}
    {#each mixedListOfPokemon as pokemonNumber}
      <OpenCard bind:this={handler} />
      <div
        class="flip-container {($catchEmAll || []).some(
          (catchedPokemon) => catchedPokemon === pokemonNumber
        ) && 'hover'}"
        on:click={(cardEvent) => handler.openCard(cardEvent)}
      >
        <Card {pokemonNumber} />
      </div>
    {/each}

    <UserDetail />
  {:else}
    <UserGround />
  {/if}
</main>

<style type="text/scss">
  .pokemon-cards {
    width: 900px;
    margin: 0 auto;
    text-align: center;

    .hover {
      transform: rotateY(0deg);
    }

    :global(.flip-container.hover .front) {
      transform: rotateY(0deg);
    }

    :global(.flip-container.hover .back) {
      transform: rotateY(180deg);
    }

    :global(.single-poke) {
      border-radius: 11px;
      background: #ffffff;
      box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #ffffff;
    }

    .flip-container {
      perspective: 1000px;
      transform-style: preserve-3d;
      display: inline-block;
      margin: 5px;
    }

    .flip-container {
      width: 100px;
      height: 100px;
    }
  }
</style>
