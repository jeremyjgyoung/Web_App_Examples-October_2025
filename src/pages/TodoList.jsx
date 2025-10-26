import React from "react";
import { useForm } from "react-hook-form";
import { TextInput, Checkbox, Button, Label, Spinner } from "flowbite-react";
import {
  useList,
  useInsert,
  useUpdate,
  useRemove,
  useRemoveAll,
  usePreload,
  useFind,
} from "../hooks/demobase.js";

const DEFAULT_DATA = [
  { complete: false, task: "Walk the dog" },
  { complete: true, task: "Water the plants" },
  { complete: false, task: "Buy apples" },
  { complete: false, task: "Mail package" },
];

export function TodoList() {
  const { register, handleSubmit, reset } = useForm();
  const list = useList("todos");
  const insert = useInsert("todos");
  const removeAll = useRemoveAll("todos");
  usePreload("todos", DEFAULT_DATA);

  if (list.isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );

  function add(data) {
    // Add a task to the list
    insert.call({ task: data.task, complete: false });
    reset();
  }
  function clear() {
    // Clear all list items
    removeAll.call(list);
  }
  function createItem(item) {
    return <TodoItem key={item.id} item={item} />;
  }
  return (
    <div className="grid justify-center gap-2">
      <div className="text-center text-2xl">Todo List</div>
      <form onSubmit={handleSubmit(add)} className="flex gap-2">
        <TextInput className="flex-1" type="text" {...register("task")} />
        <Button className="w-24" type="submit">
          Add
        </Button>
      </form>
      <div className="my-4 grid gap-2">{list.data?.map(createItem)}</div>
      <Button color="dark" size="sm" onClick={clear}>
        Clear All
      </Button>
    </div>
  );
}

export function TodoItem({ item }) {
  const { id, task, complete } = item;
  //Step 2: Call the 'useUpdate' hook
  const update = useUpdate("todos");
  const remove = useRemove("todos");

  //Step 3: Call the 'update.call(id, {key1: value1})'
  function toggle() {
    update.call(id, { complete: !complete });
  }
  function clear() {
    remove.call(id);
  }
  return (
    <div className="flex items-center gap-2 break-words">
      {/*Step 4: Add the event handler to the button*/}
      <Button className="w-full" color="gray" onClick={toggle}>
        <div className={complete ? "line-through opacity-25" : ""}>{task}</div>
      </Button>
      <Button size="xs" onClick={clear}>
        X
      </Button>
    </div>
  );
}
