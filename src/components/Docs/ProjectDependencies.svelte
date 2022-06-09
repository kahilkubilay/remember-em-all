<script>
  import Header from "./Section/Templates/Header.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import List from "./Section/Templates/List.svelte";

  const article = {
    head: `Proje bağımlılıkları`,
    terms: [
      {
        command: `Typescript`,
        description: `<code><i>Typescript, Javascript</i></code> kodunuzu daha
          verimli kılmanızı ve kod kaynaklı hataların önüne geçilmesini sağlayan 
          Javascript temelli programlama dilidir. Projenizde yer alan <code><i>
          .svelte</i></code> uzantılı dosyalarda kullanabileceğiniz gibi, <code>
          <i>.ts</i></code> dosyalarını da destekler.`,
      },
      {
        command: `Rollup`,
        description: `<code><i>Svelte</i></code> kurulumunuzla birlikte root 
          folder üzerinde rollup.config.js dosyası oluşturulacaktır. Rollup 
          <code><i>Javascript</i></code> uygulamalar için kullanılan bir modül
          paketleyicidir, uygulamamızda yer alan kodları tarayıcının 
          anlayabileceği şekilde ayrıştırır. <code><i>Svelte</i></code> 
          kurulumuyla birlikte projenize eklenir.`,
      },
    ],
    id: "project-dependencies",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <List material={article.terms} />
</article>
