<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Variable erişimi`,
    description: `<code><i>Script</i></code> üzerinde tanımlanan değerleri 
      <code><i>html</i></code> içerisinde çağırabilmek için <code><i>{}</i>
      </code> kullanılmalıdır. Bu template ile değer tipi farketmeksizin 
      değişkenleri çağırarak işlemler gerçekleştirebilirsin.`,
    otherDescription: `Bu tanımlama ile birlikte <code><i>user</i></code>
      değerine tanımlanan her değeri dinamik olarak <code><i>html</i></code>
      içerisinde çağırabilirsin. <code><i>user</i></code> tanımlaması 
      <code><i>sabuha</i></code> değerine eşit olduğu durumlarda 'seni izliyor!'
      yerine 'bir kedi gördüm sanki!' değerini ekrana getirelim.`,
    anotherDescription: `<code><i>html</i></code> içerisinde kullandığımız 
      <code><i>{}</i></code> tagları arasında condition yapıları gibi döngü,
      fonksiyon çağırma işlemleri gerçekleştirebilirsin. Bu yapılara sahip 
      birçok işlemi birlikte gerçekleştireceğiz.`,
    id: "variable-access",
  };

  const code = `
    <script>
      const user = "sabuha";
    <\/script>

    <span>{user} seni izliyor!</span>
    
    <style>
      span {
        color: rebeccapurple;
      }  
    </style>`;

  const otherCode = `
    <script>
      const user = "sabuha";  
    <\/script>

    <span>{user === "sabuha" ? "bir kedi gördüm sanki!" : "seni izliyor!"}</span>

    <style></style>
  `;

  const title = "app.svelte";
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax code={otherCode} {title} />
  <Paragraph text={article.anotherDescription} />
</article>
