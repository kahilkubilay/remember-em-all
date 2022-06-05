<script context="module">
  export const list = (level) => {
    const list = [];
    const range = 5;
    const maxNumberReachedOnRange = level * range;
    let minNumberReachedOnRange = maxNumberReachedOnRange - 4;

    for (
      minNumberReachedOnRange;
      minNumberReachedOnRange <= maxNumberReachedOnRange;
      minNumberReachedOnRange++
    ) {
      list.push(minNumberReachedOnRange);
    }

    return list;
  };
</script>
