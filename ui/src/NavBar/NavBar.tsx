import { Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/authContext";
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
    label: "Home",
    path: "/home",
    backgroundColor: "",
    textColor: "",
  },
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
  const location = useLocation();
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
    console.log(location.pathname);
    return buttons.map((button) => (
      <Link className="navBar__buttons" to={button.path} key={button.label}>
        <Button
          sx={{
            backgroundColor: button.backgroundColor || "transparent",
            color: button.textColor || "inherit",
            borderRadius: button.backgroundColor ? "8px" : "none",
            borderBottom: location.pathname.includes(button.path)
              ? "3px solid #4B644A"
              : "none",
          }}
          className={!button.backgroundColor ? "navBar__buttons__text" : ""}
        >
          {button.label}
        </Button>
      </Link>
    ));
  };

  const filteredStaticButtons = authenticated
    ? staticButtons.filter((button) => button.label !== "Home")
    : staticButtons;

  return (
    <div className="navBar">
      <Link
        to={"/home"}
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          marginLeft: "10px",
        }}
      >
        <img
          src="/favicon.ico"
          alt="favicon"
          style={{ marginRight: "8px", width: "50px", height: "50px" }}
        />
        <Typography className="navBar__text">Excursion Expert</Typography>
      </Link>
      <div className="navBar__right">
        <span>
          {authenticated && renderButtons(postLoginButtons)}
          {renderButtons(filteredStaticButtons)}
          {!authenticated && renderButtons(preLoginButtons)}
          {authenticated && (
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
                <MenuItem disabled>{currentUser?.username}</MenuItem>
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
    </div>
  );
}
