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
  @import "https://fonts.googleapis.com/css?family=Average+Sans|Goudy+Bookletter+1911";

  .contents {
    text-align: center;
    width: 900px;
    padding: 25px 50px;
    margin: 10px auto;
    border-radius: 5px;
    background-color: #f5f5f5;
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
    margin-right: 8px;
    color: #000;
    cursor: pointer;
  }

  li:first-child {
    border-right: 2px solid black;
    padding-right: 8px;
  }
</style>
