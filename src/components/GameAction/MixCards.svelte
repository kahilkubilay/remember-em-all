<script context="module">
  export const shuffle = (pokemonList) => {
    let shakeList = [];
    const duplicateList = pokemonList.concat(pokemonList);
    const levelLength = duplicateList.length - 1;
    let pokemonNo;

    for (let counter = 0; counter < levelLength + 1; counter++) {
      pokemonNo = counter;
      const randomNumberForList = Math.trunc(
        Math.random() * duplicateList.length
      );

      shakeList = [
        { no: pokemonNo, id: duplicateList[randomNumberForList] },
        ...shakeList,
      ];
      duplicateList.splice(
        duplicateList.indexOf(duplicateList[randomNumberForList]),
        1
      );
    }

    return shakeList;
  };
</script>
