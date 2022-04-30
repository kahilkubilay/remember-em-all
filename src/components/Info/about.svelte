<script lang="ts">
  import DetailEN from "../../../README.md";
  import DetailTR from "./READMETR.md";
  import { lang } from "../../store/Lang";
  import * as content from "./content.json";

  export const switchLanguages = () => {
    $lang = $lang === "EN" ? "TR" : "EN";
  };

  let { Turkish, English } = content.Headers;
</script>

<main class="container">
  {#if $lang === "EN"}
    <DetailEN />
  {:else}
    <DetailTR />
  {/if}

  <ul class="content-map">
    {#each $lang === "EN" ? English : Turkish as content}
      <li>
        <a href={content.target}>{content.title}</a>
      </li>
    {/each}
    <li>
      <div class="switch-lang">
        <img
          hidden={$lang === "TR"}
          src="./assets/tr.SVG"
          alt="TR Flag"
          class="flag"
          on:click={switchLanguages}
        />
        <img
          hidden={$lang === "EN"}
          src="./assets/gb.SVG"
          alt="EN Flag"
          class="flag"
          on:click={switchLanguages}
        />
      </div>
    </li>
  </ul>
</main>

<style>
  @import "flag-icon-css/css/flag-icon.min.css";

  main {
    width: 900px;
    margin: auto;
    background-color: #f5f5f5;
    padding: 10px 50px;
    border-radius: 5px;
  }

  .switch-lang {
    width: 100px;
    right: 200px;
    top: 200px;
  }

  .flag {
    width: 40px;
    border: 1px solid black;
    border-radius: 5px;
    cursor: pointer;
  }

  .content-map {
    position: fixed;
    width: 250px;
    top: 50%;
    left: 110px;
    margin: 0;
    padding: 0;
  }

  .content-map li {
    padding-bottom: 5px;
  }

  .content-map li:last-child {
    justify-content: center;
    display: flex;
    padding-top: 18px;
  }

  .content-map li a {
    font-size: 18px;
  }
</style>
