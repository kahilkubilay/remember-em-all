<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import Matter from "./Section/Templates/Matter.svelte";

  const article = {
    head: `Svelte yapısını inceleme`,
    description: `Varsayılan _src/App.svelte_ dosyasını kontrol ettiğimizde daha
      önce değindiğimiz gibi _Javascript_ kodları için _script_, _html_ kodları 
      için _main_ ve stillendirme için _style_ tagları bulunuyor.`,
    material: [
      `_script_ etiketinde _lang_ özelliği Typescript bağımlılığını eklediğimiz
      için _ts_ değerinde bulunmaktadır. Typescript kullanmak istediğin _svelte_
      dosyalarında _lang_ özelliğine _ts_ değerini vermen yeterli olacaktır.`,
      `_main_ etiketinde _html_ kodlarını tanımlayabileceğin gibi, bu etiketin
      dışında da dilediğin gibi _html_ kodlarını tanımlayabilirsin. Svelte
      tanımladığın kodları _html_ kodu olarak derlemesine rağmen, proje 
      yapısının daha okunabilir olabilmesi için kapsayıcı bir etiketin altında
      toplanması daha iyi olabilir.`,
      `_style_ etiketi altında tanımladığın stil özelliklerinden, aynı dosyada
      bulunan _html_ alanında seçiciler etkilenir. Global seçicileri 
      tanımlayabilir veya global olarak tanımlamak istediğin seçicileri 
      'public/global.css' dosyasında düzenleyebilirsin.`,
      `Proje içerisinde compile edilen bütün yapılar '/public/build/bundle.js'
      dosyasında yer almaktadir. _index.html_ dosyası buradaki yapıyı referans
      alarak Svelte projesini kullanıcı karşısına getirmektedir.`,
    ],
    id: "examine-svelte-structure",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Matter matter={article.material} />
</article>
