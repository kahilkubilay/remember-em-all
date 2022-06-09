<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `User Component`,
    description: `Yarım kalmış bir User Component'imiz bulunuyordu. 
      Tanımladığımız <code><i>Store</i></code> değerlerini <code><i>User 
      componenti</code></i> değerlerinde kullanalım. Burada yapacağımız son
      rötüşlar ile birlikte kullanıcının oyun arayüzüne erişmesini sağlayalım.`,
    otherDescription: `<code><i>ImageAvatar.svelte component</i></code> 
      üzerinde, kullanıcı avatar'a click eventini gerçekleştirdiğinde, 
      <code><i>userInfo classinda</i></code> oluşturduğumuz avatar değerini 
      güncelleyelim.`,
    anotherDescription: `Bu güncelleme ile birlikte kullanıcının seçtiği ve 
      mouse ile üzerinde gezindiği avatarların 'opacity' değeri değişerek avatar
      resmi vurgulanacak.`,
    anAnotherDescription: `Import ettiğimiz <code><i>UserInfo 
      class'inda</i></code> yer alan <code><i>$name store</i></code> değerini, 
      'bind:value' metodu ile güncelleyebiliriz.`, // 💩
    moreAnotherDescription: `Şimdi en güzel tarafına gelelim.. Son rötüşları 
      yapıp oyunu başlatalım. 
      <code><i>components > Playground > Wrapper > Playground.svelte</i></code>
      componenti üzerinde bir <code><i>if/else</i></code> yapısı tanımlayalım.
      <code><i>isStart store</i></code> değerimiz false ise kullanıcıyı 
      <code><i>name&avatar</i></code> seçimi yapabildiği 
      <code><i>Componente</i></code> yönlendirsin. Bunun aksi ise basit bir hata
      bilgisi gösterelim.`, // 💩
    moreDescription: `Döngüler gibi <code><i>if/else Logic'leri</i></code> 
      kullanabilirsiniz. <code><i>else if</i></code> ihtiyacında bir şart 
      ifadesi olarak <code><i>else if isStart === undefined</i></code>
      tanımlaman yeterli olacaktır.`,
    descriptionCode: `<code><i>StartGame fonksiyonu</i></code> ile birlikte 
      <code><i>name ve avatar store</i></code> değerleri kontrol edilecek. Bu
      değerlerin boş olmaması durumunda <code><i>isStart store</i></code>
      değerine <code><i>true</i></code> atanarak, oyun başlatılacak konsola bir
      bilgi yazılacak. Bu değerlerden herhangi biri bulunmuyorsa 
      <code><i>User componenti</i></code> bulunduğu yerde kalmaya devam
      edicektir. Böyle bir ihtimal için, <code><i>class directives</i></code>
      kullanarak kullanıcıyı bilgilendirelim.`,
    codeExplanation: `on:click metoduna bağladığımız fonksiyon ile kullanıcının 
      tıkladığı avatar üzerinde bilgiyi kolay bir şekilde elde edebiliyoruz. 
      Konsolu açarak, logları inceleyebilirsin.<code><i>ImageAvatar componentine
      </i></code> parametre olarak gönderdiğimiz avatar bilgisine
      erişebiliyoruz, bunu kullanarak fonksiyonu biraz daha basit hale 
      getirelim.`,
    otherCodeExplanation: `Kullanıcı avatarlar üzerine her click işlemi 
      gerçekleştirdiğinde, <code><i>$avatar</i></code> değerini güncelliyoruz. 
      <code><i>ImageAvatar.svelte componentini</i></code> geçmeden önce 
      <code><i>class directives</i></code> kullanarak yıllaar yılllaarr önce
      tanımladığımız <code><i>.picked ve .unpicked</i></code> classlarını 
      anlamlı bir hale getirelim.`,
    oneLineDescription: `Kullanıcıdan almamız gereken diğer bir değer, 
      <code><i>username</i></code>.`,
    endStory: `<code><i>Class Directive'lerde</i></code> yardımına başvurabilmek
      için <code><i>isAvatarEmpty ve isNameEmpty</i></code> isminde iki farklı
      değer oluşturdum. <code><i>Button'ın</i></code> altında bir 
      <code><i>div etiketi</i></code> daha oluşturarak, hata mesajını burada
      gösteriyorum. <code><i>Name</i></code> için olan hata mesajını sen
      düzenle.. Ve oluşturduğum <code><i>div etiketini</i></code> bir component
      olarak yeniden oluşturup, hem <code><i>name</i></code> hemde 
      <code><i>avatar</i></code> için kullanabilirsin. Bunu gerçekleştir, hemen
      ardından bir sonraki başlıkta seni bekliyorum.`,
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
  const otherTitle = `componenets > User > Avatars > ImageAvatar.svelte`;
  const anotherOneMoreTitle = `componenets > User > Avatars > 
    ImageAvatar.svelte`; //💩
  const moreTitle = `componenets > Playground > Wrapper > Playground.svelte`; //💩
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.codeExplanation} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Paragraph text={article.otherCodeExplanation} />
  <CodeSyntax code={oneMoreCode} />
  <Paragraph text={article.anotherDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.oneLineDescription} />
  <CodeSyntax code={anotherOneMoreCode} title={anotherOneMoreTitle} />
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
  <CodeSyntax code={endCode} />
  <Paragraph text={article.endStory} />
</article>
