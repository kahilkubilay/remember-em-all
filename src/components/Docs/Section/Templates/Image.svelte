<script>
  export let image;
  export let alternativeText;
</script>

<img src={image} alt={alternativeText} title={alternativeText} />

<style>
  img {
    display: flex;
    width: 90%;
    margin: 0 auto;
    border-radius: 5px;
  }

  @media screen and (max-width: 800px) {
    img {
      width: 100%;
    }
  }
</style>
