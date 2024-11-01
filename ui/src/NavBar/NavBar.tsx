import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext"; // Adjust the import path as needed

interface NavButtons {
  label: string;
  path: string;
  backgroundColor: string;
  textColor: string;
}

const staticButtons: NavButtons[] = [
  {
    label: "About Us",
    path: "/about-us",
    backgroundColor: "",
    textColor: "",
  },
  {
    label: "Contact",
    path: "/contact-us",
    backgroundColor: "",
    textColor: "",
  },
];

const postLoginButtons: NavButtons[] = [
  {
    label: "Start an Adventure",
    path: "/start-an-adventure",
    backgroundColor: "",
    textColor: "",
  },
  {
    label: "Itineraries",
    path: "/itineraries",
    backgroundColor: "",
    textColor: "",
  },
];

const preLoginButtons: NavButtons[] = [
  {
    label: "Login",
    path: "/login",
    backgroundColor: "#413C58",
    textColor: "#FFF",
  },
  {
    label: "Register",
    path: "/register",
    backgroundColor: "#B279A7",
    textColor: "#FFF",
  },
];

export function NavBar() {
  const { authenticated } = useAuth();

  const renderButtons = (buttons: NavButtons[]) => {
    return buttons.map((button) => (
      <Link
        className="navBar__buttons"
        to={button.path}
        key={button.label}
      >
        <Button
          sx={button.backgroundColor ? {
            backgroundColor: button.backgroundColor,
            color: button.textColor,
            borderRadius: "8px"
          } : {}}
          className={!button.backgroundColor ? "navBar__buttons__text" : ""}
        >
          {button.label}
        </Button>
      </Link>
    ));
  };

  return (
    <div className="navBar">
      <Link to={"/home"} style={{textDecoration: "none"}}>
        <Typography className="navBar__text">Excursion Expert</Typography>
      </Link>
      <span>
        {/* authenticated && */renderButtons(postLoginButtons)}
        {renderButtons(staticButtons)}
        {/* !authenticated && */renderButtons(preLoginButtons)}
      </span>
    </div>
  );
}