<script context="module">
  import { level } from "../../store/Level";

  export const levelUp = () => {
    let getLevel;

    level.subscribe((callLevel) => {
      getLevel = callLevel;
    });

    let up = getLevel + 1;

    setTimeout(level.set(up));
  };
</script>
