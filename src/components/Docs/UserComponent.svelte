<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";
  import Matter from "./Section/Templates/Matter.svelte";

  const article = {
    head: `User Component`,
    description: `Let's create the <b>Avatar and Name</b> folders for each value
      we will receive from the User under the <code><i>User</i></code> folder.
      We will include a container in the root folder that will contain all the
      structures defined under <code><i>User Component</i></code>. I'm creating
      a file called <code><i>UserGround.svelte</i></code>, all the components we
      split will be located here.`,
    otherDescription: `By creating a similar structure in the
      <code><i>Playground</i></code> folder, we will call all the components in
      the game on the same file. Let's create the <code><i>Wrapper >
      Playground.svelte</code></i> directory and file under Playground.`,
    anotherDescription: `While working on the <b>User Component</b>, let's call
      the <b>User Component</b> in the <code><i>Playground > Wrapper >
      Playground.svelte</i></code> file so that we can review the changes we
      will make.`,
    anAnotherDescription: `After calling the <code><i>User Component</i></code>,
      let's start developing on it.`, // 💩
    moreAnotherDescription: `There are 4 different sections on the component.`, // 💩
    codeExplanation: `We have defined a simple header tag in our component. We
      call <code><i>componentDetail</i></code> value in
      <code><i>Header</i></code>.`,
    moreCodeExplanation: `Let's use it by importing it to the
      <code><i>Playground component</i></code> so that we can examine the
      improvements we will make in our component in the browser.`,
    material: [
      `A header that informs the user`,
      `A section where the user can choose avatars over images`,
      `Space to the enter username`,
      `And when all this is completed, there is a button element that starts the
      game.`,
    ],
    image: `assets/components/User/call-user-component.png`,
    anotherImage: `assets/components/User/components-section.png`,
    alternativeText: `Call User Component`,
    anotherAlternativeText: `displaying components on the dom`,
    id: "user-component",
  };

  const code = `
    <script>
      const componentDetail = "User";
    <\/script>

    <main>
      <h2>{componentDetail} Component</h2>
    </main>

    <style>
      h2 {
        color: white;
        background-color: orangered;
        text-align: center;
      }  
    </style>
  `;

  const otherCode = `
    <script>
      import Userground from "../../User/Userground.svelte";
    <\/script>

    <main>
      <UserGround />
    </main>

    <style>
      h2 {
        color: white;
        background-color: orangered;
        text-align: center;
      }
    </style>
  `;

  const title = `User > UserGround.svelte`;
  const otherTitle = `Playground > Wrapper > Playground.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <Paragraph text={article.anotherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.codeExplanation} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Paragraph text={article.moreCodeExplanation} />
  <Paragraph text={article.anAnotherDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.moreAnotherDescription} />
  <Matter matter={article.material} />
  <Image
    image={article.anotherImage}
    alternativeText={article.alternativeText}
  />
</article>
