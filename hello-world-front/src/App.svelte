<script>
  async function getAllTodos() {
    const res = await fetch(`http://localhost:3000/todo/`);
    const todos = await res.json();

    if (res.ok) {
      return todos;
    } else {
      throw new Error(text);
    }
  }

  let promise = getAllTodos();

  function handleClick() {
    promise = getAllTodos();
  }
</script>

<main>
  <button on:click={handleClick}> get all todos </button>

  <p>todos:</p>
  <p>
    {#await promise}
      <p>...waiting</p>
    {:then todos}
      {#each todos as todo}
        <h1>Todo:</h1>
        <p>{todo.titulo}</p>
        <h3>Resp.:</h3>
        <p>{todo.pessoaId}</p>
        <p>Finalizado? 
        {#if todo.finalizado}
          ✅
        {:else}
          ❌
        {/if}
        </p>
      {/each}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </p>
</main>
