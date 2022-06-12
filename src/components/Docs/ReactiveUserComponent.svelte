<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `User Component`,
    description: `We had an unfinished <code><i>User component</i></code>. We
      are going to use the <code><i>Store</i></code> values we defined in the
      <code><i>User component</i></code> values. Let's give the user access to
      the game interface with the finishing touches we will do here. On the
      <code><i>ImageAvatar.svelte component</i></code>, when the user clicks the
      avatar, let's update the avatar value we created in the <code><i>userInfo
      class</i></code>.`,
    otherDescription: `On the <code><i>ImageAvatar.svelte component</i></code>,
      when the user clicks the avatar, let's update the avatar value we created
      in the <code><i>userInfo class</i></code>.`,
    anotherDescription: `With this update, the <b>opacity</b> value of the
      avatars selected by the user and hovered over with the mouse will be
      changed and the avatar image will be highlighted.`,
    anAnotherDescription: `We can update the <b>$name</b> store value in the
      <code><i>UserInfo class</i></code> we imported with the <b>bind:value
      method</b>.`, // 💩
    moreAnotherDescription: `Now let's get to the best part. Let's put the
      finishing touches and start the game. Let's define an <b>if/else
      structure</b> on the <code><i>components > Playground > Wrapper >
      Playground.svelte</i></code> component. If our <b>isStart store value is
      false</b>, it will direct the user to the component where they can
      choose <b>name&avatar</b>. Otherwise, let's show a simple error text.`, // 💩
    moreDescription: `You can use if/else logics like loops. When you need else
      if, it will suffice to define else if, <code><i>isStart ===
      undefined</i></code> as a condition statement..`,
    descriptionCode: `With the StartGame function, name and avatar store values
      will be checked. If these values are not empty, the <b>isStart</b> store
      value will be set to <b>true</b> and an information will be written to the
      console where the game will be started. If any of these values are not
      found, the <code><i>User component</i></code> will remain where it is. For
      such a possibility, let's inform the user using <code><i>class
      directives</i></code>.`,
    codeExplanation: `With the function we connect to the <code><i>on:click
      method</i></code>, we can easily obtain information on the avatar that
      the user clicks. By opening the console, you can examine the logs. We can
      access the avatar information that we send as a parameter to the
      <code><i>ImageAvatar component</i></code>, here we make the function a
      little simpler by using it.`,
    otherCodeExplanation: `Every time the user clicks on the avatars, we update
      the <code><i>$avatar</i></code> value. Before moving on to the
      <code><i>ImageAvatar.svelte component</i></code>, let's make the
      <b>.picked and .unpicked</b> classes that we defined many years ago
      meaningful by using <code><i>class directives</i></code>.`,
    oneLineDescription: `Another value we need to get from the user is
      <b>username</b>.`,
    endStory: `In order to get help from the <code><i>Class
      Directive</i></code>, we created two different values named
      <b>isAvatarEmpty and isNameEmpty</b>. By creating another <b>div</b> tag
      below the <b>Button</b>, we show the error message here. Edit the error
      message for <b>name</b>.. And you can recreate the <b>div</b> tag we
      created as a component and use it for both <b>name and avatar</b>. Make it
      happen, then let's continue in the next section.`,
    image: `assets/components/User/class-directive.gif`,
    anotherImage: `assets/components/User/start-game.gif`,
    alternativeText: `Class Directives`,
    anotherAlternativeText: `Class Directives`,
    id: "reactive-user-component",
  };

  const code = `
    <script>
      import { userInfo } from "../../../Store/User";

      const { avatar } = userInfo;

      export let userAvatar;

      const setAvatar = () => {
        console.log("focus on avatar => ", userAvatar);

        $avatar = userAvatar;

        console.log($avatar);
      };
    <\/script>

    <img
      src={userAvatar}
      class="avatar unpicked"
      alt="avatar"
      on:click={setAvatar}
    />
  `;

  const otherCode = `
    <script>
      import { userInfo } from "../../../Store/User";
  
      const { avatar } = userInfo;
  
      export let userAvatar;
  
      const avatarName = userAvatar.match(/\w*(?=.\w+$)/)[0];
    <\/script>

    <img
      src={userAvatar}
      class="avatar unpicked"
      alt="avatar"
      on:click={() => ($avatar = avatarName)}
    />
  `;

  const oneMoreCode = `
    <img
      src={userAvatar}
      class="avatar unpicked"
      alt="avatar"
      class:picked={avatarName === $avatar}
      on:click={() => ($avatar = avatarName)}
      />
  `;

  const anotherOneMoreCode = `
    <script>
      import { userInfo } from "../../../Store/User";

      const { name } = userInfo;
    <\/script>

    <div class="user">
      <input
        type="text"
        class="name"
        name="name"
        placeholder="pika pika"
        bind:value={$name}
      />
    </div>
  `;

  const moreCode = `
    <script>
      import UserGround from "../../User/UserGround.svelte";
      import { userInfo } from "../../../Store/User";
  
      const { isStart } = userInfo;
    <\/script>

    <main class="playground">
      {#if $isStart}
        <h3>Start Game....</h3>
      {#else}
        <UserGround />
      {/if}
    </main>
  `;

  const anotherAnOneMoreCode = `
    <script>
      import { userInfo } from "../../Store/User";
      
      const { name, avatar, isStart } = userInfo;

      const startGame = () => {
        if ($avatar === "") {
          return;
        }

        if ($name === "") {
          return;
        }

        $isStart = true;

        console.log("::::: start game :::::");
        console.log(":: enjoy {$name} ::");
      };
    <\/script>

    <div class="start">
      <button on:click={startGame}>Start</button>
    </div>
  `;

  const endCode = `
    <script>
      import { userInfo } from "../../Store/User";
      
      const { name, avatar, isStart } = userInfo;

      let isAvatarEmpty = false;
      let isNameEmpty = false;

      const startGame = () => {
        if ($avatar === "") {
          isAvatarEmpty = true;
          return;
        }

        if ($name === "") {
          return;
        }

        $isStart = true;

        console.log("::::: start game :::::");
        console.log(":: enjoy {$name} ::");
      };
    <\/script>

    <div class="start">
      <button on:click={startGame}>Start</button>
      <div class="avatarError visible">
        <span class="unvisible" class:visible={$avatar === "" && isAvatarEmpty}>
          please, select a avatar..
        </span>
      </div>
    </div>
    
    <style>
      .name {
        width: 40%;
        border-radius: 20px;
        text-align: center;
        margin-bottom: 30px;
        padding: 8px 0;
      }

      .avatarError {
        color: red;
        font-size: 18px;
      }

      .unvisible {
        display: none;
      }

      .visible {
        display: block;
      }

      .start button:active {
        border: 2px solid white;
      }
    </style>
  `;

  const title = `componenets > User > Avatars > ImageAvatar.svelte`;
  const moreTitle = `componenets > Playground > Wrapper > Playground.svelte`;
  const otherTitle = `components > User > name > UserName.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.codeExplanation} />
  <CodeSyntax code={otherCode} {title} />
  <Paragraph text={article.otherCodeExplanation} />
  <CodeSyntax code={oneMoreCode} {title} />
  <Paragraph text={article.anotherDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.oneLineDescription} />
  <CodeSyntax code={anotherOneMoreCode} title={otherTitle} />
  <Paragraph text={article.anAnotherDescription} />
  <Paragraph text={article.moreAnotherDescription} />
  <CodeSyntax code={moreCode} title={moreTitle} />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={anotherAnOneMoreCode} title={moreTitle} />
  <Image
    image={article.anotherImage}
    alternativeText={article.alternativeText}
  />
  <Paragraph text={article.descriptionCode} />
  <CodeSyntax code={endCode} title={moreTitle} />
  <Paragraph text={article.endStory} />
</article>
