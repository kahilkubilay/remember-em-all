/**
 * 
 * list: [],
    level: Number,
    levelCounter: Number,
    shakePokeList: [],
 */

export class Pokemons {
   level:any

   constructor(level:number) {
      this.level = level
   }


  list(): number[] {
      const list = [];
      const range = 5;
      const levelRange = this.level * range;
      let levelCounter = (levelRange - 5 ) + 1;

      for(levelCounter; levelCounter <= levelRange; levelCounter++) {
            list.push(levelCounter)
      }

      return list
  }

  shakeList(list:number[]):any {
     let shakeList = [];
     const duplicateList:number[] = list.concat(list);
     const levelLength:number = duplicateList.length - 1;
     let pokemonNo:any;

     for(let counter=0; counter < levelLength + 1; counter++) {
      pokemonNo = counter;
      const randomNumberForList:number = Math.trunc(Math.random() * 
         duplicateList.length)

      shakeList = [{no: pokemonNo, id: duplicateList[randomNumberForList]}, 
         ...shakeList]
      duplicateList.splice(duplicateList
            .indexOf(duplicateList[randomNumberForList]), 1)
     }

     return shakeList;
  }
}