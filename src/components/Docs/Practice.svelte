<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Biraz pratik`,
    description: `Birkaç örnek yaparak <code><i>Svelte'i</i></code> anlamaya,
      yorumlamaya çalışalım. Kod örnekleri oyun üzerinde sıkça kullanacağımız
      yapılar için bir temel oluşturacak.`,
    otherDescription: `<code><i>App.svelte</i></code> dosyasında <code><i>name
      </i></code> isminde bir değişken tanımlanmış. <code><i>Typescript</i>
      </code> notasyonu baz alındığı için değer tipi olarak <code><i>string</i>
      </code> verilmiş. Bu notasyon ile anlatım biraz daha uzun olabileceği 
      için kullanmamayı tercih edicem. Github üzerinde bulunan kodlar 
      inceliyorsan, burada birlikte oluşturacaklarımız farklılık gösterebilir.`,
    id: "practice",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
</article>
