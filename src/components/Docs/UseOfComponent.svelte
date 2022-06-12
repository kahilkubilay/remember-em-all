<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Usage of component`,
    description: `It provides convenience when working on breaking down the
      components in our applications and bringing them into a whole as we want,
      and it takes less effort to be able to recall the repetitive component
      parts.`,
    otherDescription: `Let's turn the simple structure that produces random
      numbers that we made in the previous example into a component. Let's
      create the <code><i>RandomNumber.svelte</i></code> file in the 
      <code><i>components/Content/</i></code> directory. We can use this new
      component in the <code><i>App.svelte</i></code> file.`,
    anotherDescription: `We can start using the <b>RandomNumber component</b> by
      calling it as we want. With this, components of <b>button & h3 elements
      </b> used in the component should also be created. You can see these uses
      in the components we will use for the game.`,
    image: `assets/components/component-with-sabuha.png`,
    anotherImage: `assets/components/random-number-component.gif`,
    alternativeText: `simple component usage demonstration`,
    anotherAlternativeText: `Random Number Component`,
    id: "use-of-components",
  };

  const code = `
    <script>
      let number = 0;
  
      const randomNumber = () => {
        number = Math.round(Math.random() \* 15);
      };
    <\/script>

    <div class="random-number-capsule">
      <h3>{number}</h3>
      <button on:click={randomNumber}>Update Number</button>
    </div>

    <style>
      .random-number-capsule {
        border-radius: 5px;
        background-color: yellowgreen;
        padding: 5px;
        margin: 10px 50px;
      }
      
      h3 {
        background-color: orangered;
        width: 100px;
        color: white;
      } 
      
      button {
        border: 1px solid black;
        cursor: pointer;
      } 
      
      h3,
      button {
        display: block;
        text-align: center;
        margin: 25px auto;
        padding: 5px;
      }
    </style>
  `;

  const otherCode = `
    <script>
      import RandomNumber from "./components/Content/RandomNumber/RandomNumber.svelte";
    <\/script>

    <main>
      <RandomNumber />
      <RandomNumber />
      <RandomNumber />
      <RandomNumber />
    </main>
  `;

  const title = `Components > Content > RandomNumber.svelte`;
  const otherTitle = `App.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.anotherDescription} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Image
    image={article.anotherImage}
    alternativeText={article.anotherAlternativeText}
  />
</article>
