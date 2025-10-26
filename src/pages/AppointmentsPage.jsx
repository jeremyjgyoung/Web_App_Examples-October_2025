import React, { useState } from "react";
import {
  TextInput,
  Button,
  Label,
  Spinner,
  Card,
  Select,
  Datepicker,
  Textarea,
  Toast,
  ToastToggle,
} from "flowbite-react";
import {
  Calendar,
  Clock,
  CheckCircle,
  X,
  Mail,
  FileText,
  Trash2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  useList,
  useInsert,
  useUpdate,
  useRemove,
  useRemoveAll,
  usePreload,
} from "../hooks/database";

// Default appointments for demonstration
const DEFAULT_APPOINTMENTS = [
  {
    date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    time: "09:00",
    duration: 60, // Changed to number
    contactEmail: "drsmith@example.com",
    notes: "Bring insurance card",
  },
  {
    date: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    time: "14:30",
    duration: 45, // Changed to number
    contactEmail: "team@company.com",
    notes: "Prepare quarterly report",
  },
  {
    date: new Date().toISOString(), // today
    time: "16:00",
    duration: 30, // Changed to number
    contactEmail: "appointments@stylestudio.com",
    notes: "",
  },
];

export function AppointmentsPage() {
  const { user } = useAuth();
  const list = useList("appointments");
  const insert = useInsert("appointments");
  const removeAll = useRemoveAll("appointments");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Form state
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Preload default appointments
  usePreload("appointments", DEFAULT_APPOINTMENTS);

  function handleSubmit(e) {
    e.preventDefault();

    // Format the data and insert to database
    const appointmentData = {
      date: appointmentDate.toISOString(),
      time: time,
      duration: parseInt(duration, 10),
      contactEmail: contactEmail,
      notes: notes || "",
      userId: user.id,
    };

    console.log("Saving appointment with data:", appointmentData);

    insert.call(appointmentData);

    // Show success message and reset form
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);

    // Reset form
    setTime("");
    setDuration("30");
    setContactEmail("");
    setNotes("");
  }

  function clearAllAppointments() {
    removeAll.call(list);
  }

  // Sort appointments by date and time
  const sortedAppointments = list.data?.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (dateA.toDateString() === dateB.toDateString()) {
      return a.time.localeCompare(b.time);
    }
    return dateA - dateB;
  });

  // Group appointments by date
  const appointmentsByDate = sortedAppointments?.reduce(
    (groups, appointment) => {
      const date = new Date(appointment.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(appointment);
      return groups;
    },
    {},
  );

  // Render loading state
  if (!user) {
    return (
      <div className="p-4 text-center">
        Please add your pocketbase URL and login to use Appointment Scheduler
      </div>
    );
  }

  if (list.isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Appointment Scheduler
      </h1>

      {/* Top section: Add appointment form */}
      <Card className="mb-6">
        <h2 className="mb-4 text-xl font-semibold">Schedule New Appointment</h2>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <Label htmlFor="date" value="Date" />
            <div className="relative">
              <Datepicker
                id="date"
                required
                onChange={setAppointmentDate}
                showFooter={false}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="time" value="Time" />
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
              <TextInput
                id="time"
                type="time"
                required
                className="pl-10"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="duration" value="Duration (minutes)" />
            <Select
              id="duration"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="contactEmail" value="Contact Email" />
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <TextInput
                id="contactEmail"
                type="email"
                placeholder="contact@example.com"
                className="pl-10"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <Label htmlFor="notes" value="Notes" />
            <Textarea
              id="notes"
              placeholder="Any additional details..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <Button
              type="submit"
              disabled={insert.isLoading}
              className="w-full md:w-auto"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Appointment
              {insert.isLoading && <Spinner className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Card>

      {/* Bottom section: Appointments list */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Appointments</h2>
          <Button
            color="failure"
            size="xs"
            onClick={clearAllAppointments}
            disabled={removeAll.isLoading}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Clear All
          </Button>
        </div>

        <div className="grid gap-4">
          {appointmentsByDate ? (
            Object.keys(appointmentsByDate).length > 0 ? (
              Object.entries(appointmentsByDate).map(([date, appointments]) => (
                <div key={date} className="mb-4">
                  <h3 className="flex items-center rounded bg-gray-100 p-2 font-medium text-gray-700">
                    <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <div className="mt-2 grid gap-2">
                    {appointments.map((appointment) => (
                      <AppointmentItem
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No appointments scheduled. Add one to get started!
              </div>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </Card>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed right-4 bottom-4">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">
              Appointment scheduled successfully!
            </div>
            <ToastToggle onClick={() => setShowSuccessToast(false)} />
          </Toast>
        </div>
      )}
    </div>
  );
}

function AppointmentItem({ appointment }) {
  const { id, date, time, duration, contactEmail, notes } = appointment;
  const remove = useRemove("appointments");

  function deleteAppointment() {
    remove.call(id);
  }

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  // Calculate end time
  const calculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(":");
    const startDate = new Date();
    startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    // Use duration directly as a number
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endHours = endDate.getHours().toString().padStart(2, "0");
    const endMinutes = endDate.getMinutes().toString().padStart(2, "0");

    return formatTime(`${endHours}:${endMinutes}`);
  };

  // Calculate if appointment is today
  const isToday = new Date(date).toDateString() === new Date().toDateString();

  return (
    <Card className="p-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Clock className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <div className="font-medium">Appointment</div>
            <div className="flex items-center text-sm text-gray-500">
              {formatTime(time)} - {calculateEndTime(time, duration)} (
              {duration} mins)
              {isToday && (
                <span className="ml-2 flex items-center font-medium text-blue-600">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Today
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          color="failure"
          size="xs"
          onClick={deleteAppointment}
          disabled={remove.isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 grid gap-1 border-t border-gray-100 pt-3 text-sm">
        {contactEmail && (
          <div className="flex items-center">
            <Mail className="mr-1 h-4 w-4 text-gray-500" />
            <span className="font-medium">Email: </span> {contactEmail}
          </div>
        )}
        {notes && (
          <div className="flex items-start">
            <FileText className="mt-0.5 mr-1 h-4 w-4 text-gray-500" />
            <span className="font-medium">Notes: </span> {notes}
          </div>
        )}
      </div>
    </Card>
  );
}
