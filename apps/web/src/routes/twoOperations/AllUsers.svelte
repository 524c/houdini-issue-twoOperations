<script lang="ts">
  import { G_AllUsers } from '$houdini';
  const startColor = 'red';
  const normalColor = 'blue';

  $: color = startColor;

  async function getAllUsers() {
    console.log('getAllUsers');
    color = startColor;
    await G_AllUsers.fetch();
    setTimeout(() => {
      color = normalColor;
    }, 500);
  }
</script>

<button on:click={getAllUsers}>getAllUsers</button>
<br />

{#if $G_AllUsers?.data}
  <pre class={color}>G_AllUsers: {JSON.stringify($G_AllUsers?.data, null, 2)}</pre>
  <br />
{/if}

<style>
  .red {
    color: red;
  }
  .blue {
    color: blue;
  }
</style>
