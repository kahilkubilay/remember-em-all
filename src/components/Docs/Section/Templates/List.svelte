<script>
  export let material;
</script>

{#if material !== "" && material !== undefined}
  <ul>
    {#each material as matter}
      <li>{matter.command}: {matter.description}</li>
    {/each}
  </ul>
{/if}

<style></style>
