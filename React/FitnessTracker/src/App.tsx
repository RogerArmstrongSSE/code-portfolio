import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Meals from "./components/Meals";
import Activity from "./components/Activity";
import PersonalInfoForm from "./components/MyInformation";
import { HomeRoute, MealsRoute, ActivityRoute, PersonalInfoRoute } from "./components/Layout/menuItems";
import React from "react";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path={HomeRoute.slug} element={<Home />} />
        <Route path={MealsRoute.slug} element={<Meals />} />
        <Route path={ActivityRoute.slug} element={<Activity />} />
        <Route path={PersonalInfoRoute.slug} element={<PersonalInfoForm />} />
      </Routes>
    </div>
  );
}