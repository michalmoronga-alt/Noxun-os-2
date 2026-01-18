import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import Orders from "@/pages/Orders";
import Tasks from "@/pages/Tasks";
import CalendarModule from "@/pages/Calendar";
import Today from "@/pages/Today";
import OrderDetail from "@/pages/OrderDetail";
import Settings from "@/pages/Settings";
import './App.css';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/dnes" replace />} />
          <Route path="/dnes" element={<Today />} />
          <Route path="/zakazky" element={<Orders />} />
          <Route path="/zakazky/:id" element={<OrderDetail />} />
          <Route path="/ulohy" element={<Tasks />} />
          <Route path="/kalendar" element={<CalendarModule />} />
          <Route path="/nastavenia" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
