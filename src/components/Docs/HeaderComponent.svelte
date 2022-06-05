<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Header Component`,
    description: `Root folder üzerinde _Header.svelte_ isminde bir Component 
      oluşturuyorum. Önceki örneklerde gerçekleştirdiğimiz gibi, _Header.svelte_
      Componentini _Userground.svelte_ componenti üzerinde çağıralım. 
      Oluşturduğumuz _Header.svelte_ componentinin basit bir görevi bulunuyor, 
      statik bir metin bardındırmak..`,
    otherDescription: `Süper iğrenç gözüküyor, öyle değil mi? İyi ki CSS var..`,
    anotherDescription: `Ehh... şimdi biraz daha az kötü gözüktüğü 
      söylenebilir💩💩💩`,
    image: `assets/components/User/header-component.png`,
    alternativeText: `call header component`,
    id: "header-component",
  };

  const code = `
    <script><\/script>

    <div class="header">
      <h2>select your best pokemon and start catching!</h2>
    </div>

    <style>
      .header {
        padding: 5px 0;
        margin-bottom: 15px;
        border-bottom: 3px solid white;
      }
    </style>
  `;

  const otherCode = `
    <script>
      import Header from "./Header.svelte";
    <\/script>

    <main>
      <Header />
    </main>

    <style>
      main {
        background-color: #f5f5f5;
        border-radius: 5px;
        padding-bottom: 15px;
      }
    </style>
  `;

  const moreCode = `
    <script>
      import Userground from "../../User/Userground.svelte";  
    <\/script>

    <main class="playground">
      <Userground />
    </main>

    <style>
      .playground {
        width: 900px;
        margin: 0 auto;
        text-align: center;
      }
    </style>
  `; // 💩

  const title = `User > Header.svelte`;
  const otherTitle = `User > UserGround.svelte`;
  const moreTitle = `Playground > Wrapper > Playground.svelte`; // 💩
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <CodeSyntax {code} {title} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax code={moreCode} title={moreTitle} />
  <Paragraph text={article.anotherDescription} />
</article>
