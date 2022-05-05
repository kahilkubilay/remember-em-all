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
</script>
