import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./custom-slick.css"; // Import the custom CSS file
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
    const searchQuery = `${place.displayName?.text} ${place.formattedAddress}`;
    const encodedQuery = encodeURIComponent(searchQuery);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
    window.open(mapsUrl, "_blank");
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    // adaptiveWidth: true,
    centerMode: true,
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
                    <Favorite
                    className="card__content__container__fav"
                    sx={{ color: favorites.includes(result.id) ? "pink" : "inherit" }}
                    />
                  }
                  checked={favorites.includes(result.id)}
                  onChange={() => onFavoriteClick(result.id)}
                  />
                </span>

                <Box sx={{ margin: "15px" }}>
                  {Array.isArray(result.photos) && result.photos.length > 0 ? (
                    <Slider  {...settings}>
                      {result.photos.map((photo, photoIndex) => {
                        const imageUrl = `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=150&maxWidthPx=400&key=AIzaSyBR1eomLnHl2SVyuAYZ4Cj6eCTGAsqg00I`;
                        return (
                          <img
                            className="card__content__slider"
                            key={photoIndex}
                            src={imageUrl}
                            alt={`Photo ${photoIndex}`}
                          />
                        );
                      })}
                    </Slider>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ textAlign: "center", color: "gray" }}
                    >
                      
                    </Typography>
                  )}
                </Box>

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