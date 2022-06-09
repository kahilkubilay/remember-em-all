<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Start Game`,
    description: `Svelte'i biraz daha yakından tanıyoruz, birlikte uygulamamızı
      oluşturabilmek için yeteri kadar bilgi sahibi olduk. Kullanıcının arayüz 
      üzerinde görebileceği iki Component bulunuyor. Kullanıcı adı ve avatar 
      seçtiği User Component, bu seçimler sonrasında erişilen Playground 
      Component. User Componenti ile oyunumuzu oluşturmaya başlayalım. 
      <a href="#svelte-projesi-olusturma" title="Yeni bir Svelte Projesi 
      oluştur">Yeni bir proje oluşturabilir</a> veya pratik yapabilmek için 
      şuana kadarki kodları kaldırabilirsin. <code><i>src > components > User
      </i></code> ve <code><i>src > components > Playground</i></code> 
      klasörlerini oluşturalım.`,
    image: `assets/documentation/start-folder.png`,
    alternativeText: `start folder`,
    id: "start-game",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Image image={article.image} alternativeText={article.alternativeText} />
</article>
