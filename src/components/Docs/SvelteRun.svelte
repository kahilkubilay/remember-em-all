<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Svelte nasıl çalışır?`,
    description: `Svelte bileşenleri _.svelte_ uzantılı dosyalar ile 
      oluşturulur. HTML'e benzer olarak _script, style, html_ kod yapılarını 
      oluşturabilirdiğiniz üç farklı bölüm bulunuyor.`,
    otherDescription: `Uygulama oluşturduğumuzda bu bileşenler derlenerek, 
      pure _Javascript_ kodlarına dönüştürülür. Svelte derleme işlemini runtime
      üzerinde gerçekleştiriyor. Bu derleme işlemiyle birlikte Virtual DOM 
      bağımlılığını ortadan kalkıyor.`,
    image: `assets/documentation/build-map.png`,
    alternativeText: `Svelte build file`,
    id: "svelte-run",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
</article>
