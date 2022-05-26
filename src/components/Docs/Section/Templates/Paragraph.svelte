<script>
  export let text;
  export let description;

  const textData = text || description;
</script>

{#if textData !== "" && typeof textData === "string"}
  <p>{textData}</p>
{/if}

<style></style>
