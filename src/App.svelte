<script lang="ts">
  import Playground from "./components/Playground/Wrapper/Playground.svelte";
  import About from "./components/Info/About.svelte";
  import { Router, Route, Link } from "svelte-navigator";
</script>

<main>
  <Router>
    <header>
      <nav>
        <Link to="/">about</Link>
        <span class="pipe"> | </span>
        <Link to="game">game</Link>
      </nav>
    </header>
    <div>
      <Route path="/" component={About} />
      <Route path="game">
        <Playground />
      </Route>
    </div>
  </Router>
</main>

<style>
  nav {
    text-align: center;
    width: 900px;
    padding: 25px 50px;
    margin: 10px auto;
    border-radius: 5px;
  }

  :global(a) {
    color: black !important;
    font-size: 22px;
  }

  .pipe {
    font-size: 24px;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
