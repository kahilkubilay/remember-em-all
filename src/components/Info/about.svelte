<script>
  import Docs from "../Docs/Documentation.svelte";
  import * as ContentMap from "./content.json";

  let { English } = ContentMap.Headers;

  let svelteLogo = "/assets/svelte-logo.png";
</script>

<main class="container">
  <Docs />

  <div class="content-map">
    <img src={svelteLogo} alt="Svelte logo" class="logo" />
    <ul>
      {#each English as ContentMap}
        <li>
          <a href={ContentMap.target}
            >{ContentMap.title[0].toUpperCase() + ContentMap.title.slice(1)}</a
          >
        </li>
      {/each}
    </ul>
  </div>
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

  .logo {
    width: 50px;
    margin: 10px auto;
  }
</style>
