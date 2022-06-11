<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Game Requirements`,
    description: `Kullanıcının isim, avatar gibi aldığımız değerlerin yanı sıra
      oyuna ait standart değerler bulunabilir. Geliştirmekte olduğumuz oyun için
      bu değerlerden <code><i>level ve score</code></i> isimlerinde iki değer 
      tanımlayacağız. Kullanıcı, isim ve avatar seçiminin ardından 
      <code><i>start</i></code> butonuna tıkladığında bu değerlerden 
      <code><i>level 1, score ise 0</code></i> değerlerini barındıracaklar. 
      Kullanıcı doğru kartları eşleştirdikçe score değeri ve bütün kartlar 
      eşleştiğinde level değerini güncelleyeceğiz.`,
    anotherDescription: `<code><i>level</i></code> isminde bir değer oluşturduk
      ve gezegenin iyiliği için uygulamamız içerisinde kullanacağız. Bu değer 
      kullanıcı arayüz üzerindeki bütün kartları eşleştirebildiğinde 
      güncellenecek. Bir store değeri oluşturmak için <code><i>writable</i>
      </code> interface ile Store değerlerini oluşturabilir ve 
      güncelleyebilirsin.`,
    moreDescription: `Her eşleşme sonrasında kullanıcının puan kazanabildiği 
      <code><i>score</i></code> değeri tanımlayalım.`, //💩
    anotherMoreDescription: `Bu değerleri farklı dosyalarda tanımlayabildiğin
      gibi tek bir tek bir dosya içerisinde de <code><i>score&level</i></code>
      değerlerini tanımlayabilirsin. Bir kullanıcı oluşturarak 
      <code><i>name & avatar & score & level</i></code> değerlerini birlikte
      kullanabilirsin.`, //💩
    anotherOneMoreDescription: `Kullanıcıya ait statik bilgileri tutacağımız 
      yeni bir <code><i>class</i></code> oluşturalım.`, //💩
    otherDescription: `Svelte üzerinde <code><i>store</i></code> değerlerini 
      birden fazla yapı ile güncelleyebilirsin. <code><i>$level = 1</i></code>
      gibi bir yolu izlemekle birlikte aşağıdaki örnekteki gösterimdeki benzer
      şekilde <code><i>.set</i></code> metodu ile güncelleme işlemeni 
      sağlayabilirsin.`,
    endStory: `Oluşturduğumuz <code><i>UserInfo class</i></code> kullanıcının
      isim, avatar değerlerini set edeceğiz. Bu değerlere default olarak boş 
      <code><i>String</i></code> atadım, farklı içerikle doldurabilirsin. isim
      ve avatar değerleri hatalı değilse <code><i>isStart</i></code> değerine
      <code><i>true</i></code> olarak güncelleyerek oyunu başlatacağız.`,
    id: "game-requirements",
  };

  const code = `
    <script>
      import { Writable, writable } from "svelte/store";
      
      export const level:Writable<number> = writable(1);
    <\/script>
  `;

  const otherCode = `
    <script>
      import { Writable, writable } from "svelte/store";
  
      export class UserInfo {
        constructor (
          public name: Writable<string> = writable(''),
          public avatar: Writable<string> = writable(''),
          public isStart: Writable<boolean> = writable(false)
      ){}
  
      export const userInfo = new UserInfo();
    <\/script>
  `;

  const moreCode = `
    <script>
      import { Writable, writable } from "svelte/store";

      export const score:Writable<number> = writable(0);
    <\/script>
  `;

  const anotherCode = `
    <script context="module">
      import { score } from "../../store/Score";

      export const scoreUp = () => {
        let getScore;

        score.subscribe((callScore) => {
          getScore = callScore;
        });

        let up = getScore + 1;

        score.set(up);
      };
    <\/script>
  `;

  const title = `Store > Level.ts`;
  const otherTitle = `Store > Score.ts`;
  const moreTitle = `Store > User.ts`;
  const anotherTitle = `Store güncelleme`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.anotherDescription} />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={moreCode} title={otherTitle} />
  <Paragraph text={article.anotherMoreDescription} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax code={anotherCode} title={anotherTitle} />
  <Paragraph text={article.anotherOneMoreDescription} />
  <CodeSyntax code={otherCode} title={moreTitle} />
  <Paragraph text={article.endStory} />
</article>
