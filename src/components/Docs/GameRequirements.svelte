<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Game Requirements`,
    description: `In addition to the user's values such as name and avatar,
      there can be standard values for the game. For the game we are developing,
      we will define two values named <code><i>level and score</i></code> from
      these values. When the user clicks the <b>Start button</b> after selecting
      the name and avatar, <b>level</b> will contain the value 1 and
      <b>score</b> 0. We will update the <b>score</b> value as the user matches
      the correct cards and the <b>level</b> value when all cards are matched.`,
    anotherDescription: `We have created a value called <b>level</b> and we will
      use it in our app for the good of the planet. This value will be updated
      when the user can match all the cards on the interface. You can create and
      update <code><i>Store</i></code> values with the <code><i>writable
      interface</i></code> to create a <code><i>Store</i></code> value.`,
    moreDescription: `Let's define the <code><i>score</i></code> value that the
      user can earn points after each match.`, //💩
    anotherMoreDescription: `As you can define these values in different files,
      you can also define the score&level values in a single file. You can use
      <code><i>name & avatar & score & level</i></code> values together by
      creating a user.`, //💩
    anotherOneMoreDescription: `Create a new class where we will keep the static
      information of the user.`, //💩
    otherDescription: `You can update <b>Store</b> values with more than one
      structure on <code><i>Svelte</i></code>. Although you follow a path such
      as <code><i>$level = 1</i></code>, you can perform the update process with
      the <code><i>set method</code></i>, similar to the illustration in the
      example below.`,
    endStory: `We will set the user's name and avatar values to the
      <code><i>UserInfo class</i></code> we have created. I have assigned
      <b>empty String</b> to these values by default, you can fill them with
      different content. If the name and avatar values are not incorrect, we
      will start the game by updating the <code><i>isStart</i></code> value to
      <b>true</b>.`,
    id: "game-requirements",
  };

  const code = `
    <script>
      import { Writable, writable } from "svelte/store";
      
      export const level:Writable<number> = writable(1);
    <\/script>
  `;

  const otherCode = `
    <script>
      import { Writable, writable } from "svelte/store";
  
      export class UserInfo {
        constructor (
          public name: Writable<string> = writable(''),
          public avatar: Writable<string> = writable(''),
          public isStart: Writable<boolean> = writable(false)
      ){}
  
      export const userInfo = new UserInfo();
    <\/script>
  `;

  const moreCode = `
    <script>
      import { Writable, writable } from "svelte/store";

      export const score:Writable<number> = writable(0);
    <\/script>
  `;

  const anotherCode = `
    <script context="module">
      import { score } from "../../store/Score";

      export const scoreUp = () => {
        let getScore;

        score.subscribe((callScore) => {
          getScore = callScore;
        });

        let up = getScore + 1;

        score.set(up);
      };
    <\/script>
  `;

  const title = `Store > Level.ts`;
  const otherTitle = `Store > Score.ts`;
  const moreTitle = `Store > User.ts`;
  const anotherTitle = `Store güncelleme`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.anotherDescription} />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={moreCode} title={otherTitle} />
  <Paragraph text={article.anotherMoreDescription} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax code={anotherCode} title={anotherTitle} />
  <Paragraph text={article.anotherOneMoreDescription} />
  <CodeSyntax code={otherCode} title={moreTitle} />
  <Paragraph text={article.endStory} />
</article>
