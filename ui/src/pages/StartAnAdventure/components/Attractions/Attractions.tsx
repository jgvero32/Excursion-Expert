import { Box, Typography, Button } from "@mui/material";

interface AttractionProps {
  city: string;
  onChooseAnother: () => void;
}

export const Attractions = (props: AttractionProps) => {
  return(
    <Box sx={{ backgroundColor: '#B2D3C2', padding: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Selected City: {props.city}
          </Typography>
          <Typography>
            Great choice! We're preparing your adventure in {props.city}.
          </Typography>
          <Button
            variant="contained"
            onClick={props.onChooseAnother}
            sx={{ marginTop: 2, backgroundColor: '#424874', '&:hover': { backgroundColor: '#313557' } }}
          >
            Choose Another Location
          </Button>
        </Box>
  );
}