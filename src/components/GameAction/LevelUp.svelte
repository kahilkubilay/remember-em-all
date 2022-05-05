<script context="module">
  import { userInfo } from "../../store/User";

  const { level } = userInfo;

  export const levelUp = (getLevel) => {
    let up = getLevel + 1;

    level.set(up);
  };
</script>
