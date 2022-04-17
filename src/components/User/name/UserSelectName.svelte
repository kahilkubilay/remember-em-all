<script lang="ts">
  import { userInfo } from "../../../store/User";

  const { name } = userInfo;
</script>

<h3>{$name}</h3>

<style>
  h3 {
    display: block;
    margin: 0px auto;
    border-radius: 10px;
    padding: 2px 0;
    font-size: 24px;
  }
</style>
