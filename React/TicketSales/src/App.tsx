import { Route, Routes } from "react-router-dom";
import React from "react";
import TicketsSold from "./components/TicketsSold";
import BuyTickets from "./components/BuyTickets";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TicketsSold />} />
        <Route path="/tickets" element={<TicketsSold />} />
        <Route path="/buy" element={<BuyTickets />} />
      </Routes>
    </div>
  );
}