<script lang="ts">
  import { G_User } from '$houdini';

  export let pk = 0;
  const startColor = 'red';
  const normalColor = 'blue';
  $: color = startColor;

  export function UserVariables({ props }: { props: { pk?: number } }) {
    return {
      pk: props.pk
    };
  }

  async function GetUser() {
    color = startColor;
    await G_User.fetch({ variables: { pk } });
    setTimeout(() => {
      color = normalColor;
    }, 500);
  }
</script>

<button on:click={GetUser}>GetUser</button>
<br />

{#if $G_User?.data}
  <pre class={color}>{JSON.stringify($G_User?.data?.User, null, 2)}</pre>
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
