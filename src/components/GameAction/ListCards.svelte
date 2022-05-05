<script context="module">
  import { level } from "../../store/Level";

  export const list = () => {
    console.log(":: work here ::");
    let getLevel;

    level.subscribe((callLevel) => {
      getLevel = callLevel;
    });

    const list = [];
    const range = 5;
    const levelRange = getLevel * range;
    let levelCounter = levelRange - 5 + 1;

    for (levelCounter; levelCounter <= levelRange; levelCounter++) {
      list.push(levelCounter);
    }

    return list;
  };
</script>
