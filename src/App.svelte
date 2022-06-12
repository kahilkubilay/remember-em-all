<script>
  import Playground from "./components/Playground/Wrapper/Playground.svelte";
  import About from "./components/Info/about.svelte";
  import Pages from "./components/shared/Pages.svelte";

  let pages = ["about", "game"];
  let activePage = "about";

  const description = "Memory game development using Svelte";
  let image = "images/svelte-pokemons.png";
  let imageText = "Svelte logo";
  const title = "Svelte Memory Game";

  const switchPage = (event) => {
    activePage = event.detail;
  };
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- twitter cards -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@kahilkubilay" />
  <meta name="twitter:creator" content="@kahilkubilay" />
  <meta
    property="og:url"
    content="https://github.com/kahilkubilay/remember-em-all"
  />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta name="twitter:image:alt" content={imageText} />
</svelte:head>

<main>
  <Pages {pages} {activePage} on:switchPage={switchPage} />

  {#if activePage === "about"}
    <About />
  {:else if activePage === "game"}
    <Playground />
  {/if}
</main>
