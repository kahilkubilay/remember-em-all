<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `User Detail Componenti`,
    description: `In our last section, let's create a component with
      <code><i>Score and Level<i></code> that displays the user's name and
        selected avatar on the game interface at the start of the game.`,
    requireDescription: `Components klasörümüzde GameElements isminde yeni bir 
      klasör oluşturalım. Daha önce <code><i>score ve level</i></code> 
      değerlerimizi kapsayan bir bileşen oluşturmadığımız için bu bileşenleri 
      burada oluşturacağız.`,
    otherDescription: `We may define simple style properties while creating
      these components.`,
    moreDescription: `We used the same code structure in the components, the
      only thing that changed was the store values we imported. By defining the
      store value you want to use in a single component, you can reach the same
      result as the structure we used by defining it in props. Let's create the
      component to display the user's name.`,
    codeExplanation: `By accessing the <code><i>UserInfo class</i></code> that
      we used when creating the user, we invite the <b>Mr. name</b> defined in
      it to the stage. Let's display this value in HTML. We also need a
      component that is necessary for us to display the avatar that the user has
      selected.`,
    anotherDescription: `Let's keep these components inside a component called
      <code><i>UserDetail</i></code> as a common component.`,
    oneMoreDescription: `When we call our <code><i>UserDetail
      component</i></code> on <code><i>Playground</i></code>, we can add the
      information of the user we want to the playground. If you remember, my
      friend, we gave the <b>isStart</b> value in <code><i>Playground</i></code>
      as false in order to examine the development we made in the <code><i>Card
      component</i></code>. When we fix this, we are ready to play.`,
    endStory: `With this structure, we come to the end of our development. You
      can access the resources, I researched about Svelte below. Forgive me if I
      made any mistakes.. send me an e-mail to kahilkubilay@gmail.com, so we can
      fix it together. Hope to see you on the resource where I can do better
      development on <code><i>Svelte</i></code>, be nice to yourself 🍷`,
    image: `assets/end-story-User-select.png`,
    moreImage: `assets/end-story-playground.png`,
    alternativeText: `user component at the end of the story`,
    moreAlternativeText: `playground component at the end of the story`,
    id: "user-detail-component",
  };

  const code = `
    <script>
      import { level } from "../../Store/Level";
    <\/script>

    <p>level: {$level}</p>

    <style>
      p {
        display: inline-block;
        width: 35%;
        border-radius: 10px;
        padding: 6px 8px;
        font-size: 18px;
        border: 2px solid black;
        background-color: purple;
        color: white;
        font-weight: bold;
      }
    </style>
  `;

  const moreCode = `
    <script>
      import { score } from "../../Store/Score";
    <\/script>

    <p>score: {$score}</p>

    <style>
      p {
        display: inline-block;
        width: 35%;
        border-radius: 10px;
        padding: 6px 8px;
        font-size: 18px;
        border: 2px solid black;
        background-color: purple;
        color: white;
        font-weight: bold;
      }
    </style>
  `;

  const otherCode = `
    <script>
      import { userInfo } from "../../../store/User";

      const { name } = userInfo;
    <\/script>

    <h3>{$name}</h3>

    <style>
      h3 {
        display: block;
        margin: 0px auto;
        border-radius: 10px;
        padding: 2px 0;
        font-size: 24px;
      }
    </style>
  `;

  const anotherCode = `
    <script>
      import { userInfo } from "../../../Store/User";

      const { avatar } = userInfo;
      const setAvatar = \`/asset/images/\${$avatar}.jpg\`;
    <\/script>


    <img src={setAvatar} title="user selected avatar" />

    <style>
      img {
        width: 100px;
        border-radius: 100px;
      }
    </style>`;

  const anotherOneCode = `
    <script>
      import Score from "../GameElements/Score.svelte";
      import Level from "../GameElements/Level.svelte";
      import UserSelectAvatar from "./Avatars/UserSelectAvatar.svelte";
      import UserSelectName from "./Name/UserSelectName.svelte";
    <\/script>

    <main>
      <UserSelectAvatar />
      <UserSelectName />
      <Score />
      <Level />
    </main>

    <style>
      main {
        width: 300px;
        margin-top: 20px;
        margin: 20px auto;
        padding: 20px 10px;
        background-color: #f5f5f5;
        border-radius: 6px;
        display: block;
      }
    </style>
  `;

  const title = `components > GameElements > Level.svelte`;
  const moreTitle = `components > GameElements > Score.svelte`;
  const otherTitle = `components > User > name > UserSelectName.svelte`;
  const anotherTitle = `components > User > Avatar > UserSelectAvatar.svelte`;
  const anotherOneTitle = `components > User > Userdetail.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax code={moreCode} title={moreTitle} />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Paragraph text={article.codeExplanation} />
  <CodeSyntax code={anotherCode} title={anotherTitle} />
  <Paragraph text={article.anotherDescription} />
  <CodeSyntax code={anotherOneCode} title={anotherOneTitle} />
  <Paragraph text={article.oneMoreDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Image
    image={article.moreImage}
    alternativeText={article.moreAlternativeText}
  />
  <Paragraph text={article.endStory} />
</article>
