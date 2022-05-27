<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `User Component`,
    description: `Yarım kalmış bir User Component'imiz bulunuyordu. 
      Tanımladığımız _Store_ değerlerini User componenti değerlerinde 
      kullanalım. Burada yapacağımız son rötüşlar ile birlikte kullanıcının oyun
      arayüzüne erişmesini sağlayalım.`,
    otherDescription: `_ImageAvatar.svelte_ componenti üzerinde, kullanıcı 
      avatar'a click eventini gerçekleştirdiğinde, 'userInfo' classinda 
      oluşturduğumuz avatar değerini güncelleyelim.`,
    anotherDescription: `Bu güncelleme ile birlikte kullanıcının her avatar 
      seçiminden sonra, seçilen avatarın 'opacity' değeri güncellenerek 
      kullanıcının seçimi vurgulanacak.`,
    anAnotherDescription: `Import ettiğimiz UserInfo class'inda yer alan $name 
      store değerini, 'bind:value' metodu ile güncelleyebiliriz.`, // 💩
    moreAnotherDescription: `Şimdi en güzel tarafına gelelim.. Son rötüşları 
      yapıp oyunumuza başlayalım. 
      'components > Playground > Wrapper > Playground.svelte' componenti 
      üzerinde bir if/else yapısı tanımlayalım. 'isStart' store değerimiz false
      ise kullanıcıyı _name&avatar_ seçimi yapabildiği Componente yönlendirsin.
      Bunun aksi ise basit bir head etiketini gösterelim.`, // 💩
    moreDescription: `Döngüler gibi if/else Logic'leri kullanabilirsiniz. 'else
    if' ihtiyacında bir şart ifadesi olarak 'else if isStart === undefined' 
    tanımlaman yeterli olacaktır.`,
    descriptionCode: `StartGame fonksiyonu ile birlikte _name_ ve _avatar_ store
      değerleri kontrol edilecek. Bu değerlerin boş olmaması durumunda _isStart_
      store değerine true atanarak, oyun başlatılacak konsola bir bilgi 
      yazılacak. Bu değerlerden herhangi biri bulunmuyorsa _User_ componenti 
      bulunduğu yerde kalmaya devam edicektir. Böyle bir ihtimal için, class 
      directives kullanarak kullanıcıyı bilgilendirelim.`,
    codeExplanation: `on:click metoduna bağladığımız fonksiyon ile kullanıcının 
      tıkladığı avatar üzerinde bilgiyi kolay bir şekilde elde edebiliyoruz. 
      Konsolu açarak, logları inceleyebilirsin.'ImageAvatar' componentine 
      parametre olarak gönderdiğimiz avatar bilgisine erişebiliyoruz, bunu 
      kullanarak fonksiyonu biraz daha basit hale getirelim.`,
    otherCodeExplanation: `Kullanıcı avatarlar üzerine her click işlemi 
      gerçekleştirdiğinde, '$avatar' değerini güncelliyoruz. 
      'ImageAvatar.svelte' componentini geçmeden önce _class directives_ 
      kullanarak yıllaar yılllaarr önce tanımladığımız '.picked' ve ''.unpicked'
      classlarını anlamlı bir hale getirelim.`,
    oneLineDescription: `Kullanıcıdan almamız gereken diğer bir değer, 
      username.`,
    endStory: `Class Directive'lerde yardımına başvurabilmek için
      _isAvatarEmpty_ ve _isNameEmpty_ isminde iki farklı değer oluşturdum. 
      Button'ın altında bir 'div' etiketi daha oluşturarak, hata mesajını burada
      gösteriyorum. Name için olan hata mesajını sen düzenle.. Ve oluşturduğum 
      'div' etiketini bir component olarak yeniden oluşturup, hem name hemde 
      avatar için kullanabilirsin. Bunu yap, hemen ardından bir sonraki başlıkta
      seni bekliyorum.`,
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
  const oneMoreTitle = `_no title_`;
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
  <CodeSyntax code={oneMoreCode} title={oneMoreTitle} />
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
  <CodeSyntax code={endCode} title={oneMoreTitle} />
  <Paragraph text={article.endStory} />
</article>
