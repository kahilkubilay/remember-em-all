<script>
  export let text;

  const textData = text;
</script>

<p>{textData}</p>

<style>
  p {
    font-size: 16px;
    text-indent: 20px;
  }

  @media screen and (max-width: 800px) {
    p {
      font-size: 18px;
      /* text-indent: 2px; */
    }
  }
</style>
