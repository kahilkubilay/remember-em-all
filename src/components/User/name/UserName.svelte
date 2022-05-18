<script>
  import { userInfo } from "../../../store/User";

  const { name } = userInfo;
</script>

<div class="user">
  <input
    type="text"
    name="name"
    placeholder="pika pika"
    class="name"
    bind:value={$name}
  />
</div>

<style>
  .name {
    border-radius: 20px;
    text-align: center;
    margin-bottom: 30px;
    padding: 8px 0;
    width: 40%;
  }
</style>
