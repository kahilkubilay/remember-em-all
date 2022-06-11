<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `User Detail Componenti`,
    description: `Son bölümümüzde <code><i>Score & Level</i></code> ile birlikte
      oyun başlangıcında kullanıcının adını ve seçtiği avatarı oyun arayüzünde
      gösteren bir bileşen oluşturalım.`,
    requireDescription: `Components klasörümüzde GameElements isminde yeni bir 
      klasör oluşturalım. Daha önce <code><i>score ve level</i></code> 
      değerlerimizi kapsayan bir bileşen oluşturmadığımız için bu bileşenleri 
      burada oluşturacağız.`,
    otherDescription: `Bu bileşenleri oluştururken basit stil özellikleri de 
      tanımlayalım.`,
    moreDescription: `Bileşenlerde aynı kod yapısını kullandık, değişen tek şey
      import ettiğimiz store değerleriydi. Tek bir component içerisinde 
      tanımlayıp kullanmak istediğin store değerini props içerisinde 
      tanımlayarak kullanmış olduğumuz yapı ile aynı sonuca ulaşabilirsin. 
      Kullanıcının isminin görüntüleneceği bileşeni oluşturalım.`,
    codeExplanation: `Kullanıcı oluşturulurken kullandığımız
      <code><i>UserInfo sınıfına</i></code> erişerek, içerisinde tanımlanan 
      <code><i>name</i></code> değerini rica ediyorum. Bu değeri 
      <code><i>HTML</i></code> içerisinde görüntüleyelim. Bir de ... 
      kullancıının seçmiş olduğu avatarı görüntülememiz için gerekli olan bir 
      bileşene ihtiyacımız var.`,
    anotherDescription: `Oluşturduğumuz bu bileşenleri ortak bir kapsayayıcı 
      olarak UserDetail isminde bir bileşen içerisinde tutalım.`,
    oneMoreDescription: `<code><i>UserDetail</i></code> bileşenimizi 
      <code><i>Playground</i></code> üzerinde çağırdığımızda istediğimiz 
      kullanıcının bilgilerini oyun alanına ekleyebiliyoruz. Hatırlarsan dostum,
      <code><i>Card</i></code> componentinde yaptığımız geliştirmeyi 
      inceleyebilmek için, <code><i>Playgorund</i></code> içerisinde yer alan 
      <code><i>isStart</i></code> değerini <code><i>false</i></code> olarak 
      vermiştik. Bunu düzellttiğimizde oyunumuzun sonuna geliyoruz.`,
    endStory: `Bu yapı ile birlikte geliştirmemizin sonuna geliyoruz. Svelte 
      üzerinde araştırdığım kaynaklara aşağıdan erişebilirsin. Yanlış bir söz 
      etmişsem, affola.. kahilkubilay@gmail.com hesabı üzerinden erişebilirsen
      birlikte düzetebiliriz. Svelte üzerine daha iyi bir geliştirme 
      yapabildiğim kaynakta umarım görüşürüz, kendine iyi davran 🍷`,
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
