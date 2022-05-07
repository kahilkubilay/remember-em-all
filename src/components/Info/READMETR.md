<span id="selam-sana"></span>

## Selam :wave:

Son zamanlarda Svelte ile uygulama geliştirmeye başladım. Svelte'in
yapısına daha çok hakim olabilmek ve öğrendiklerimi paylaşabilmek için bu
dökümanı oluşturdum. Döküman içerisinde adım adım 'Game' bağlantısında
görebileğiniz oyunu nasıl geliştirdiğimi anlattım, ilgi duyuyorsanız aynı
adımları takip ederek benzer veya farklı bir uygulama oluşturabilirsiniz.
Svelte içeriği iyi ayrıntılanmış dökümantasyonlara
([docs](https://svelte.dev/docs "Svelte Documentation"),
[examples](https://svelte.dev/examples/hello-world "Svelte Examples")) sahip,
dökümantasyonları inceledikten sonra uygulamayı takip etmeniz daha faydalı
olabilir. İçeriğin özelliklerini sol tarafta bulunan haritalandırma ile takip
edebilirsiniz.

::::: buradaki logoyu content-map alanına taşı ::::

<p align="center">
  <img src="./assets/svelte-logo.png" alt="Svelte logo" title="Svelte logo" 
  style="width:400px"/>
</p>

::::: buradaki logoyu content-map alanına taşı ::::

<span id="proje-hakkinda"></span>

## Oyun Hakkında

Projemizde bir hafıza oyunu geliştireceğiz. Kullanıcıların seviyelerine göre
arayüz üzerinde kartlar bulunacak. Kartların üzerlerine click eventi
gerçekleştirildiğinde kartlar açılacak, kullanıcılar açılan kartları
eşleştirmeye çalışacaklar. Eşleşen kartlar açık bir şekilde arayüz üzerinde
dururken başarılı eşleşme sonucunda kullanıcıya puan kazandıracak, başarısız her
eşleşmede kartlar bulundukları yerde yeniden kapatılacaklar. Bütün kartlar
eşleştiklerinde, bir sonraki seviyede yer alan kartar arayüze kapalı olarak
yeniden gelecektir.

<p align="center">
  <img src="./assets/playground.png" alt="view of cards on the playground" 
  title="view of cards on the playground" style="width: 900px;"/>
</p>

Oyun başlangıcında kullanıcıdan bir kullanıcı adı girmesi, avatar listesinde
yer alan görsellerden birini seçmesi beklenecektir. Bu seçilen değerler oyunun
arayüzünde kartların yer aldığı bölümün altında score & level değerleri ile
birlikte gösterilecektir. Kullanıcı adı ve seçilen avatar stabil değerler olarak
kalacaktır, score & level değerleri dinamik olarak kullanıcı davranışına göre
güncellenecektir.

<span id="svelte-nedir"></span>

## Svelte nedir?

Svelte günümüz modern library ve framework habitatının komplex yapılarını
azaltarak daha basit şekilde yüksek verimliliğe sahip uygulamalar
geliştirilmesini sağlamayı amaçlayan bir derleyicidir. Modern framework/library
ile birlikte geride bıraktığımız her süreçte farklı ihtiyaçlar için yeni bir öğrenme
süreci ortaya çıktı.

<p align="center">
  <img src="./assets/svelte-react.jfif" 
  alt="Simplicity of Svelte compiler versus react" 
  title="Simplicity of Svelte compiler versus react" style="width: 450px;"/>
</p>

Öğrenme döngüsünün sürekli olarak geliştiricilerin
karşısına çıkması bir süre sonrasında illallah dedirtmeye başladılar.
Svelte'in alışık olduğumuz html & css & js kod yapılarına benzer bir
sözdiziminin kullanılması, props ve state güncellemeleri için 40 takla
atılmasına gerek kalınmaması gibi özellikleri ile bu döngünün dışına çıkmayı
amaçlamaktadır.

[Stack Overflow Developer Survey 2021](https://insights.stackoverflow.com/survey/2021#section-most-loved-dreaded-and-wanted-web-frameworks "Stack Overflow Developer Survey 2021") anketinde geliştiriciler tarafından %71.47 oranıyla en çok sevilen web
framework Svelte olarak seçildi.

<span id="svelte-projesi-olusturma"></span>

## Svelte projesi oluşturma

Npx ile yeni bir proje oluşturma:

```
npx degit sveltejs/template remember-em-all
```

Svelte Typescript notasyonunu desteklemektedir. Typescript üzerinde
yapabileceğiniz bütün işlemleri Svelte projenizde kullanabilirsiniz.

```
cd remember-em-all
node scripts/setupTypeScript.js
```

Gerekli olan bağımlılıkları projemize ekleyerek ayağa kaldırabiliriz.

```
npm install
npm run dev
```

Bu komutlar sonrasında konsol üzerinde projenin hangi port üzerinde çalıştığını
kontrol edebilirsiniz. Windows işletim sistemlerinde genelde 8080 portu işaret
edilirken, bu port üzerinde çalışan proje varsa veya farklı işletim
sistemlerinde port adresi değişebilir.

<p align="center">
  <img src="./assets/console-logs.png" 
  alt="Port where Svelte is running on the console" 
  title="Port where Svelte is running on the console" />
</p>

<span id="svelte-nasil-calisir"></span>

## Svelte nasıl çalışır?

Svelte bileşenleri `.svelte` uzantılı dosyalar ile oluşturulur. HTML'de benzer
olarak `script, style, html` kod yapılarını oluşturabilirdiğiniz üç farklı bölüm
bulunuyor. Uygulamanızı oluşturduğunuzda bu bileşenler derlenerek, pure
Javascript kodlarına dönüştürülür.

<p align="center">
  <img src="./assets/build-map.png" alt="Svelte Build map" style="width: 800px"/>
</p>

Svelte'in derleme işlemini runtime üzerinde gerçekleştiriyor. Bu derleme
işlemiyle birlikte Virtual DOM bağımlılığı ortadan kalkıyor.

<span id="bagimliliklar"></span>

## Proje bağımlılıkları

- #### Typescript
  Typescript, Javascript kodunuzu daha verimli kılmanızı ve kod kaynaklı
  hataların önüne geçilmesini sağlayan bir Javascript uzantısıdır. Svelte
  `.svelte` uzantılı dosyaların yanısıra `.ts` dosyaları da destekler.
- #### Rollup
  Svelte kurulumunuzla birlikte root folder üzerinde rollup.config.js dosyası
  oluşturulacaktır. Rollup javascript uygulamalar için kullanılan bir modül
  paketleyicidir. Rollup uygulamamızda yer alan kodları tarayıcının
  anlayabileceği şekilde ayrıştırır.

<span id="svelte-projesini-inceleme"></span>

## Svelte projesini inceleme

Varsayılan src/App.svelte dosyasını kontrol ettiğimizde daha önce bahsettiğimiz
Javascript kodları için script, html kodları için main ve stillendirme için
style tagları bulunuyor.

`script` etiketinde lang attribute'i Typescript bağımlılığını eklediğimiz için
"ts" değerinde bulunmaktadır. Typescript kullanmak istediğiniz .svelte
dosyalarında lang attribute'ine ts değerini vermeniz yeterli olacaktır.

`main` etiketinde html kodlarını tanımlayabileceğiniz gibi, bu tag'ın dışında da
istediğiniz gibi html kodlarını tanımlayabilirsiniz. Svelte tanımladığınız
kodları html kodu olarak derlemesine rağmen, proje yapısının daha okunabilir
olabilmesi bir etiketin altında toplanması daha iyi olabilir.

`style` etiketi altında tanımladığınız stillendirmeler, html alanında bulunan
seçiciler etkilenir. Global seçicileri kullanabileceğiniz gibi, global olarak
tanımlamak istediğiniz seçicileri `public>global.css` dosyasında
düzenleyebilirsiniz.

Proje içerisinde compile edilen bütün yapılar `/public/build/bundle.js`
dosyasında yer almaktadir. index.html dosyası buradaki yapıyı referans alarak
svelte projesini kullanıcı karşısına getirmektedir.

<span id="component-ve-dizin-yapisi"></span>

## Arayüzü oluşturma

### Component Yapısı

<p align="center">
  <img src="./assets/components/playground-component-structure.png" 
  alt="Svelte Build map" style="width: 750px"/>
  <label><i>[JSONVisio](https://jsonvisio.com/ "JSONVisio web link") ile JSON 
  verilerinizi görselleştirebilir, bu yapıdaki dosyalarınızı daha okunabilir 
  formata çevirebilirsiniz.</i></label>
</p>

Playground Componenti altında oyunda yer alan bütün yapıları tutacağız. Bununla
birlikte arayüz üzerinde yer alan kartları ve kullanıcının gerçekleştirmiş
olduğu eventleri burada takip edeceğiz. `src` klasörünün altında Playground için
tanımlayacağımız dizin yapısını aşağıdaki görseldeki gibi oluşturalım.

<p align="center">
  <img src="./assets/components/playground-component-directories.png" 
  alt="playground component directories" 
  title="playground component directories" style="width: 750px"/>
</p>

#### Playground Componenti



<span id="github-page-ile-deploy"></span>

## GitHub Pages ile Deploy

## Kaynak

- Svelte nedir?

  - https://svelte.dev/blog/svelte-3-rethinking-reactivity

- Svelte Documentation:

  - https://svelte.dev/examples/hello-world
  - https://svelte.dev/tutorial/basics
  - https://svelte.dev/docs
  - https://svelte.dev/blog
  - https://svelte.dev/blog/svelte-3-rethinking-reactivity

* Svelte Projesi Oluşturma

  - https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_TypeScript

- Bağımlılıklar
  - https://typeofnan.dev/how-to-set-up-a-svelte-app-with-rollup/

* Deploy:

  - https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_deployment_next

* md files importing

- https://stackoverflow.com/questions/56678488/how-to-import-a-markdown-file-in-a-typescript-react-native-project
