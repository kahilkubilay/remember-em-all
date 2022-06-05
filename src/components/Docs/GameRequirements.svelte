<script>
  import Header from "./Section/Templates/Header.svelte";
  import Paragraph from "./Section/Templates/Paragraph.svelte";
  import AccessArticle from "./Section/Templates/AccessArticle.svelte";
  import CodeSyntax from "./Section/Templates/CodeDescription/CodeSyntax.svelte";

  const article = {
    head: `Game Requirements`,
    description: `Kullanıcının isim, avatar gibi aldığımız değerlerin yanı sıra
      oyuna ait standart değerler bulunabilir. Geliştireceğimiz oyun 
      için bu değerlerden _level_ ve _score_ gibi iki değer tanımlayacağız. 
      Kullanıcı, isim ve avatar seçiminin ardından _start_ butonuna tıkladığında
      bu değerlerden _level 1_, _score 0_ değerlerini oluşturacağız. Kullanıcı 
      doğru kartları eşleştirdikçe ve seviye atladığında burada yer alan 
      değerler dinamik olarak güncellenecek.`,
    otherDescription: `+ /Store/Level.ts, Score.ts`,
    anotherDescription: `_level_ isminde bir değer oluşturduk ve gezegenin 
      iyiliği için uygulamamız içerisinde kullanacağız. Bu değer kullanıcı 
      arayüz üzerindeki bütün kartları eşleştirebildiğinde güncellenecek. Bir
      store değeri oluşturmak için _writable_ interface ile Store değerlerini
      oluşturabilir ve güncelleyebilirsin.`,
    moreDescription: `Her eşleşme sonrasında kullanıcının puan kazanabildiği 
      _score_ değeri tanımlayalım.`, //💩
    anotherMoreDescription: `Bu değerleri farklı dosyalarda tanımlayabildiğin
      gibi tek bir tek bir dosya içerisinde de _score&level_ değerlerini 
      tanımlayabilirsin. Bir kullanıcı oluşturarak _name & avatar & score & 
      level_ değerlerini birlikte kullanabilirsin.`, //💩
    anotherOneMoreDescription: `Kullanıcıya ait statik bilgileri tutacağımız 
    yeni bir class oluşturalım.`, //💩
    endStory: `Oluşturduğumuz UserInfo class'ını kullanıcının isim, avatar
      değerlerini set edeceğiz. Bu değerlere default olarak boş String atadım,
      farklı içerikle doldurabilirsin. isim ve avatar değerleri hatalı değilse 
      _isStart_ değerine _true_ olarak güncelleyerek oyunu başlatacağız.`,
    descriptionBored: `+ /Store/User.ts`, //💩
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

  const title = `Store > Level.ts`;
  const otherTitle = `Store > Score.ts`;
  const moreTitle = `Store > User.ts`;
</script>

<article>
  <AccessArticle link={article.id} />
  <Header head={article.head} />
  <Paragraph text={article.description} />
  <Paragraph text={article.otherDescription} />
  <CodeSyntax {code} {title} />
  <Paragraph text={article.anotherDescription} />
  <Paragraph text={article.moreDescription} />
  <CodeSyntax code={moreCode} title={otherTitle} />
  <Paragraph text={article.anotherMoreDescription} />
  <Paragraph text={article.anotherOneMoreDescription} />
  <Paragraph text={article.descriptionBored} />
  <CodeSyntax code={otherCode} title={moreTitle} />
  <Paragraph text={article.endStory} />
</article>
