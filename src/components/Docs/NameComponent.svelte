<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Name Component`,
    description: `We are going to create the necessary component for our Pokemon
      trainer to enter a name.`,
    anotherDescription: `Let's use the <code><i>UserName component</i></code>
      in the <code><i>Userground component</i></code>, as we did in the other
      components.`,
    moreDescription: `We have one last component left, create a button component
      with the text <b>Start</b>, save it as <code><i>Start.svelte</i></code> in
      the <b>User</b> folder and finally call it in the <code><i>UserGround
      component</i></code>.`, //💩
    oneMoreDescription: `Abracadabra... The components we have made so far have
      not performed dynamic operations. We have enough material to create the
      interface and you can style them how you want. Each styling of your
      <code><i>Svelte</i></code> file is equal to the scope of the
      <code><i>Svelte</i></code> file. Child-Parent components do not have these
      style properties. In the next stages, we will add dynamic properties to
      these components.`, //💩
    image: `assets/components/User/end-interface.png`,
    alternativeText: `call Avatar Component`,
    id: "name-component",
  };

  const code = `
    <script><\/script>

    <div class="user">
      <input type="text" class="name" name="name" placeholder="pika pika" />
    </div>

    <style>
      .name {
        width: 40%;
        border-radius: 20px;
        text-align: center;
        margin-bottom: 30px;
        padding: 8px 0;
      }
    </style>
  `;

  const title = `User > Avatar > Name > UserName.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.anotherDescription} />
  <Paragraph text={article.moreDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.oneMoreDescription} />
</article>
