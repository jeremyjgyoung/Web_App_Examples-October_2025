import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput, Button, Spinner } from "flowbite-react";
import {
  useList,
  useInsert,
  useUpdate,
  useRemove,
  useRemoveAll,
  usePreload,
} from "../hooks/database";
import { useAuth } from "../hooks/useAuth";

const DEFAULT_DATA = [
  {
    name: "Hartsfield-Jackson Atlanta International Airport",
    code: "ATL",
    city: "Atlanta",
    state: "Georgia",
  },
  {
    name: "Los Angeles International Airport",
    code: "LAX",
    city: "Los Angeles",
    state: "California",
  },
  {
    name: "Chicago O'Hare International Airport",
    code: "ORD",
    city: "Chicago",
    state: "Illinois",
  },
  {
    name: "Dallas/Fort Worth International Airport",
    code: "DFW",
    city: "Dallas/Fort Worth",
    state: "Texas",
  },
  {
    name: "Denver International Airport",
    code: "DEN",
    city: "Denver",
    state: "Colorado",
  },
  {
    name: "John F. Kennedy International Airport",
    code: "JFK",
    city: "New York",
    state: "New York",
  },
  {
    name: "San Francisco International Airport",
    code: "SFO",
    city: "San Francisco",
    state: "California",
  },
  {
    name: "Seattle-Tacoma International Airport",
    code: "SEA",
    city: "Seattle",
    state: "Washington",
  },
  {
    name: "McCarran International Airport",
    code: "LAS",
    city: "Las Vegas",
    state: "Nevada",
  },
  {
    name: "Orlando International Airport",
    code: "MCO",
    city: "Orlando",
    state: "Florida",
  },
];

export function AirportComplex() {
  const { user } = useAuth();

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
  } = useForm();
  const { register: registerSearch, handleSubmit: handleSubmitSearch } =
    useForm();
  const [searchTerm, setSearchTerm] = useState("");

  // Pass the filter to useList when there's a search term
  const filter = searchTerm
    ? `code~"${searchTerm}"||name~"${searchTerm}"||city~"${searchTerm}"`
    : "";

  const list = useList("airports", { filter });
  const insert = useInsert("airports");
  const removeAll = useRemoveAll("airports");
  usePreload("airports", DEFAULT_DATA);

  if (!user)
    return (
      <div>Please add your pocketbase URL and login to use Airport Example</div>
    );

  if (list.isLoading)
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );

  function addAirport(data) {
    // Add an airport to the list
    console.log(data);
    insert.call(data);
    resetAdd();
  }

  function clearAll() {
    // Clear all airports
    removeAll.call(list);
  }

  function handleSearch(data) {
    setSearchTerm(data.searchTerm);
  }

  function createAirportItem(item) {
    return <AirportItem key={item.id} item={item} />;
  }

  return (
    <div className="mx-auto grid max-w-2xl justify-center gap-4 p-4">
      <div className="text-center text-2xl font-bold">Airport Directory</div>

      {/* Add Airport Form */}
      <form
        onSubmit={handleSubmitAdd(addAirport)}
        className="grid grid-cols-4 gap-2"
      >
        <TextInput
          type="text"
          placeholder="Code (e.g. SFO)"
          {...registerAdd("code")}
        />
        <TextInput
          type="text"
          placeholder="Name"
          className="col-span-3"
          {...registerAdd("name")}
        />
        <TextInput
          type="text"
          placeholder="City"
          className="col-span-2"
          {...registerAdd("city")}
        />
        <TextInput
          type="text"
          placeholder="State"
          className="col-span-2"
          {...registerAdd("state")}
        />
        <div className="col-span-4 mt-2">
          <Button className="w-full" type="submit">
            Add Airport
          </Button>
        </div>
      </form>

      {/* Search Form */}
      <form
        onSubmit={handleSubmitSearch(handleSearch)}
        className="mb-4 flex gap-2"
      >
        <TextInput
          type="text"
          placeholder="Search airports by code, name or city..."
          className="flex-1"
          {...registerSearch("searchTerm")}
        />
        <Button type="submit" className="w-24">
          Search
        </Button>
      </form>

      {/* Results Section */}
      <div className="my-6">
        <h3 className="mb-4 text-lg font-semibold">
          {searchTerm ? `Search Results for "${searchTerm}"` : "All Airports"}
        </h3>

        {list.data?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No airports found</div>
        ) : (
          <div className="grid gap-4">{list.data?.map(createAirportItem)}</div>
        )}
      </div>

      <Button color="dark" size="sm" onClick={clearAll}>
        Clear All Airports
      </Button>
    </div>
  );
}

function AirportItem({ item }) {
  const { id, code, name, city, state } = item;
  const remove = useRemove("airports");

  function removeAirport() {
    remove.call(id);
  }

  return (
    <div className="rounded border bg-white p-4 shadow">
      <div className="mb-2 flex items-center justify-between">
        <div className="rounded bg-gray-100 px-3 py-1 font-mono text-lg font-bold">
          {code}
        </div>
        <Button color="failure" size="xs" onClick={removeAirport}>
          Remove
        </Button>
      </div>
      <div className="mb-1 truncate text-lg font-medium">{name}</div>
      <div className="text-gray-600">
        {city}, {state}
      </div>
    </div>
  );
}
