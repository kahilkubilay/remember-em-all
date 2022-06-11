<script>
  import FileTitle from "../FileTitle.svelte";
  import Prism from "svelte-prism";

  export let code;
  export let title;
</script>

<FileTitle {title} />
<Prism language="svelte" source={code} />
