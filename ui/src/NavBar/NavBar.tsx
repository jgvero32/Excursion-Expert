import { Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext"; // Adjust the import path as needed
import { AccountCircleOutlined } from "@mui/icons-material";
import { useState } from "react";

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
  const { authenticated, logOut, currentUser } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      handleMenuClose();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderButtons = (buttons: NavButtons[]) => {
    return buttons.map((button) => (
      <Link className="navBar__buttons" to={button.path} key={button.label}>
        <Button
          sx={
            button.backgroundColor
              ? {
                  backgroundColor: button.backgroundColor,
                  color: button.textColor,
                  borderRadius: "8px",
                }
              : {}
          }
          className={!button.backgroundColor ? "navBar__buttons__text" : ""}
        >
          {button.label}
        </Button>
      </Link>
    ));
  };

  return (
    <div className="navBar">
      <Link to={"/home"} style={{ textDecoration: "none" }}>
        <Typography className="navBar__text">Excursion Expert</Typography>
      </Link>
      <span>
        {/*authenticated && */renderButtons(postLoginButtons)}
        {renderButtons(staticButtons)}
        {/*!authenticated && */renderButtons(preLoginButtons)}
        {/*authenticated && */(
          <>
            <IconButton onClick={handleMenuOpen}>
              <AccountCircleOutlined
                sx={{
                  color: "#4B644A",
                  height: "43px",
                  width: "43px",
                }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem disabled>
                {currentUser?.firstName} {currentUser?.lastName}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </span>
    </div>
  );
}
