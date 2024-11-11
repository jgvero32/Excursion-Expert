import { Typography } from "@mui/material";
import "./Contact.scss";

export function Contact() {
  return(
    <div className="contact">
      <Typography className="contact__title">Contact Us</Typography>
      <Typography className="contact__content">
        contact form will go here
      </Typography>
    </div>
  );
}