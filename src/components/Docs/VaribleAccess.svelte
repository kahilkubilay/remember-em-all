<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Variable erişimi`,
    description: `Script üzerinde tanımlanan değerleri html içerisinde 
      çağırabilmek için {} kullanılmalıdır. Bu template ile değer tipi 
      farketmeksizin değişkenleri çağırarak işlemler gerçekleştirilebilir.`,
    otherDescription: `Bu tanımlama ile birlikte _user_ değerine tanımlanan her 
      değeri dinamik olarak _html_ içerisinde çağırabilirsin. biraz daha biraz 
      daha karıştıralım.. _user_ tanımlaması _sabuha_ değerine eşit olduğu 
      durumlarda 'seni izliyor!' yerine 'bir kedi gördüm sanki!' değerini ekrana
      getirelim.`,
    anotherDescription: `_html_ içerisinde kullandığımız {} tagları arasında 
      condition yapıları gibi döngü, fonksiyon çağırma işlemleri 
      gerçekleştirebilirsin. Bu yapılara sahip birçok işlemi birlikte 
      gerçekleştireceğiz.`,
    id: "hello-team",
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

  const title = "_app.svelte_";
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
