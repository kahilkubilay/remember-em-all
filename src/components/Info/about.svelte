<script>
  import Docs from "../Docs/Documentation.svelte";
  import * as ContentMap from "./content.json";

  let { English } = ContentMap.Headers;

  let svelteLogo = "assets/svelte-logo.png";
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
    width: 100%;
    margin: auto;
    background-color: #f5f5f5;
    padding: 5px;
  }

  @media screen and (min-width: 800px) {
    main {
      width: 50%;
      padding: 10px 50px;
    }
  }

  .content-map {
    position: fixed;
    width: 18%;
    top: 11.3%;
    right: 2%;
    margin-left: 40px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4px;
    background-color: #f5f5f5;
    border-width: 0 5px 3px 0;
    border-style: solid;
    border-color: #ff3e00;
  }

  .content-map:hover {
    border-width: 0;
  }

  .content-map:hover > ul {
    overflow: visible;
    height: 100%;
  }

  .content-map ul {
    padding: 0;
    margin: 0 0 15px 0;
    height: 0;
    overflow: hidden;
  }

  .content-map li {
    list-style-type: none;
    padding: 3px 20px;
  }

  a {
    font-size: 15px;
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

  @media screen and (max-width: 800px) {
    .content-map {
      display: none;
    }
  }
</style>
