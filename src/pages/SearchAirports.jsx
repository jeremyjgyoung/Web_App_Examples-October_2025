import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput, Button, Spinner, Select } from "flowbite-react";
import { useList } from "../hooks/database";
import { useAuth } from "../hooks/useAuth";

export function SearchAirports() {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Construct the sort parameter for useList
  const sort = `${sortDirection === "desc" ? "-" : ""}${sortField}`;

  // Pass the filter to useList when there's a search term
  const filter = searchTerm
    ? `code~"${searchTerm}"||name~"${searchTerm}"||city~"${searchTerm}"`
    : "";

  const list = useList("airports", { filter, sort });

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

  function handleSearch(data) {
    setSearchTerm(data.searchTerm);
  }

  function handleSortChange(e) {
    setSortField(e.target.value);
  }

  function toggleSortDirection() {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-6 text-center text-2xl font-bold">
        Airport Directory
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit(handleSearch)} className="mb-4 flex gap-2">
        <TextInput
          type="text"
          placeholder="Search airports by code, name or city..."
          className="flex-1"
          {...register("searchTerm")}
        />
        <Button type="submit" className="w-24">
          Search
        </Button>
      </form>

      {/* Sort Controls */}
      <div className="mb-6 flex items-center gap-3">
        <div className="text-sm font-medium">Sort by:</div>
        <Select value={sortField} onChange={handleSortChange} className="w-40">
          <option value="name">Airport Name</option>
          <option value="city">City</option>
          <option value="code">Code</option>
          <option value="state">State</option>
        </Select>
        <Button
          size="sm"
          color="light"
          onClick={toggleSortDirection}
          className="flex items-center gap-1"
        >
          {sortDirection === "asc" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              <span>A-Z</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>
              <span>Z-A</span>
            </>
          )}
        </Button>
      </div>

      {/* Results Section */}
      <div className="my-6">
        <h3 className="mb-4 text-lg font-semibold">
          {searchTerm ? `Search Results for "${searchTerm}"` : "All Airports"}
          {sortField &&
            ` (Sorted by ${sortField}, ${sortDirection === "asc" ? "A-Z" : "Z-A"})`}
        </h3>

        {list.data?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No airports found</div>
        ) : (
          <div className="grid gap-4">
            {list.data?.map((item) => (
              <AirportItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AirportItem({ item }) {
  const { code, name, city, state } = item;

  return (
    <div className="rounded border bg-white p-4 shadow">
      <div className="mb-2 flex items-center justify-between">
        <div className="rounded bg-gray-100 px-3 py-1 font-mono text-lg font-bold">
          {code}
        </div>
      </div>
      <div className="mb-1 truncate text-lg font-medium">{name}</div>
      <div className="text-gray-600">
        {city}, {state}
      </div>
    </div>
  );
}
