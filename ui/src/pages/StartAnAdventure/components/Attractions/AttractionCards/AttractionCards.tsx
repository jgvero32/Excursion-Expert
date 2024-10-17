import { FavoriteBorder, Favorite } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { mockData } from "../../../mockData";

//attentionCards takes in data as prop (food, shopping, nightlife, etc)
export const AttractionCards = () => {
  return (
    <Box sx={{ height: "-webkit-fill-available", overflow: "scroll" }}>
      {mockData.map((item, mockDataIndex) => (
        item.results.map((result, resultIndex) => (
          <Box
            key={`${mockDataIndex}-${resultIndex}`}
            sx={{
              display: "flex",
              paddingBottom: "30px",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Card className="card">
              <CardContent className="card__content">
                <span className="card__content__container">
                  <Typography className="card__content__container__text">
                    {result.name}
                  </Typography>
                  <Checkbox
                    icon={<FavoriteBorder />}
                    checkedIcon={
                      <Favorite className="card__content__container__fav" />
                    }
                  />
                </span>
                <Stack direction="row" spacing={1}>
                  {result.types?.slice(0, 4).map((tag, tagIndex) => (
                    <Chip key={tagIndex} label={tag} />
                  ))}
                </Stack>
              </CardContent>
            </Card>
            <Button
              sx={{
                width: "152px",
                height: "40px",
                color: "#FFF",
                margin: "10px",
                textTransform: "none",
                backgroundColor: "#413C58",
              }}
            >
              Learn More
            </Button>
            <Button
              sx={{
                width: "152px",
                height: "40px",
                color: "#FFF",
                textTransform: "none",
                backgroundColor: "#B279A7",
              }}
            >
              Add to itinerary
            </Button>
          </Box>
        ))
      ))}
    </Box>
  );
};
