<script>
  export let material;
</script>

<ul>
  {#each material as matter}
    <li class="first-list-element">{matter.command}:</li>
    <ul>
      <li>{@html matter.description}</li>
    </ul>
  {/each}
</ul>

<style>
  li {
    list-style: none;
  }

  .first-list-element {
    font-weight: bold;
  }

  li:last-child {
    text-indent: 20px;
    margin-bottom: 20px;
  }
</style>
