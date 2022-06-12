<script>
  import SubHeader from "./Section/Templates/SubHeader.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Variable access`,
    description: `<code><i>Curly braces {}</i></code> must be used to call the
      values defined on the script in HTML. With this template, you can perform
      operations by calling variables regardless of value type.`,
    otherDescription: `With this definition, you can dynamically call any value
      defined to the <b>user</b> value in HTML. Where <b>user</b> is equal to 
      <b>sabuha</b>, <b>he is watching you!</b> instead of <b>I saw a cat, as if!
      </b> Let's display the value.`,
    anotherDescription: `You can perform loop and function calls as well as
      condition structures between <code><i>curly braces {}</code></i> tags that
      we use in <b>HTML</b>. We will perform together, many operations with
      these structures.`,
    id: "variable-access",
  };

  const code = `
    <script>
      const user = "sabuha";
    <\/script>

    <span>{user} seni izliyor!</span>
    
    <style>
      span {
        color: rebeccapurple;
      }  
    </style>`;

  const otherCode = `
    <script>
      const user = "sabuha";  
    <\/script>

    <span>{user === "sabuha" ? "bir kedi gördüm sanki!" : "seni izliyor!"}</span>

    <style></style>
  `;

  const title = "app.svelte";
</script>

<article>
  <AccessArticle link={article.id} />
  <SubHeader head={article.head} />
  <Paragraph text={article.description} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax code={otherCode} {title} />
  <Paragraph text={article.anotherDescription} />
</article>
