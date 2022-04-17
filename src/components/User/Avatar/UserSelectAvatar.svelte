<script lang="ts">
  import { userInfo } from "../../../store/User";

  const { avatar } = userInfo;
  const setAvatar = `/images/${$avatar}.jpg`;
</script>

<img src={setAvatar} alt="user selected avatar" />

<style>
  img {
    width: 100px;
    height: 100px;
    border-radius: 11px;
    box-sizing: border-box;
    margin: 0 auto;
  }
</style>
