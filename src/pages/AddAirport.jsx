"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { useInsert, usePreload } from "../hooks/database";
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

export function AddAirport() {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const insert = useInsert("airports");
  usePreload("airports", DEFAULT_DATA);

  if (!user)
    return (
      <div>Please add your pocketbase URL and login to use Airport Example</div>
    );

  function addAirport(data) {
    // Add an airport to the list
    insert.call({
      code: data.code.toUpperCase(),
      name: data.airportName,
      city: data.city,
      state: data.state,
    });
    reset();
    setOpenModal(false);
  }

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Add New Airport</Button>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Add Airport</ModalHeader>
        <ModalBody>
          <div className="grid gap-4">
            <div>
              <label htmlFor="code" className="mb-1 block text-sm font-medium">
                Airport Code
              </label>
              <TextInput
                id="code"
                type="text"
                placeholder="Code (e.g. SFO)"
                {...register("code")}
              />
            </div>

            <div>
              <label
                htmlFor="airportName"
                className="mb-1 block text-sm font-medium"
              >
                Airport Name
              </label>
              <TextInput
                id="airportName"
                type="text"
                placeholder="Full airport name"
                {...register("airportName")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="mb-1 block text-sm font-medium"
                >
                  City
                </label>
                <TextInput
                  id="city"
                  type="text"
                  placeholder="City"
                  {...register("city")}
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="mb-1 block text-sm font-medium"
                >
                  State
                </label>
                <TextInput
                  id="state"
                  type="text"
                  placeholder="State"
                  {...register("state")}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" onClick={handleSubmit(addAirport)}>
            Add Airport
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
