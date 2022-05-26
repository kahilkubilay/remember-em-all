<script>
  import Docs from "../Docs/Documentation.svelte";

  import DetailEN from "../../../README.md";
  import DetailTR from "./READMETR.md";
  import * as ContentMap from "./content.json";

  let languages = ["Turkish", "English"];
  let activeLanguage = "Turkish";

  let { Turkish, English } = ContentMap.Headers;

  const switchLanguages = (language) => {
    activeLanguage = language;
  };

  let svelteLogo = "/assets/svelte-logo.png";
</script>

<main class="container">
  {#if activeLanguage === "Turkish"}
    <Docs />

    <!-- <DetailTR /> -->
  {:else}
    <DetailEN />
  {/if}

  <!-- <div class="content-map">
    <img src={svelteLogo} alt="Svelte logo" class="logo" />
    <ul>
      {#each activeLanguage === "Turkish" ? Turkish : English as ContentMap}
        <li>
          <a href={ContentMap.target}
            >{ContentMap.title[0].toUpperCase() + ContentMap.title.slice(1)}</a
          >
        </li>
      {/each}
    </ul>

    <div class="flag-capsule">
      {#each languages as language}
        <div on:click={() => switchLanguages(language)}>
          <img
            src="/assets/{language}.svg"
            alt="{language} flag"
            class="flag"
          />
        </div>
      {/each}
    </div>
  </div> -->
</main>

<style>
  main {
    width: 900px;
    margin: auto;
    background-color: #f5f5f5;
    padding: 10px 50px;
    border-radius: 5px;
  }

  .content-map {
    position: fixed;
    width: 250px;
    top: 50%;
    left: 110px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4px;
    background-color: #f5f5f5;
  }

  .content-map ul {
    padding: 0;
    margin: 0 0 15px 0;
  }

  .content-map li {
    list-style-type: none;
    padding: 3px 20px;
  }

  a {
    font-size: 16px;
    font-family: "Segoe UI", "Helvetica Neue", sans-serif;
    text-decoration: none;
    color: #000;
  }

  a:hover {
    text-decoration: underline;
  }

  .flag-capsule {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .flag {
    width: 35px;
    margin-right: 5px;
    border: 1px solid black;
    border-radius: 5px;
    cursor: pointer;
  }

  .logo {
    width: 50px;
    margin: 10px auto;
  }
</style>
