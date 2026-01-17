import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import Orders from "@/pages/Orders";
import Tasks from "@/pages/Tasks";
import CalendarModule from "@/pages/Calendar";
import Clients from "@/pages/Clients";
import Settings from "@/pages/Settings";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<CalendarModule />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
