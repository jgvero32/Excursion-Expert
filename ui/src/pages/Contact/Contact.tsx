import { Box, Typography, TextField, Button } from "@mui/material";
import "./Contact.scss";

export function Contact() {
  return (
    <Box className="contact">
      <Typography variant="h3" className="contact__title">
        Contact Us
      </Typography>
      <Box
        component="form"
        className="contact__form"
        noValidate
        autoComplete="off"
      >
        {/* Email Field */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          className="contact__input"
          margin="normal"
        />

        {/* Message Field */}
        <TextField
          label="Message"
          variant="outlined"
          multiline
          rows={6}
          fullWidth
          className="contact__textarea"
          margin="normal"
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          className="contact__button"
          size="large"
          type="submit"
        >
          Send!
        </Button>
      </Box>
    </Box>
  );
}
