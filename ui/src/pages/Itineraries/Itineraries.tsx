import { useAuth } from "../../auth/authContext"; // Adjust the path
import { Typography, Box, Container } from "@mui/material";

export function Itineraries() {
  const { currentUser } = useAuth();

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Itineraries
        </Typography>
        <Typography variant="h6" gutterBottom>
          Hello, {currentUser?.firstName} {currentUser?.lastName}
        </Typography>
      </Box>
    </Container>
  );
}