<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";
  import List from "./Section/Templates/List.svelte";

  const article = {
    head: `Show Your Cards ♠️`,
    description: `After these updates on the interface, we can show off cards
      onto our playing field. In this section we will show the cards on the
      playing field.`,
    otherDescription: `We will define some functions in order to perform some
      operations in the game interface. Let's create a new folder named
      <b>GameAction</b> under our <b>SRC folder</b>. The functions that we will
      define under this folder will perform the following operations:`,
    anotherDescription: `Let's proceed step by step.. Let's create the range of
      numbers that will take place on the Interface, depending on the level.`,
    anAnotherDescription: `The number values 1, 5 and 4 that we give as
      parameters allow us to create the array values displayed on the console.
      If we have a number that covers certain intervals, there is no situation
      that prevent us from randomly mixing the numbers in the array.`, // 💩
    moreDescription: `We have created our necessary functions so that we can
      list the cards on the game interface. Let's get the
      <code><i>Playground</i></code> area excited by using them.`,
    descriptionCode: `We created a store value called <b>mixedListOfPokemon</b>
      in the <code><i>Playground component</i></code>. This value keeps the
      random numbers together with our id values. Let's pass these values as
      props to the component named Card in a loop. We will use the transferred
      values in our components named CardFront and CardBack.`,
    codeExplanation: `I exported the module because I needed the list function
      in the <code><i>ListCards.svelte</i></code> file. The function has a
      simple task. It should return a range of 5 numbers in array type with the
      value given as a parameter. Our range value represents the total range
      length we want to access. The <b>maxNumberReachedOnRange</b> value gives
      the maximum number to be reached, while the <b>minNumberReachedOnRange</b>
      value allows us to obtain the minimum number by using the maximum value.
      Let's check how it works by calling it in our
      <code><i>Playground component</i></code>.`,
    otherCodeExplanation: `By using the function we will create in the
      <code><i>MixCards component</i></code>, we will copy the values in the
      array we obtained from the list function. When our number range is 5,
      there will be 10 values in total in our new array value. These values will
      be placed randomly in the array instead of following a specific order. In
      order to match the cards in the future, let's assign an id value according
      to the sequence number of each card.`,
    endStory: `We have successfully sorted our cards on the interface. As we did
      in the previous section, when we add <b>.hover</b> to the element with the
      <b>.flipper</b> class value, we can inspect the <code><i>CardFront
      component</i></code> of the card.`,
    image: `assets/components/GameAction/function-of-list-cards.png`,
    anotherImage: `assets/components/GameAction/shuffle-cards.png`,
    moreImage: `assets/components/GameAction/card-components.png`,
    alternativeText: `Display of ListCards module on console`,
    anotherAlternativeText: `Display of MixCards module on console`,
    moreAlternativeText: `Observing CardFront and CardBack components`,
    terms: [
      {
        command: `LevelUpdate`,
        description: `When all the cards are matched correctly on the interface,
          the next level will be passed.`,
      },
      {
        command: `ListCards`,
        description: `The cards on the interface will be brought according to
          the level. While cards in the range of 0-5 at the 1st level are
          brought, cards with the numbers 5-10 at the 2nd level and 10-15 at the
          3rd level will be reflected on the interface. We will construct the
          range values with the function here.`,
      },
      {
        command: `MixCards`,
        description: `The cards on the interface should be distributed randomly,
          not in a row. We will do this with the MixCards function.`,
      },
      {
        command: `CloseOpenCards`,
        description: `When 2 unmatched cards are opened or all cards are matched
          correctly, the cards must be closed in the interface for the next
          level to be reached. In both cases we will define valid functions. 
          Let's proceed step by step. Let's create the range of numbers that
          will take place on the Interface, depending on the level.`,
      },
    ],
    id: "show-cards-in-your-hand",
  };

  const code = `
    <script context="module">
      export const list = (level) => {
        const list = [];
        const range = 5;
        const maxNumberReachedOnRange = level * 5;
        let minNumberReachedOnRange = maxNumberReachedOnRange - 4;

        for(minNumberReachedOnRange; 
          minNumberReachedOnRange <= maxNumberReachedOnRange; 
          minNumberReachedOnRange++) {
          list.push(levelCounter);
        }

        return list;
      }
    <\/script>
  `;

  const otherCode = `
    <script context="module">
      export const shuffle = (pokemonList) => {
        let shakeList = [];
        const duplicateList = pokemonList.concat(pokemonList);
        const totalNumberRange = duplicateList.length - 1;

        for(let counter = 0; counter <= totalNumberRange; counter++) {
          let pokemonNo = counter;
          const randomNumb = Math.trunc(Math.random() * duplicateList.length);

          shakeList = [
            { no: pokemonNo, id: duplicateList[randomNumber] },
            ...shakeList
          ];

          duplicateList.splice(duplicateList.indexOf(duplicateList[randomNumb]), 1);
        }

        return shakeList;
      }
    <\/script>
  `;

  const oneMoreCode = `
      <script>
        import UserGround from "../../User/UserGround.svelte";
        import { userInfo } from "../../../Store/User";
        import Card from "./Cards/Card.svelte";
        import { list } from "../../GameAction/ListCards.svelte";
        import { shuffle } from "../../GameAction/MixCards.svelte";
        import { level } from "../../../Store/Level";

        const { isStart } = userInfo;
        $: pokemonList = list($level);
        $: mixedListOfPokemon = shuffle(pokemonList);
      <\/script>

      <main class="playground">
        {#if !$isStart}
          {#each mixedListOfPokemon as pokemon}
            <Card {pokemon} />
          {/each}
        {:else}
          <UserGround />
        {/if}
      </main>

      <style>
        .playground {
          width: 900px;
          margin: 0 auto;
          text-align: center;
        }
      </style>
  `;

  const anotherOneMoreCode = `
    <script>
      export let pokemon;

      $: pokemonId = pokemon.id;
    <\/script>

    <div class="front">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemonId}.png"
        alt="card on the playing field"
        class="single-poke"
      />
    </div>
    
    <style>
      .front {
        width: 100px;
        height: 100px;
        backface-visibility: hidden;
        transition: 0.6s;
        transform-style: preserve-3d;
        position: absolute;
        top: 0;
        left: 0;
        transform: rotateY(-180deg);
      }

      .single-poke {
        border-radius: 11px;
        background-color: #fff;
        box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #fff;
      }
    </style>
  `;

  const moreCode = `
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";
    <\/script>

    <main class="flip-container">
      <div class="flipper"></div>
    </main>

    <style>
      .back {
        width: 100px;
        height: 100px;
        backface-visibility: hidden;
        transition: 0.6s;
        transform-style: preserve-3d;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        transform: rotateY(0deg);
        border-radius: 11px;
      }

      .back:hover {
        cursor: pointer;
      }

      .single-poke {
        border-radius: 11px;
        background: #fff;
        box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #fff;
      }  
    </style>
  `;

  const anotherAnOneMoreCode = `
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";

      export let pokemon;  
    <\/script>

    <main class="flip-container">
      <div class="flipper">
        <BackCardFace {pokemon} />
        <FrontCardFace {pokemon} />
      </div>
    </main>

    <style>
      .flip-container {
        perspective: 1000px;
        transform-style: preserve-3d;
        display: inline-block;
        margin: 5px;
        width: 100px;
        height: 100px;
      }

      .flipper {
        position: relative;
      }
    </style>
  `;

  const title = `componenets > GameAction > ListCards.svelte`;
  const otherTitle = `componenets > GameAction > MixCards.svelte`;
  const oneMoreTitle = `components > Playground > Cards > Wrapper > 
    Playground.svelte`;
  const moreTitle = `components > Playground > Wrapper > Cards > Card.svelte`;
  const anotherTitle = `components > Playground > Wrapper > Cards > 
    CardBack.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <List material={article.terms} />
  <Paragraph text={article.anotherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.codeExplanation} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.anAnotherDescription} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Paragraph text={article.otherCodeExplanation} />
  <Image
    image={article.anotherImage}
    alternativeText={article.alternativeText}
  />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={oneMoreCode} title={oneMoreTitle} />
  <Paragraph text={article.descriptionCode} />
  <CodeSyntax code={moreCode} title={moreTitle} />
  <CodeSyntax code={anotherAnOneMoreCode} title={anotherTitle} />
  <CodeSyntax code={anotherOneMoreCode} title={anotherTitle} />
  <Paragraph text={article.endStory} />
  <Image
    image={article.moreImage}
    alternativeText={article.moreAlternativeText}
  />
</article>
