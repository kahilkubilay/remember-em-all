<script context="module">
  export const list = (level) => {
    let getLevel = level;

    const list = [];
    const range = 5;
    const levelRange = getLevel * range;
    let levelCounter = levelRange - 5 + 1;

    for (levelCounter; levelCounter <= levelRange; levelCounter++) {
      list.push(levelCounter);
    }

    return list;
  };
</script>
