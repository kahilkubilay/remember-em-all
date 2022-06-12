<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Cards Spin Effect`,
    description: `After the click events on the cards, let's arrange the
      rotation effects in this section. At before, we defined styles to perform
      this action. Let's make this user interactive. `,
    requireDescription: `Let's define a store value with the name
      <code><i>cardFlipperCapsule</i></code> where we can keep the interacted
      cards.`,
    otherDescription: `After the click event, let's add the number value of the
      clicked card to the <code><i>cardFlipperCapsule</i></code> value. Here we
      give the <b>hover</b> class to the values in the
      <code><i>cardFlipperCapsule</code></i> with <b>class directives</b>.`,
    codeExplanation: `We will get a reaction for every click on the back of the
      card. We are going to connect the function which we had just created in
      Card to the <code><i>BackCardFace component</i></code>. For now, the
      function will only reflect a console output when clicking on the card.`,
    descriptionCode: `We called the <code><i>createEventDispatcher</code></i>
      function in our <code><i>CardBack component</i></code>. When clicking on
      our <code><i>CardBack component<code></i> on the DOM, the
      <code><i>openCards</i></code> function that we have assigned with this
      event is going to start its operation.`,
    endStory: `When interacting with the cards on the Playground, the value on
      the front of the card will be displayed.`,
    image: `assets/components/Card/click-on-card.png`,
    alternativeText: `user clicked on card`,
    moreImage: `assets/components/Card/open-cards.gif`,
    moreAlternativeText: `open cards on playground`,
    id: "cards-spin-effects",
  };

  const requireCode = `
    import { Writable, writable } from "svelte/store";

    export const cardFlipperCapsule: Writable<number[]> = writable([]);
  `;

  const code = `
    <script>  
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";
      import { cardFlipperCapsule } from "../../../../Store/OpenedCards";

      export let pokemon;

      const openCard = () => {
        console.log("user clicked on card");
      };
    <\/script>

    <main class="flip-container">
      <div class="flipper">
        <BackCardFace {pokemon} on:openCard={openCard} />
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

  const moreCode = `
    <script>
      import { createEventDispatcher } from "svelte";

      export let pokemon;

      const dispatch = createEventDispatcher();
    <\/script>

    <div class="back" on:click={() => dispatch("openCard", pokemon)}>
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
        class="single-poke"
        alt="card back on the playing field"
      />
    </div>

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
        box-shadow: 2px 2px 4px #8c8c8c;
      }
    </style>
  `;

  const otherCode = `
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";
      import { cardFlipperCapsule } from "../../../../Store/OpenedCards";

      export let pokemon;

      $: pokemonId = pokemon.id;
      $: pokemonNo = pokemon.no;

      const openCard = (card) => {
        let { no, id } = card.detail;

        $cardFlipperCapsule = [no, ...$cardFlipperCapsule];
      };
    <\/script>

    <main class="flip-container">
      <div class="flipper" class:hover={$cardFlipperCapsule.includes(pokemonNo)}>
        <BackCardFace {pokemon} on:openCard={openCard} />
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
    </style>`;

  const requireTitle = `componenets > store > OpenedCards.ts`;
  const title = `componenets > Playground > Cards > Card.svelte`;
  const moreTitle = `componenets > Playground > Cards > CardBack.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.requireDescription} />
  <CodeSyntax code={requireCode} title={requireTitle} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.codeExplanation} />
  <CodeSyntax code={moreCode} title={moreTitle} />
  <Paragraph text={article.descriptionCode} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax code={otherCode} {title} />
  <Paragraph text={article.endStory} />
  <Image
    image={article.moreImage}
    alternativeText={article.moreAlternativeText}
  />
</article>
