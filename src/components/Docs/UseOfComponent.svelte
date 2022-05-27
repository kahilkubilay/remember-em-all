<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Component kullanımı`,
    description: `Uygulamalarımızda yer alan bileşenleri parçalayarak 
      istediğimiz gibi bir bütün haline getirebilmek üzerinde çalışırken 
      kolaylık sağlar, tekrar eden bileşen parçalarında yeniden çağırabilmek 
      daha az efor sarfettirir.`,
    otherDescription: `Bir önceki örnekte yaptığımız random sayı üreten basit 
      yapıyı bir component haline getirelim. 'components/Content/'' dizininde 
      'RandomNumber.svelte' dosyasını oluşturalım. Bu yeni componentimizi 
      'App.svelte' dosyasında kullanalım.`,
    anotherDescription: `'RandomNumber' componentini istediğimiz gibi çağırarak
      kullanmaya başlayabiliriz..`,
    image: `assets/components/component-with-sabuha.png`,
    anotherImage: `assets/components/random-number-component.gif`,
    alternativeText: `use of components`,
    anotherAlternativeText: `Random Number Component`,
    id: "use-of-component",
  };

  const code = `
    <script>
      let number = 0;
  
      const randomNumber = () => {
        number = Math.round(Math.random() \* 15);
      };
    <\/script>

    <div class="random-number-capsule">
      <h3>{number}</h3>
      <button on:click={randomNumber}>Update Number</button>
    </div>

    <style>
      .random-number-capsule {
        border-radius: 5px;
        background-color: yellowgreen;
        padding: 5px;
        margin: 10px 50px;
      }
      
      h3 {
        background-color: orangered;
        width: 100px;
        color: white;
      } 
      
      button {
        border: 1px solid black;
        cursor: pointer;
      } 
      
      h3,
      button {
        display: block;
        text-align: center;
        margin: 25px auto;
        padding: 5px;
      }
    </style>
  `;

  const otherCode = `
    <script>
      import RandomNumber from "./components/Content/RandomNumber/RandomNumber.svelte";
    <\/script>

    <main>
      <RandomNumber />
      <RandomNumber />
      <RandomNumber />
      <RandomNumber />
    </main>

    <style></style>
  `;

  const title = `Components > Content > RandomNumber.svelte`;
  const otherTitle = `_App.svelte_`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.anotherDescription} />
  <CodeSyntax code={otherCode} title={otherTitle} />
  <Image
    image={article.anotherImage}
    alternativeText={article.anotherAlternativeText}
  />
</article>
