<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Avatar Component`,
    description: `Avatar bileşeni içerisinde birden fazla bileşene ihtiyaç 
      duyacağımız için, bir klasör oluşturarak bütün gereksinim duyduğu 
      bileşenleri klasör içerisinde tanımlayalım. 
      <a href="https://github.com/kahilkubilay/remember-em-all/tree/master/public/images">
      Bileşenlerde kullanacağımız görsellere buradan erişebilirsin.</a>`,
    otherDescription: `<code><i>Avatars.svelte Userground.svelte</i></code>
      içerisinde çağıralım. <code><i>Avatars.svelte, ImageAvatar.svelte</i>
      </code> bileşenine bir kapsayıcı görevi görecek. Bununla birlikte 
      <code><i>ImageAvatar.svelte</i></code> componentine data gönderecek.`,
    anotherDescription: `<code><i>Avatars, Userground</i></code> üzerinde 
      çağırdığımda karşıma bu iki güzellik gelecek.`,
    moreDescription: `<code><i>Avatars</i></code> bileşenini daha işlevli bir 
      yapıya dönüştürelim.`, //💩
    oneMoreDescription: `Oluşturduğumuz 'avatars' dizisine ait her elemana 
      <code><i>html</i></code> üzerinde #each döngüsünde erişiyoruz. Erişilen 
      her elemanının bilgisini <code><i>ImageAvatar</i></code> componentine
      aktarıyoruz. Componente aktarılan bu değerlerle birlikte, dizi içerisinde
      bulunan her elamanın görüntüsünü elde edeceğiz.`, //💩
    oneAnotherMoreDescription: `Daha güzel bir görüntüyü hak ettik. Avatarlar 
      üzerinde CSS ile biraz düzenlemeler yapmamız gerekti.`, //💩
    codeExplanation: `Kullanacağın görselleri uzak sunucu üzerinden almıyorsan
      <code><i>public</i></code> klasörü altında barındırabilirsin. Kullanmak
      istediğinde public klasörünü dahil etmeden 
      <code><i>images/image-name.png</i></code> gibi bir yol ile 
      kullanabilirsin.`,
    image: `assets/components/User/avatars-component.png`,
    anotherImage: `assets/components/User/user-component-end.png`,
    alternativeText: `call Avatar Component`,
    anotherAlternativeText: `call User Component`,
    id: "avatar-component",
  };

  const code = `
    <script>
      // avatar list
      let sabuha = "images/sabuha.jpg";
      let pasa = "images/pasa.jpg";  
    <\/script>

    <div class="avatars">
      <img src={sabuha} alt="" />
      <img src={pasa} alt="" />
    </div>

    <style>
      img {
        width: 100px;
      }
    </style>
  `;

  const otherCode = `
    <script>
      ...
      // avatar list
      let sabuha = "images/sabuha.jpg";
      let mohito = "images/mohito.jpg";
      let pasa = "images/pasa.jpg";
      let susi = "images/susi.jpg";
      let limon = "images/limon.jpg";

      const avatars = [pasa, mohito, sabuha, limon, susi];
    <\/script>

    <div class="avatars">
      {#each avatars as userAvatar}
        <ImageAvatar {userAvatar} />
      {/each}
    </div>

    <style>
      .avatars {
        display: flex;
        justify-content: center;
      }
    </style>
  `;

  const moreCode = `
    <script>
      export let userAvatar;
    <\/script>

    <img src={avatar} class="avatar unpicked" alt="avatar" />

    <style>
      .avatar {
        width: 100px;
        border-radius: 100px;
        justify-content: space-around;
        margin: 0 25px 15px 0;
        border: 2px solid #fff;
        box-shadow: 0px 0px 3px black;
        border: 2px solid whitesmoke;
      }
  
      .avatar:hover {
        opacity: 1;
        cursor: pointer;
      }
      
      .unpicked {
        opacity: 0.8;
      }
      
      .picked {
        opacity: 1;
      }
    </style>
  `; // 💩

  const title = `User > Avatar > Avatars.svelte`;
  const otherTitle = `User > Avatar > Avatars.svelte`;
  const moreTitle = `User > Avatar > ImageAvatar.svelte`; // 💩
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.codeExplanation} />
  <Paragraph text={article.anotherDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Paragraph text={article.oneMoreDescription} />
  <CodeSyntax code={moreCode} title={moreTitle} />
  <Paragraph text={article.oneAnotherMoreDescription} />
  <Image
    image={article.anotherImage}
    alternativeText={article.anotherAlternativeText}
  />
</article>
