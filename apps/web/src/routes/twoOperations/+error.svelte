<script>
  import { page } from '$app/stores';
</script>

<pre>status: {$page.status}</pre>
<pre>error: {$page?.error?.message}</pre>
