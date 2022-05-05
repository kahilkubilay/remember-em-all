<script>
  import Card from "../Cards/Card.svelte";
  import UserGround from "../../User/UserGround.svelte";
  import { userInfo } from "../../../store/User";
  import UserDetail from "../../User/UserDetail.svelte";
  import { shuffle } from "../../GameAction/MixCards.svelte";
  import { list } from "../../GameAction/ListCards.svelte";

  const { isStart } = userInfo;
  let pokemonList = [];
  let mixedListOfPokemon = [];

  if (isStart) {
    pokemonList = list();
    mixedListOfPokemon = shuffle(pokemonList);
  }
</script>

<main class="pokemon-cards">
  {#if $isStart}
    {#each mixedListOfPokemon as pokemon}
      <Card {pokemon} />
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
  }
</style>
