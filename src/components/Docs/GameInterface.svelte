<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `Game Interface`,
    description: `We need a component to use the cards in the game. By creating
      this component, we will create as many cards as we want on the play
      ground.`,
    id: "game-interface",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
</article>
