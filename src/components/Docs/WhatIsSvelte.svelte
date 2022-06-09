<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Svelte nedir?`,
    description: `Svelte günümüz modern library ve framework habitatının komplex
      yapılarını azaltarak daha basit şekilde yüksek verimliliğe sahip 
      uygulamalar geliştirilmesini sağlamayı amaçlayan bir derleyicidir. Modern
      framework/library ile birlikte geride bıraktığımız her süreçte farklı 
      ihtiyaçlar için yeni bir öğrenme süreci ortaya çıktı. Öğrenme döngüsünün 
      sürekli olarak geliştiricilerin karşısına çıkması bir süre sonrasında 
      illallah dedirtmeye başladığı gayet aşikar. Svelte alışık olduğumuz 
      <code><i>html & css & js</i></code> kod yapılarına benzer bir sözdizimine
      sahip olması, props ve state/stores güncellemeleri için 40 takla 
      atılmasına gerek kalınmaması gibi özellikleri ile bu döngünün dışına 
      çıkmayı başarabilmiş.. ve umuyorum ki bu şekilde sadeliğini korumaya
      devam edebilir.`,
    otherDescription: `
      <a href="https://insights.stackoverflow.com/survey/2021#section-most-loved-
      dreaded-and-wanted-web-frameworks" title="Stack Overflow Developer Survey 2021">
      Stack Overflow Developer Survey 2021</a> anketinde geliştiriciler 
      tarafından %71.47 oranıyla en çok sevilen web framework Svelte olarak 
      seçildi.`,
    id: "what-is-svelte",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
</article>
