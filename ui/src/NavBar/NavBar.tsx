import React from "react";
import { Link } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard/Dashboard";

interface NavButtons {
  label: string;
  path: string;
}

const navButtons: NavButtons[] = [
  {
    label: "Start an Adventure",
    path: "/start-an-adventure"
  },
  {
    label: "Itineraries",
    path: "/itineraries"
  },
  {
    label: "About Us",
    path: "/about-us"
  },
  {
    label: "Contact",
    path: "/contact"
  }
]

export function NavBar() {
  return (
    <div className="navBar">
      <h1>Excursion Expert</h1>
      <span>
        {navButtons.map((button) => {
          return (
            <Link
              className="navBar__buttons"
              to={button.path}
              key={button.label}
            >
              {button.label}
            </Link>
          );
        })}
      </span>
    </div>
  );
}