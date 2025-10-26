import React from "react";
import { useForm } from "react-hook-form";
import { TextInput, Checkbox, Button, Label, Spinner } from "flowbite-react";
import { useAuth } from "../hooks/useAuth";
import {
  useList,
  useInsert,
  useUpdate,
  useRemove,
  useRemoveAll,
  usePreload,
  useFind,
} from "../hooks/database";

const DEFAULT_TASKS = [
  { complete: false, task: "Walk the dog", userId: "test@test.com" },
  { complete: true, task: "Water the plants", userId: "test@test.com" },
  { complete: false, task: "Buy apples", userId: "test@test.com" },
  { complete: false, task: "Mail package", userId: "test@test.com" },
];

export function TodoListDatabase() {
  const { register, handleSubmit, reset } = useForm();
  const { user } = useAuth();
  const list = useList("todos");
  //const list = useList('todos', {filter : {'userId' : user?.id}}); // (Uncomment this to only show todos by the registered user (filters todos to only show ones where the userID in the todo matches the current user))
  const insert = useInsert("todos");
  const removeAll = useRemoveAll("todos");

  //useInitialize will populate 'todos' with default tasks if it is empty
  usePreload("todos", DEFAULT_TASKS);

  function add(data) {
    // Add a task to the list
    insert.call({ task: data.task, complete: false, userId: user.id }); // Insert the task into the database
    reset(); // Reset (clear) the form
  }
  function clear() {
    removeAll.call(list); // Remove all items from the database
  }
  function createItem(item) {
    return <TodoItem key={item.id} item={item} />; // Return the TodoItem component with the data from the database
  }

  // If the user isn't logged in, return a message to login
  if (!user) {
    return (
      <div>
        Please add your pocketbase URL and login to use Todo List Database
      </div>
    );
  }

  // If the list is loading, return a spinner component
  if (list.isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );

  // If neither of the above return statements have run, it will use this return statement and return the full app
  return (
    <div className="grid justify-center">
      <div className="text-center text-xl font-medium">Todo List Database</div>
      <form onSubmit={handleSubmit(add)} className="flex gap-2">
        <TextInput
          className="flex-1"
          type="text"
          {
            ...register("task") /* Connects the textInput field to the form */
          }
        />
        <Button type="submit" disabled={insert.isLoading}>
          Add
        </Button>
      </form>
      <div className="my-4 grid gap-2">
        {
          list.data?.map(
            createItem,
          ) /* Run the createItem function, which returns a TodoItem component for each item in the list */
        }
      </div>
      <Button
        color="dark"
        size="sm"
        onClick={clear}
        disabled={removeAll.isLoading}
      >
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
    update.call(id, { complete: !complete }); // Update the item in the database to toggle the 'complete' property
  }
  function clear() {
    remove.call(id);
  }

  return (
    <div className="flex items-center gap-2 break-words">
      {/*Step 4: Add the event handler to the button*/}
      <Button
        disabled={update.isLoading}
        className="w-full"
        color="gray"
        onClick={toggle}
      >
        <div className={complete ? "line-through opacity-25" : ""}>{task}</div>
      </Button>
      <Button size="xs" onClick={clear} disabled={remove.isLoading}>
        X
      </Button>
    </div>
  );
}
