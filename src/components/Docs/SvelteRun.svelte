<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Svelte nasıl çalışır?`,
    description: `Svelte bileşenleri <code><i>.svelte</i></code> uzantılı 
      dosyalar ile oluşturulur. HTML'e benzer olarak <code><i>script, style,
      html</i></code> kod yapılarını oluşturabilirdiğiniz üç farklı bölüm 
      bulunuyor.`,
    otherDescription: `Svelte dosyaları derlenerek, pure 
      <code><i>Javascript</i></code> kodlarına dönüştürülür. Svelte derleme 
      işlemini runtime üzerinde gerçekleştiriyor. Bu derleme işlemiyle birlikte 
      Virtual DOM bağımlılığını ortadan kalkıyor.`,
    anotherDescription: `Virtual DOM nedir, bu bağımlılığın kalkması ne anlama
      geliyor?`,
    image: `assets/documentation/build-map.png`,
    alternativeText: `Svelte build file`,
    id: "how-svelte-works",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.anotherDescription} />
</article>
