<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Creating Svelte project`,
    description: `Creating a new project with npx:`,
    otherDescription: `Svelte supports Typescript. You can use all the
      operations you can do on <code><i>Typescript in Svelte</i></code>
      projects.`,
    anotherDescription: `We can start our project by adding the necessary
      dependencies to our project.`,
    anotherAnDescription: `After these commands, you can see which port the
      project is running on the console. While the default 8080 port is marked
      in Windows operating systems, the port number may vary if there is a
      project running on this port or if you are using a different operating
      system.`, // 💩
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
