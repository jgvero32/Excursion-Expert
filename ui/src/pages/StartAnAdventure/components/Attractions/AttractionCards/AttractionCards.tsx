import React from "react";
import { FavoriteBorder, Favorite, DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Stack,
  Typography,
  IconButton,
  Rating,
} from "@mui/material";
import { Place } from "../Attractions";

interface AttractionCardsProps {
  data: Place[];
  favorites: string[];
  onFavoriteClick: (itemId: string) => void;
  onAddToItinerary: (item: Place) => void;
  removeFromItinerary: (item: Place) => void;
  showButtons?: boolean;
  showDelete?: boolean;
  itinerary: Place[];
}

export const AttractionCards: React.FC<AttractionCardsProps> = ({
  data,
  favorites,
  onFavoriteClick,
  onAddToItinerary,
  removeFromItinerary,
  showButtons,
  showDelete,
  itinerary,
}) => {
  const formatTypes = (types: string[]): string[] => {
    return types.map((type) =>
      type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  const handleLearnMore = (place: Place) => {
    // Create a Google Maps search URL using the place's name and address
    const searchQuery = `${place.displayName?.text} ${place.formattedAddress}`;
    const encodedQuery = encodeURIComponent(searchQuery);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <Box sx={{ height: "-webkit-fill-available", overflow: "scroll" }}>
      {data.map((result, index) => {
        const itemId = `${index}`;
        const isInItinerary = itinerary.some((item) => item.id === result.id);
        return (
          <Box
            key={itemId}
            sx={{
              display: "flex",
              paddingBottom: "30px",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Card className="card">
              <CardContent
                className="card__content"
                sx={{ position: "relative" }}
              >
                <span className="card__content__container">
                  <Typography className="card__content__container__text">
                    {result.displayName?.text}
                  </Typography>
                  <Checkbox
                    icon={<FavoriteBorder />}
                    checkedIcon={
                      <Favorite className="card__content__container__fav" />
                    }
                    checked={favorites.includes(itemId)}
                    onChange={() => onFavoriteClick(itemId)}
                  />
                </span>
                <Stack direction="row" spacing={1}>
                  {formatTypes(result.types)
                    .slice(0, 4)
                    .map((tag, tagIndex) => (
                      <Chip key={tagIndex} label={tag} size="small" />
                    ))}
                </Stack>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  {!showButtons ? (
                    <Rating value={result.rating ? parseFloat(result.rating.toString()?.match(/[\d.]+/)?.[0] || "0") || 0 : 0} readOnly precision={0.5} />
                  ) : (
                    <Rating value={result.rating || 0} readOnly precision={0.5} />
                  )}
                  {result.rating ? (
                    <>
                      {!showButtons ? (
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {result.rating}
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Rating: {result.rating} ({result.userRatingCount} reviews)
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      No rating available
                    </Typography>
                  )}
                </Box>
                {showDelete && (
                  <IconButton
                    sx={{ position: "absolute", top: 50, right: 17 }}
                    onClick={() => removeFromItinerary(result)}
                  >
                    <DeleteOutline />
                  </IconButton>
                )}
              </CardContent>
            </Card>
            {showButtons && (
              <>
                <Button
                  sx={{
                    width: "152px",
                    height: "40px",
                    color: "#FFF",
                    margin: "10px",
                    textTransform: "none",
                    backgroundColor: "#413C58",
                  }}
                  onClick={() => handleLearnMore(result)}
                >
                  Learn More
                </Button>
                <Button
                  sx={{
                    width: "157px",
                    height: "40px",
                    color: "#FFF",
                    textTransform: "none",
                    backgroundColor: isInItinerary ? "#A3C4BC" : "#B279A7",
                  }}
                  onClick={() =>
                    isInItinerary
                      ? removeFromItinerary(result)
                      : onAddToItinerary(result)
                  }
                >
                  {isInItinerary ? "Unadd From Itinerary" : "Add To Itinerary"}
                </Button>
              </>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
