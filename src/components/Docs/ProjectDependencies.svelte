<script>
  import Header from "./Section/Templates/Header.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import List from "./Section/Templates/List.svelte";

  const article = {
    head: `Proje bağımlılıkları`,
    terms: [
      {
        command: `Typescript`,
        description: `Typescript, Javascript kodunuzu daha verimli kılmanızı ve 
          kod kaynaklı hataların önüne geçilmesini sağlayan bir Javascript 
          uzantısıdır. Projenizde yer alan _.svelte_ uzantılı dosyalarda 
          kullanabileceğiniz gibi, _.ts_ dosyalarını da destekler.`,
      },
      {
        command: `Rollup`,
        description: `Svelte kurulumunuzla birlikte root folder üzerinde 
          rollup.config.js dosyası oluşturulacaktır. Rollup Javascript 
          uygulamalar için kullanılan bir modül paketleyicidir, uygulamamızda 
          yer alan kodları tarayıcının anlayabileceği şekilde ayrıştırır. Svelte
          kurulumunda default olarak projenize eklenir.`,
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
