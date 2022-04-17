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
     const shakeList:number[] = [];
     const duplicateList:number[] = list.concat(list);
     const levelLength:number = duplicateList.length - 1;

     for(let counter=0; counter < levelLength + 1; counter++) {
      const randomNumberForList:number = Math.trunc(Math.random() * 
         duplicateList.length);

      shakeList.push(duplicateList[randomNumberForList]);

      duplicateList.splice(duplicateList
            .indexOf(duplicateList[randomNumberForList]), 1)
     }

     return shakeList;
  }
}