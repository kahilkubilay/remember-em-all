<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Svelte projesi oluşturma`,
    description: `npx ile yeni bir proje oluşturma:`,
    otherDescription: `<code><i>Svelte Typescript</i></code> notasyonunu 
      desteklemektedir. <code><i>Typescript</i></code> üzerinde yapabileceğiniz
      bütün işlemleri <code><i>Svelte</i></code> projelerinde kullanabilirsin.`,
    anotherDescription: `Gerekli olan bağımlılıkları projemize ekleyerek ayağa 
      kaldırabiliriz.`,
    anotherAnDescription: `Bu komutlar sonrasında konsol üzerinde projenin hangi
      port üzerinde çalıştığını görebilirsin. Windows işletim sistemlerinde 
      varsayılan 8080 portu işaretli iken, bu port üzerinde çalışan proje 
      bulunuyorsa veya farklı işletim sistemi kullanıyorsan port numarası 
      değişkenlik gösterebilir.`, // 💩
    image: `assets/documentation/console-logs.png`,
    alternativeText: `port where Svelte is running on the console`,
    id: "create-a-svelte-project",
  };

  const svelteInstall = `npx degit sveltejs/template remember-em-all`;
  const typescriptSet = `
    cd remember-em-all
    node scripts/setupTypeScript.js`;
  const dependenciesInstall = `
    npm install
    npm run dev`;

  const title = ``;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <CodeSyntax code={svelteInstall} {title} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax code={typescriptSet} {title} />
  <Paragraph text={article.anotherDescription} />
  <CodeSyntax code={dependenciesInstall} {title} />
  <Paragraph text={article.anotherAnDescription} />
  <Image image={article.image} alternativeText={article.alternativeText} />
</article>
