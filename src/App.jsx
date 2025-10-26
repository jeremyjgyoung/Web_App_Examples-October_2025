import { Home } from "./pages/Home";
import { CountryList } from "./pages/CountryList";
import { CountryDetail } from "./pages/CountryDetail";
import { SearchAirports } from "./pages/SearchAirports";
import { AddAirport } from "./pages/AddAirport";
import { TodoList } from "./pages/TodoList";
import { TodoListDatabase } from "./pages/TodoListDatabase";
import { AirportComplex } from "./pages/AirportComplex";
import { UploadImagePage } from "./pages/UploadImagePage";
import { AuthPage } from "./pages/AuthPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { AppointmentsCalendar } from "./pages/AppointmentsCalendar";
import { LayoutExamples } from "./pages/LayoutExamples";

import { Authentication } from "./components/Authentication";

import { useAuth } from "./hooks/useAuth";
import { Routes, Route, NavLink } from "react-router";

function styleLink({ isActive }) {
  if (isActive) return "p-2 border-b-4 border-cyan-600";
  return "p-2 hover:text-cyan-700";
}

function NavBar({ isAdmin }) {
  return (
    <div className="flex items-center bg-sky-50 px-4">
      <NavLink to={"/"} className="me-auto text-xl font-medium">
        Demo App
      </NavLink>
      <div className="flex p-3">
        <NavLink className={styleLink} to={"/"}>
          Home
        </NavLink>
        <NavLink className={styleLink} to={"/layouts"}>
          Layout
        </NavLink>
        <NavLink className={styleLink} to="/todo">
          Todo List
        </NavLink>
        <NavLink className={styleLink} to="/todo_db">
          Todo DataBase
        </NavLink>
        <NavLink className={styleLink} to={"/countries"}>
          Countries
        </NavLink>
        <NavLink className={styleLink} to="/search-airports">
          Search Airports
        </NavLink>
        <NavLink className={styleLink} to="/add-airport">
          Add Airport
        </NavLink>
        <NavLink className={styleLink} to="/airport-complex">
          Complex Airports
        </NavLink>
        <NavLink className={styleLink} to="/appointments">
          Appointments
        </NavLink>
        <NavLink className={styleLink} to="/appointments-cal">
          Appointments Calendar
        </NavLink>
        <NavLink className={styleLink} to="/upload">
          Upload
        </NavLink>
        {isAdmin && (
          <NavLink className={styleLink} to="/auth">
            Auth
          </NavLink>
        )}
      </div>
      <Authentication className="ms-auto flex items-center gap-2" />
    </div>
  );
}

function RouteDefinitions({ isAdmin }) {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/countries" element={<CountryList />} />
        <Route path="/countries/:id" element={<CountryDetail />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/todo_db" element={<TodoListDatabase />} />
        <Route path="/layouts" element={<LayoutExamples />} />
        <Route path="/search-airports" element={<SearchAirports />} />
        <Route path="/add-airport" element={<AddAirport />} />
        <Route path="/airport-complex" element={<AirportComplex />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/appointments-cal" element={<AppointmentsCalendar />} />
        <Route path="/upload" element={<UploadImagePage />} />
        {isAdmin && <Route path="/auth" element={<AuthPage />} />}
      </Routes>
    </div>
  );
}

export default function App() {
  const { isAdmin } = useAuth();

  return (
    <div>
      <NavBar isAdmin={isAdmin} />
      <RouteDefinitions isAdmin={isAdmin} />
    </div>
  );
}
