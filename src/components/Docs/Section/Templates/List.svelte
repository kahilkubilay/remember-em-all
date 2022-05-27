<script>
  export let material;
</script>

{#if material !== "" && material !== undefined}
  <ul>
    {#each material as matter}
      <li>{matter.command}</li>
      <ul>
        <li>{matter.description}</li>
      </ul>
    {/each}
  </ul>
{/if}

<style></style>
