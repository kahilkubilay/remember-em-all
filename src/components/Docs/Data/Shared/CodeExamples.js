export const Codes = {
  "variableErisimi": `
  <script>
    const user = "sabuha";
  <\/script>
  
  <span>{user} seni izliyor!</span>
  
  <style>
    h1 {
      color: rebeccapurple;
    }
  </style>`,
  "2": `
  <script>
    const user = "sabuha";
  <\/script>

  <span>{user === "sabuha" ? "bir kedi gördüm sanki!" : "seni izliyor!"}</span>
  `,
  "reaktifDegiskenler": `
  <script>
    let number = 0;
  
    const randomNumber = () => {
      number = Math.round(Math.random() \* 15);
    };
  <\/script>

  <main>
    <h3>{number}</h3>
    <button on:click={randomNumber}>Update Number</button>
  </main>

  <style>
    main {
      border-radius: 5px;
      background-color: yellowgreen;
      padding: 5px;
      margin: 10px 50px;
    }

    h3 {
      background-color: orangered;
      width: 100px;
      color: white;
    }

    button {
      border: 1px solid black;
      cursor: pointer;
    }

    h3,button {
      display: block;
      text-align: center;
      margin: 25px auto;
      padding: 5px;
    }
    </style>
  `,
  "useOfComponents": `
    <script>
    let number = 0;
  
    const randomNumber = () => {
      number = Math.round(Math.random() \* 15);
    };
  <\/script>
  
  <div class="random-number-capsule">
    <h3>{number}</h3>
    <button on:click={randomNumber}>Update Number</button>
  </div>
  
  <style>
    .random-number-capsule {
      border-radius: 5px;
      background-color: yellowgreen;
      padding: 5px;
      margin: 10px 50px;
    }
    
    h3 {
      background-color: orangered;
      width: 100px;
      color: white;
    } 
    
    button {
      border: 1px solid black;
      cursor: pointer;
    } 
    
    h3,
    button {
      display: block;
      text-align: center;
      margin: 25px auto;
      padding: 5px;
    }
  </style>
  `,
  "useOfComponentsAnother": `
  <script>
    import RandomNumber from "./components/Content/RandomNumber/RandomNumber.svelte";
  <\/script>

  <main>
    <RandomNumber />
    <RandomNumber />
    <RandomNumber />
    <RandomNumber />
  </main>

  <style></style>
  `
}