<script>
  import Card from "../Cards/Card.svelte";
  import UserGround from "../../User/UserGround.svelte";
  import { userInfo } from "../../../store/User";
  import UserDetail from "../../User/UserDetail.svelte";
  import { shuffle } from "../../GameAction/MixCards.svelte";
  import { list } from "../../GameAction/ListCards.svelte";
  import { level } from "../../../store/Level";

  const { isStart } = userInfo;
  $: pokemonList = list($level);
  $: mixedListOfPokemon = shuffle(pokemonList);
</script>

<main class="playground">
  {#if $isStart}
    {#each mixedListOfPokemon as pokemon}
      <Card {pokemon} />
    {/each}

    <UserDetail />
  {:else}
    <UserGround />
  {/if}
</main>

<style>
  .playground {
    width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  @media screen and (max-width: 800px) {
    .playground {
      width: 100%;
    }
  }
</style>
