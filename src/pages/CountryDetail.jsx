import React from "react";
import { useParams, useNavigate } from "react-router";
import { Button, Spinner, Card } from "flowbite-react";
import { useFind } from "../hooks/database";
import { useAuth } from "../hooks/useAuth";

export function CountryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const country = useFind("countries", id);

  if (!user)
    return (
      <div>
        Please add your pocketbase URL and login to use Country Directory
      </div>
    );

  if (country.isLoading)
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );

  if (!country.data) {
    return (
      <div className="mx-auto max-w-4xl p-4 text-center">
        <div className="mb-4 text-xl font-medium">Country not found</div>
        <Button onClick={() => navigate("/countries")}>
          Back to Countries
        </Button>
      </div>
    );
  }

  const {
    name,
    capital,
    continent,
    population,
    area,
    languages,
    currency,
    flag_code,
    description,
  } = country.data;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <Button
        color="light"
        size="sm"
        className="mb-4"
        onClick={() => navigate("/countries")}
      >
        ← Back to Countries
      </Button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{name}</h1>
        {flag_code && <span className="text-4xl">{flag_code}</span>}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <h3 className="mb-2 text-lg font-medium">Basic Information</h3>
          <div className="space-y-2">
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
            <p>
              <span className="font-medium">Area:</span>{" "}
              {area?.toLocaleString()} km²
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="mb-2 text-lg font-medium">Culture & Language</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Languages:</span> {languages}
            </p>
            <p>
              <span className="font-medium">Currency:</span> {currency}
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="mb-2 text-lg font-medium">Geography</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Continent:</span> {continent}
            </p>
            <p>
              <span className="font-medium">Area:</span>{" "}
              {area?.toLocaleString()} km²
            </p>
            <p>
              <span className="font-medium">Density:</span>{" "}
              {population && area ? (population / area).toFixed(2) : "N/A"}{" "}
              people/km²
            </p>
          </div>
        </Card>
      </div>

      {description && (
        <Card className="mb-8">
          <h3 className="mb-2 text-lg font-medium">About {name}</h3>
          <p className="text-gray-700">{description}</p>
        </Card>
      )}
    </div>
  );
}
