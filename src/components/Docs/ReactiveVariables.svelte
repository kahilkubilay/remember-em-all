<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Reaktif değişkenler`,
    description: `Değişkenlik gösterebilecek dinamik verilerin güncellendiğinde,
      DOM üzerinde yer alan referansı benzer olarak güncellenir.`,
    otherDescription: `Tanımladığımız <code><i>numb</i></code> değeri her 
      güncellendiğinde, DOM üzerinde bu değer yeniden ve sıkılmadan 
      güncellenmeye devam edecektir.`,
    image: `assets/documentation/reactive.gif`,
    alternativeText: `definition of reactive variable in Svelte`,
    id: "reactive-variables",
  };

  const code = `
    <script>
      let number = 0;
  
      const randomNumber = () => {
        number = Math.round(Math.random() \* 15);
      };
    <\/script>

    <main>
      <h3>{number}</h3>
      <button on:click={randomNumber}>Update Number</button>
    </main>

    <style>
      main {
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
      
      h3,button {
        display: block;
        text-align: center;
        margin: 25px auto;
        padding: 5px;
      }
    </style>
  `;

  const title = `app.svelte`;
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.otherDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
</article>
