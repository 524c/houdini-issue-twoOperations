<script lang="ts">
  import { G_AllUsers } from '$houdini';
  const startColor = 'red';
  const normalColor = 'blue';

  $: color = startColor;

  async function GetAllUsers() {
    console.log('getAllUsers');
    color = startColor;
    await G_AllUsers.fetch();
    setTimeout(() => {
      color = normalColor;
    }, 500);
  }
</script>

<button on:click={GetAllUsers}>GetAllUsers</button>
<br />

{#if $G_AllUsers?.data}
  <pre class={color}>{JSON.stringify($G_AllUsers?.data?.AllUsers, null, 2)}</pre>
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
