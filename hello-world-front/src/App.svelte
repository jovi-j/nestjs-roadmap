<script>
  import { onMount } from "svelte";
  import { Label } from "@smui/button";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";

  let checked = [];
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

  onMount(getAllTodos);
</script>

<main>
  <h1>Todos</h1>
  <div class="container-flex">
    {#await promise}
      <Label>Fetching todos...</Label>
    {:then todos}
      {#each todos as todo}
        <form action="" method="post">
          <div style="margin-top: 1em;">
            <FormField>
              <input type="checkbox" name="finalizarTarefa" />
              <h1>
                {todo.titulo}
                <spam style="opacity: 0.4;">
                  {todo.pessoaResponsavel.nome}</spam
                >
              </h1>
            </FormField>
          </div>
        </form>
      {/each}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</main>
