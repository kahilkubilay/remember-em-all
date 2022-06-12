<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import Image from "./Section/Templates/Image.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Communication Between Components`,
    description: `From small projects to complex structures, we will have needs
      such as taking many data from the component and using it in a different
      place, updating it. One of the structures used as a solution of modern
      framework structures is to enable you to use the data here on your
      application without the need for structures such as DOM and storage. The
      framework, library or compiler should be able to provide flexible
      solutions to this need. Svelte has multiple solutions for these needs.`,
    image: `assets/documentation/communication-is-key.jpg`,
    alternativeText: `SpongeBob 'communication is key' meme`,
    id: "communication-between-components",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Image image={article.image} alternativeText={article.alternativeText} />
  <Paragraph text={article.description} />
</article>
