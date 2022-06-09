<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import Matter from "./Section/Templates/Matter.svelte";

  const article = {
    head: `Svelte yapısını inceleme`,
    description: `Varsayılan <code><i>src/App.svelte</i></code> dosyasını 
      kontrol ettiğimizde daha önce değindiğimiz gibi <code><i>Javascript</i>
      </code> kodları için <code><i>script, html</i></code> kodları için <code>
      <i>main</i></code> ve <code><i>stillendirme</i></code> için <code><i>style
      </i></code> tagları bulunuyor.`,
    material: [
      `<code><i>script</i></code> etiketinde <code><i>lang</i></code> özelliği 
      <code><i>Typescript</i></code> bağımlılığını eklediğimiz için <code><i>ts
      </i></code> değerinde bulunmaktadır. <code><i>Typescript</i></code>
      kullanmak istediğin <code><i>svelte</i></code> dosyalarında <code><i>lang
      </i></code> özelliğine <code><i>ts</i></code> değerini vermen yeterli
      olacaktır.`,
      `<code><i>main</i></code> etiketinde <code><i>html</i></code> kodlarını 
      tanımlayabileceğin gibi, bu etiketin dışında da dilediğin gibi <code><i>
      html</i></code> kodlarını tanımlayabilirsin. <code><i>Svelte</i></code>
      tanımladığın kodları <code><i>html</i></code> kodu olarak derlemesine 
      rağmen, proje yapısının daha okunabilir olabilmesi için kapsayıcı bir
      etiketin altında toplanması daha iyi olabilir.`,
      `<code><i>style</i></code> etiketi altında tanımladığın stil
      özelliklerinden, aynı dosyada bulunan <code><i>html</i></code> alanında
      seçiciler etkilenir. Global seçicileri tanımlayabilir veya global olarak
      tanımlamak istediğin seçicileri <code><i>public/global.css</i></code>
      dosyasında düzenleyebilirsin.`,
      `Proje içerisinde compile edilen bütün yapılar 
      <code><i>/public/build/bundle.js</i></code> dosyasında yer almaktadir.
      <code><i>index.html</i></code> dosyası buradaki yapıyı referans alarak
      <code><i>Svelte</i></code> projesini kullanıcı karşısına getirmektedir.`,
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
