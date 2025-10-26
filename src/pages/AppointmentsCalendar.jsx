import React, { useState } from "react";
import {
  Card,
  Button,
  Badge,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Mail,
  FileText,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useList } from "../hooks/database";

export function AppointmentsCalendar() {
  const { user } = useAuth();
  const list = useList("appointments");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Helper functions for date handling
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  // Navigate to previous month
  const prevMonth = () => {
    const prevDate = new Date(currentDate);
    prevDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prevDate);
  };

  // Navigate to next month
  const nextMonth = () => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextDate);
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Check if a date has appointments
  const getAppointmentsForDate = (date) => {
    if (!list.data) return [];

    const dateString = date.toISOString().split("T")[0];
    return list.data.filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
        .toISOString()
        .split("T")[0];
      return appointmentDate === dateString;
    });
  };

  // Handle date selection
  const handleDateClick = (date) => {
    if (!date) return;

    const fullDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date,
    );

    const appointments = getAppointmentsForDate(fullDate);
    setSelectedDate(fullDate);
    setSelectedDateAppointments(appointments);
    setShowModal(true);
  };

  // Format time for display (12-hour format with AM/PM)
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
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endHours = endDate.getHours().toString().padStart(2, "0");
    const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
    return formatTime(`${endHours}:${endMinutes}`);
  };

  // Render loading state
  if (!user) {
    return (
      <div className="p-4 text-center">
        Please add your pocketbase URL and login to use Appointment Calendar
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

  // Generate calendar days
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const today = new Date();
    const isCurrentMonth =
      today.getMonth() === month && today.getFullYear() === year;
    const currentDay = isCurrentMonth ? today.getDate() : null;

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border border-gray-200 p-1"
        ></div>,
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const appointments = getAppointmentsForDate(date);
      const isToday = day === currentDay;

      days.push(
        <div
          key={day}
          className={`h-24 overflow-hidden border border-gray-200 p-1 ${
            isToday ? "bg-blue-50" : ""
          } cursor-pointer transition-colors hover:bg-gray-50`}
          onClick={() => handleDateClick(day)}
        >
          <div className="mb-1 flex justify-between">
            <span
              className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}
            >
              {day}
            </span>
            {appointments.length > 0 && (
              <Badge color="blue" className="text-xs">
                {appointments.length}
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            {appointments.slice(0, 2).map((apt, idx) => (
              <div
                key={idx}
                className="truncate rounded bg-blue-100 px-1 py-0.5 text-xs text-blue-800"
              >
                {formatTime(apt.time)}
              </div>
            ))}
            {appointments.length > 2 && (
              <div className="text-xs text-gray-500">
                +{appointments.length - 2} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Appointments Calendar
      </h1>

      <Card>
        {/* Calendar Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button onClick={prevMonth} size="sm" color="light">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <Button onClick={nextMonth} size="sm" color="light">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <Button onClick={goToToday} size="sm">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <div>
          {/* Days of week header */}
          <div className="mb-1 grid grid-cols-7">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-gray-50 py-2 text-center font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">{renderCalendar()}</div>
        </div>
      </Card>

      {/* Appointment Detail Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <ModalHeader>
          {selectedDate &&
            selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
        </ModalHeader>
        <ModalBody>
          {selectedDateAppointments.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              No appointments scheduled for this day.
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateAppointments.map((appointment, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Clock className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium">Appointment</div>
                      <div className="text-sm text-gray-500">
                        {formatTime(appointment.time)} -{" "}
                        {calculateEndTime(
                          appointment.time,
                          appointment.duration,
                        )}{" "}
                        ({appointment.duration} mins)
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-1 border-t border-gray-100 pt-3 text-sm">
                    {appointment.contactEmail && (
                      <div className="flex items-center">
                        <Mail className="mr-1 h-4 w-4 text-gray-500" />
                        <span className="font-medium">Email: </span>{" "}
                        {appointment.contactEmail}
                      </div>
                    )}
                    {appointment.notes && (
                      <div className="flex items-start">
                        <FileText className="mt-0.5 mr-1 h-4 w-4 text-gray-500" />
                        <span className="font-medium">Notes: </span>{" "}
                        {appointment.notes}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
