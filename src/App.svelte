<script lang="ts">
  import Playground from "./components/Playground/Wrapper/Playground.svelte";
  import About from "./components/Info/about.svelte";
  import Pages from "./components/shared/Pages.svelte";

  let pages = ["about", "game"];
  let activePage = "about";

  const switchPage = (event) => {
    activePage = event.detail;
  };
</script>

<main>
  <Pages {pages} {activePage} on:switchPage={switchPage} />

  {#if activePage === "about"}
    <About />
  {:else if activePage === "game"}
    <Playground />
  {/if}
</main>

<style>
</style>
