<script>
  export let matter;
</script>

<ul>
  {#each matter as item}
    <li>🎈 {@html item}</li>
  {/each}
</ul>

<style>
  li {
    list-style: none;
    margin-bottom: 10px;
  }
</style>
