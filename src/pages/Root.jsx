import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Main from "../components/layout/Main";
import { NavBar } from "../components/layout/NavBar";

function Root() {
  return (
    <div className="min-h-screen flex flex-col items-stretch">
      <NavBar />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </div>
  );
}

export default Root;
