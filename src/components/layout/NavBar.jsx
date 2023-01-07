import React from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { HomeIcon } from "@heroicons/react/24/outline";

export function NavBar() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 w-full flex-shrink-0">
      <Container>
        <div className="flex items-center justify-between py-4">
          {/* left side */}
          <div className="flex items-center">
            {/* home icon */}
            <NavBar.Link to="/">
              <HomeIcon className="h-8 w-8 text-stone-500 dark:text-stone-300" />
              <span className="sr-only">Home</span>
            </NavBar.Link>
          </div>
          {/* right side */}
          <div className="flex items-center space-x-5">
            <NavBar.Link to="/help">Help</NavBar.Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

NavBar.Link = function NavBarLink({ children, to }) {
  return (
    <Link to={to} className="dark:text-stone-300 dark:hover:text-stone-100">
      {children}
    </Link>
  );
};
