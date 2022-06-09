<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Cards Spin Effect`,
    description: `Kartlara click eventi gerçekleştirildikten sonra, dönüş 
      efektlerini bu bölümde düzenleyelim. Daha önce bu işlemi 
      gerçekleştirecek stiller tanımlamıştık. Bunu kullanıcı etkileşimli hale 
      getirelim. `,
    requireDescription: `Etkileşim yapılan kartları tutabileceğimiz 
      cardFlipperCapsule ismiyle bir store değeri tanımlayalım.`,
    otherDescription: `Click eventi gerçekleştikten sonra, tıklanan kartın 
      no değerini <code><i>cardFlipperCapsule</i></code> değerine ekleyelim. 
      <code><i>Class directives ile cardFlipperCapsule</i></code> içerisinde yer
      alan değerlere 'hover' sınıfını verelim. `,
    codeExplanation: `Kartın arka yüzüne her tıklamada bir tepki alacağız. 
      <code><i>BackCardFace bileşenine Card bileşeninde</i></code> yeni 
      oluşturduğumuz fonksiyonu bağlayalım. Fonksiyon şuan için sadece kartın
      üstüne tıklandığında bir konsol çıktısı yansıtacak.`,
    descriptionCode: `<code><i>CardBack bileşenimizde 
      createEventDispatcher</i></code> fonksiyonunu çağırdık. <code><i>CardBack
      bileşenemize</i></code> DOM üzerinde tıklama işlemi gerçekleştirildiğinde
      bu event ile atadığımız openCards fonksiyonu çalışmasını başlatacak.`,
    endStory: `<code><i>Playground</i></code> üzerinde bulunan kartlara 
      etkileşim gerçekleştiğinde, kartın ön yüzündeki değer görüntülenecektir.`,
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
