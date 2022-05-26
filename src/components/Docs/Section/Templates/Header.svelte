<script>
  export let header;
</script>

{#if header !== "" && typeof header === "string"}
  <h2>🪁 {header}</h2>
{/if}

<style></style>
