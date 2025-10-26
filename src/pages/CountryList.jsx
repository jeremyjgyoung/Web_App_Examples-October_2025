import React from "react";
import { Spinner, Card } from "flowbite-react";
import { Link } from "react-router";
import { useList, usePreload } from "../hooks/database";
import { useAuth } from "../hooks/useAuth";
import { COUNTRY_DATA } from "../data/countryData";

export function CountryList() {
  const { user } = useAuth();
  const list = useList("countries");

  // Preload the data from imported file
  usePreload("countries", COUNTRY_DATA);

  if (!user)
    return (
      <div>
        Please add your pocketbase URL and login to use Country Directory
      </div>
    );

  if (list.isLoading)
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-6 text-center text-2xl font-bold">
        Country Directory
      </div>

      {/* Results Section */}
      <div className="my-6">
        <h3 className="mb-4 text-lg font-semibold">All Countries</h3>

        {list.data?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No countries found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.data?.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CountryCard({ country }) {
  const { id, name, capital, continent, population, flag_code } = country;

  return (
    <Link
      to={`/countries/${id}`}
      className="block transition-transform hover:scale-105"
    >
      <Card className="h-full max-w-sm">
        <div className="flex items-start justify-between">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
          </h5>
          {flag_code && <span className="text-2xl">{flag_code}</span>}
        </div>
        <div className="space-y-2 font-normal text-gray-700 dark:text-gray-400">
          <p>
            <span className="font-medium">Capital:</span> {capital}
          </p>
          <p>
            <span className="font-medium">Continent:</span> {continent}
          </p>
          <p>
            <span className="font-medium">Population:</span>{" "}
            {population?.toLocaleString()}
          </p>
        </div>
      </Card>
    </Link>
  );
}
