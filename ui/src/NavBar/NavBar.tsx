import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

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
      <Typography className="navBar__text">Excursion Expert</Typography>
      <span>
        {navButtons.map((button) => {
          return (
            <Link
              className="navBar__buttons"
              to={button.path}
              key={button.label}
            >
              <Button className="navBar__buttons__text">{button.label}</Button>
            </Link>
          );
        })}
      </span>
    </div>
  );
}