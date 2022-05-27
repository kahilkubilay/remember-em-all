<script>
  export let matter;
</script>

<ul>
  {#each matter as item}
    <li>🎈 {item}</li>
  {/each}
</ul>
