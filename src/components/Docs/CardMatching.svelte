<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Card Matching`,
    description: `Now that we can open all the cards, let's match the opened
      cards with each other.`,
    otherDescription: `In the previous section, we kept the cards that the user
      clicked on a store value called <code><i>cardFlipperCapsule</i></code>.
      We can access these values as we wish, update them and use them within the
      structure we have constructed. Let's create 2 more store values, where we
      can hold the cards that the user interacts with, as well as the cards that
      are opened and matched.`,
    moreDescription: `Store the 2 cards that carried out the click event in
      <code><i>OpenCardsCapsule</i></code>. When the total number of data in
      <code><i>OpenCardsCapsule</i></code> is equal to 2, let's check the id
      values of the cards. In case of equality, let's keep the id value in
      <code><i>catchEmAll</i></code>.`,
    image: `assets/components/Card/matching-cards.gif`,
    alternativeText: `Matching cards on the playground`,
    id: "card-matching",
  };

  const code = `
    import { Writable, writable } from "svelte/store";

    export const cardFlipperCapsule: Writable<number[]> = writable([]);
    export const openCardsCapsule: Writable<number[]> = writable([]);
    export const catchEmAll: Writable<number[]> = writable([]);
  `;

  const moreCode = `
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";
      import {
        cardFlipperCapsule,
        openCardsCapsule,
        catchEmAll,
      } from "../../../../Store/OpenedCards";

      export let pokemon;

      $: pokemonId = pokemon.id;
      $: pokemonNo = pokemon.no;

      const openCard = (card) => {
        let getPokemonNo = card.detail.no;
        let getPokemonId = card.detail.id;

        $openCardsCapsule = [getPokemonId, ...$openCardsCapsule];
        $cardFlipperCapsule = [getPokemonNo, ...$cardFlipperCapsule];

        if ($openCardsCapsule.length >= 2) {
          const firstOpenCard = $openCardsCapsule[0];
          const secondOpenCard = $openCardsCapsule[1];

          if (firstOpenCard === secondOpenCard) {
            $catchEmAll = [firstOpenCard, ...$catchEmAll];
          }
        }
      }
    <\/script>

    <main class="flip-container">
      <div
        class="flipper"
        class:hover={$cardFlipperCapsule.includes(pokemonNo) ||
          $catchEmAll.includes(pokemonId)}
      >
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

  const title = `componenets > store > OpenedCards.ts`;
  const moreTitle = `componenets > Playground > Cards > Card.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={moreCode} title={moreTitle} />
  <Image image={article.image} alternativeText={article.alternativeText} />
</article>
