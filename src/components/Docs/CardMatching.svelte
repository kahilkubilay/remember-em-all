<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Card Matching`,
    description: `Bütün kartları açabildiğimize göre, açılan kartları 
      birbirleriyle eşleştirelim.`,
    otherDescription: `Bir önceki bölümde, kullanıcının üzerine tıkladığı 
      kartları <code><i>cardFlipperCapsule</i></code> isminde bir store 
      değerinde tuttuk. Bu değerlere istediğimiz gibi erişebilir, 
      güncelleyebilir ve kurguladığımız yapı içerisinde kullanabiliriz.
      Kullanıcının etkileşime girdiği kartları tuttuğumuz gibi, açılan ve 
      eşleşen kartları tutabileceğimiz 2 store değeri daha oluşturalım.`,
    moreDescription: `Click eventi gerçekleştirelen 2 kartı 
      <code><i>OpenCardsCapsule</i></code> içerisinde saklayalım. 
      <code><i>OpenCardsCapsule</i></code> içerisinde toplam data sayısı 2'ye
      eşit olduğunda, kartların id değerlerini kontrol edelim. Eşitlik durumunda
      id değerini <code><i>catchEmAll</i></code> içerisinde tutalım. `,
    requireDescription: `<code><i>Class directives</i></code> üzerinde 
      kullandığımız .includes metoduyla birlikte catchEmAll içerisinde yer alan
      id değerlerine "hover" classini ekliyoruz. Hover içerisindeki stil
      tanımlaması catchEmAll içerisinde yer alan id değerleri ile arayüz 
      üzerinde bu id sahip kartların <code><i>CardFront bileşenini</i></code>
      göstermesini sağlayacak.`,
    codeExplanation: ``,
    descriptionCode: ``,
    endStory: ``,
    image: `assets/components/Card/matching-cards.gif`,
    alternativeText: ``,
    moreImage: ``,
    moreAlternativeText: ``,
    id: "card-matching",
  };

  const requireCode = ``;

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
  <Paragraph text={article.codeExplanation} />
  <Image image={article.image} alternativeText={article.alternativeText} />
</article>
