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
    text-align: center;
    width: 900px;
    padding: 25px 50px;
    margin: 10px auto;
    border-radius: 5px;
  }

  ul {
    display: flex;
    justify-content: center;
    margin: auto 0;
  }

  li {
    font-family: "Segoe UI", "Helvetica Neue", sans-serif;
    font-size: 23px;
    list-style-type: none;
    color: #000;
    cursor: pointer;
    margin-right: 6px;
  }

  li:first-child {
    border-right: 2px solid black;
    padding-right: 6px;
  }
</style>
