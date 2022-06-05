<script context="module">
  export const shuffle = (pokemonList) => {
    let shakeList = [];
    const duplicateList = pokemonList.concat(pokemonList);
    const totalNumberRange = duplicateList.length - 1;

    for (let counter = 0; counter <= totalNumberRange; counter++) {
      let pokemonNo = counter;
      const randomNumb = Math.trunc(Math.random() * duplicateList.length);

      shakeList = [
        { no: pokemonNo, id: duplicateList[randomNumb] },
        ...shakeList,
      ];

      duplicateList.splice(duplicateList.indexOf(duplicateList[randomNumb]), 1);
    }

    return shakeList;
  };
</script>
