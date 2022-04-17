<script lang="ts">
  import DetailEN from "../../Content/ReadMe.md";
  import DetailTR from "../../Content/ReadMETR.md";
  import { lang } from "../../store/Lang";

  export const changeLang = () => {
    $lang = $lang === "EN" ? "TR" : "EN";
  };
</script>

<main class="container">
  {#if $lang === "EN"}
    <DetailEN />
  {:else}
    <DetailTR />
  {/if}

  <div class="switchLang">
    <img
      hidden={$lang === "TR"}
      src="/images/tr.svg"
      alt="TR Flag"
      class="flag"
      on:click={changeLang}
    />
    <img
      hidden={$lang === "EN"}
      src="/images/gb.svg"
      alt="EN Flag"
      class="flag"
      on:click={changeLang}
    />
  </div>
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

  .switchLang {
    position: absolute;
    width: 100px;
    display: flex;
    right: 200px;
    top: 200px;
  }

  .flag {
    width: 40px;
    border: 1px solid black;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
