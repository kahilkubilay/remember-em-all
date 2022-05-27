<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";
  import Matter from "./Section/Templates/Matter.svelte";

  const article = {
    head: `Avatar Component`,
    description: `Bu Component içerisinde birden fazla bileşene ihtiyaç duyduğu
      için, bir klasör oluşturarak bütün gereksinim duyduğu yapıları klasör 
      içerisinde tanımlayalım.`,
    otherDescription: `_Avatars.svelte_ _Userground.svelte_ içerisinde 
      çağıralım. _Avatars.svelte_, _ImageAvatar.svelte_ bir kapsayıcı görevi 
      görecek. Bununla birlikte _ImageAvatar.svelte_ componentine data 
      gönderecek.`,
    anotherDescription: `_Avatars_, _Userground_ üzerinde çağırdığımda karşıma 
      bu iki güzellik gelecek.`,
    moreDescription: `_Avatars_ biraz daha işlevli bir yapıya dönüştürelim.`, //💩
    oneMoreDescription: `Oluşturduğumuz 'avatars' dizisine ait her elemana 
      _html_ üzerinde #each döngüsünde erişiyoruz. Erişilen her elemanının 
      bilgisini _ImageAvatar_ componentine aktarıyoruz. Componente aktarılan bu
      değerlerle birlikte, dizi içerisinde bulunan her elamanın görüntüsünü elde
      edeceğiz.`, //💩
    oneAnotherMoreDescription: `Daha güzel bir görüntüyü hak ettik. Avatarlar 
      üzerinde CSS ile biraz düzenlemeler yapmamız gerekti.`, //💩
    material: [
      `Avatar/`,
      `+ User > Avatar > Avatars.svelte, ImageAvatar.svelte`,
      `+ public > assets > images > pasa.jpg, sabuha.jpg, mohito.jpg, limon.jpg,
        susi.jpg`,
      `[images](https://github.com/kahilkubilay/remember-em-all/tree/master/public/images "Images link")`,
    ],
    image: `assets/components/User/avatars-component.png`,
    anotherImage: `assets/components/User/user-component-end.png`,
    alternativeText: `call Avatar Component`,
    anotherAlternativeText: `call User Component`,
    id: "avatar-component",
  };

  const code = `
    <script>
      // avatar list
      let sabuha = "/asset/images/sabuha.jpg";
      let pasa = "/asset/images/pasa.jpg";  
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
      import ImageAvatar from "./ImageAvatar.svelte";

      // avatar list
        let sabuha = "/asset/images/sabuha.jpg";
        let mohito = "/asset/images/mohito.jpg";
        let pasa = "/asset/images/pasa.jpg";
        let susi = "/asset/images/susi.jpg";
        let limon = "/asset/images/limon.jpg";

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
  <Matter matter={article.material} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
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
