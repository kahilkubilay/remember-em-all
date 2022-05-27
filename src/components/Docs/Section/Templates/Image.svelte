<script>
  export let image;
  export let alternativeText;
</script>

<img src={image} alt={alternativeText} title={alternativeText} />

<style>
  img {
    display: flex;
    max-width: 900px;
    margin: 0 auto;
  }
</style>
