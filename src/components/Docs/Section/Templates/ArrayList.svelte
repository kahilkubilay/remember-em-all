<script>
  export let list;
</script>

{#if list !== "" && list !== undefined}
  <ul>
    {#each list as matter}
      <li>🎈 {matter}</li>
    {/each}
  </ul>
{/if}

<style></style>
