<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Card Component`,
    description: `We will need components for the cards we will use in the
      playground. While we will hold the pokemon image of the card in the
      <code><i>CardFront component</i></code>, we will hold the question mark
      ('?') image in the <code><i>CardBack component</i></code>. The common
      container for both components will be the <code><i>Card
      component</i></code>.`,
    otherDescription: `While testing the <code><i>Card component</i></code>,
      let's change the <b>isStart</b> condition in the <code><i>Playground
      component</i></code> to <b>true</b> in order not to constantly choose
      names and avatars on the <code><i>User component</i></code>.`,
    anotherDescription: `An API address is given as the <b>img src attribute</b>
      in the images in the <code><i>CardFront component</i></code>. By updating
      the numbers in the filenames in this API, different pokemon images can be
      accessed.`,
    anAnotherDescription: `Let's call the <code><i>CardFront
      component</i></code> in the <code><i>Card component</i></code> first, and
      the <code><i>Card component</i></code> in the block that returns
      <b>true</b> in the Playground. By repeating the same process in the
      <code><i>CardBack component</i></code>, we will be able to examine every
      update we have made on the <code><i>Card components</i></code>.`, // 💩
    moreAnotherDescription: `<code><i>Card components</i></code> are
      block-elements, so they stand one after the other. Take the components
      into a container and take them to the inline-block level. Since we are
      calling it in the same component, when we give the <b>position:
      absolute</b> style, the child components in the <code><i>Card
      Component</i></code> will stand on top of each other. This way they will
      have the appearance of two different sides of the same card.`, // 💩
    moreDescription: `By using CSS, we will display the card in
      <code><i>CardFront</i></code> under the <code><i>CardBack
      Component</i></code> with the <b>transform</b> property with each click on
      the back of the Card. Let's add the following properties to our
      <code><i>Global.css</i></code> file.`,
    descriptionCode: `We tried to give a simple card look by adding certain
      features to the containers with <code><i>back and front
      classes</i></code>, which are <b>img</b> containers. Now, we have a chance
      to examine how it looks on the interface by calling the <code><i>Card
      component</code></i> in the <code><i>CardBack component</i></code>.`,
    oneMoreDescription: `<code><i>Card components</i></code> need to provide
      rotation at the same speed and from the same perspective as a whole. The
      style properties defined in each component in <code><i>Svelte</i></code>
      are as much as the container of the component, other components are not
      affected by these styling. Therefore, let's make the same definitions for
      both classes or define these stylings as <code><i>Global</i></code>.`,
    codeExplanation: `When we give <b>.back</b>, <b>position: absolute</b> to
      the container class of the <code><i>CardBack Component</i></code>, both
      cards will be displayed one above the other.`,
    otherCodeExplanation: `Provide <b>transform</b> styling in <code><i>Card
      components</i></code> so that when <b>hover class</b> is added, it gives a
      rotation effect.`,
    endStory: `When you add the <b>hover</b> class to the element with the
      <b>flipper</b> class of the <code><i>Card Back</i></code> component on the
      console, you can see the effect.`,
    image: `assets/components/Card/card-views.png`,
    anotherImage: `assets/components/Card/card-position.gif`,
    anotherOneImage: `assets/components/Card/card-turn-effect-back.png`,
    moreImage: `assets/components/Card/card-turn-effect-front.png`,
    alternativeText: `class Directives`,
    anotherAlternativeText: `card position`,
    anotherOneAlternativeText: `Card turn effect back`,
    moreAlternativeText: `Card turn effect front`,
    id: "card-component",
  };

  const code = `
    <script><\/script>

    <img
      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
      alt="card on the playing field"
      class="single-poke"
    />

    <style>
      .front {
        width: 100px;
        height: 100px;
        top: 0;
        left: 0;
      }

      .single-poke {
        border-radius: 11px;
        background-color: #fff;
        box-shadow: 2px 2px 4px #8c8c8c, -12px -12px 22px #fff;
      }  
    </style>
  `;

  const otherCode = `
    <script><\/script>

    <div class="back">
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
        top: 0;
        left: 0;
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

  const oneMoreCode = `
    .flipper.hover .front {
      transform: rotateY(0deg);
    }

    .flipper.hover .back {
      transform: rotateY(180deg);
    }
  `;

  const anotherOneMoreCode = `
    <script>
      import FrontCardFace from "./CardFront.svelte";
      import BackCardFace from "./CardBack.svelte";
    <\/script>

    <main class="flip-container">
      <div class="flipper">
        <FrontCardFace />
        <BackCardFace />
      </div>
    </main>

    <style>
      .flip-container {
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
    <script><\/script>

    <div class="front">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
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

  const title = `componenets > Playground > Cards > CardFront.svelte`;
  const otherTitle = `componenets > Playground > Cards > CardBack.svelte`;
  const oneMoreTitle = `public > global.css`;
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.anotherDescription} />
  <Paragraph text={article.anAnotherDescription} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Paragraph text={article.descriptionCode} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.moreAnotherDescription} />
  <CodeSyntax code={anotherOneMoreCode} title={otherTitle} />
  <Paragraph text={article.codeExplanation} />
  <Image
    image={article.anotherImage}
    alternativeText={article.alternativeText}
  />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={oneMoreCode} title={oneMoreTitle} />
  <Paragraph text={article.otherCodeExplanation} />
  <CodeSyntax code={moreCode} title={otherTitle} />
  <Paragraph text={article.oneMoreDescription} />
  <CodeSyntax code={anotherAnOneMoreCode} {title} />
  <Paragraph text={article.endStory} />
  <Image
    image={article.anotherOneImage}
    alternativeText={article.anotherAlternativeText}
  />
  <Image
    image={article.moreImage}
    alternativeText={article.moreAlternativeText}
  />
</article>
