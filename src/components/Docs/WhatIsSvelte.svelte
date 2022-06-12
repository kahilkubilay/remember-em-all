<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";

  const article = {
    head: `What is Svelte?`,
    description: `<code><i>Svelte</i></code> is a compiler that aims to reduce
      the complexity of today's modern library and framework habitat which is
      enabling simpler, efficent applications to be developed. Along with modern
      frameworks or libraries, a new learning process emerged for different
      needs as time passed. It is quite obvious that the learning cycle
      constantly confronts to the developers, after a while developers starts to
      say for god's sake. Svelte has managed to break out of this loop with its
      features such as having a syntax similar to the <code><i>html & css & js
      </i></code> code structures we are used to, and not needing to spend
      effort for props and state/stores updates.. and I hope it can continue to
      maintain its simplicity in this way.`,
    otherDescription: `In the
      <a href="https://insights.stackoverflow.com/survey/2021#section-most-loved-dreaded-and-wanted-web-frameworks"
      title="Stack Overflow Developer Survey 2021">Stack Overflow Developer
      Survey 2021</a> , Svelte was chosen as the most popular web framework with
      a rate of 71.47% by the developers.`,
    id: "what-is-svelte",
  };
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
</article>
