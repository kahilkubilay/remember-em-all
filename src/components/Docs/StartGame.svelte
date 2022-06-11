<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Start Game`,
    description: `Svelte'i biraz daha yakından tanıyoruz, birlikte uygulamamızı
      oluşturabilmek için yeteri kadar bilgi sahibi olduk. Oyun için gerekli 
      yapılarımızı basitten zora doğru kurgulayamaya başlayabiliriz. 
      Kullanıcının arayüz üzerinde görebileceği iki Component bulunuyor. 
      Kullanıcı adı ve avatar seçtiği User Component, bu seçimler sonrasında erişilen Playground 
      Component. User Componenti ile oyunumuzu oluşturmaya başlayalım. 
      <a href="#create-a-svelte-project" title="Create a Svelte project">
      Yeni bir proje oluşturabilir</a> veya pratik yaptığımız kodları
      kaldırabilirsin. <code><i>src > components > User
      </i></code> ve <code><i>src > components > Playground</i></code> 
      klasörlerini oluşturmakla başlayalım.`,
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
