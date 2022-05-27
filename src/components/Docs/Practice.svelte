<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Biraz pratik`,
    description: `Birkaç örnek yaparak Svelte'i anlamaya, yorumlamaya çalışalım.
      Kod örnekleri oyun üzerinde sıkça kullanacağımız yapılar için bir temel 
      oluşturacak.`,
    otherDescription: `_App.svelte_ dosyasında _name_ isminde bir değişken 
      tanımlanmış. Typescript notasyonu baz alındığı için değer tipi olarak 
      _string_ verilmiş. Bu notasyon ile anlatım biraz daha uzun olabileceği 
      için kullanmamayı tercih edicem. Github üzerinde bulunan kodlar ile, 
      burada birlikte oluşturacaklarımız farklılık gösterebilir.. panik yok, 
      Typescript'e [hakim olabileceğine](https://youtube.com/shorts/oyIO1_8uNPc
      "senin kocaman kalbin <33") eminim.`,
    id: "pratice",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
</article>
