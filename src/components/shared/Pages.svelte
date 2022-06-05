<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let pages, activePage;
</script>

<div class="contents">
  <ul>
    {#each pages as page}
      <li on:click={() => dispatch("switchPage", page)}>
        <div class:active={page === activePage}>
          {page}
        </div>
      </li>
    {/each}
  </ul>
</div>

<style>
  .contents {
    width: 100%;
    border-radius: 5px;
    margin: 10px auto;
  }

  ul {
    display: flex;
    justify-content: center;
    text-align: center;
  }

  li {
    font-size: 23px;
    list-style-type: none;
    cursor: pointer;
  }

  @media screen and (min-width: 800px) {
    .contents {
      width: 900px;
      padding: 25px 50px;
    }

    li {
      margin-right: 6px;
      color: #000;
    }

    li:first-child {
      border-right: 2px solid black;
      padding-right: 6px;
    }
  }

  @media screen and (max-width: 800px) {
    .contents {
      border: 1px solid black;
      margin-top: 0;
    }

    li {
      width: 100%;
      background-color: rebeccapurple;
      color: #fff;
    }

    li:first-child {
      border-right: 2px solid #fff;
    }
  }
</style>
