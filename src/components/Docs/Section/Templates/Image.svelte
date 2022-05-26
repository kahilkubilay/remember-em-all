<script>
  export let image;
  export let alternativeText;
</script>

{#if image !== "" && typeof image === "string" && alternativeText !== "" && typeof alternativeText === "string"}
  <img src={image} alt={alternativeText} title={alternativeText} />
{/if}

<style>
  img {
    max-width: 900px;
  }
</style>
