import React, { useState } from 'react';
import { useAuth } from "../../auth/authContext"; // Adjust the path
import { Typography, Container } from "@mui/material";
import { AttractionCards } from '../StartAnAdventure/components/Attractions/AttractionCards/AttractionCards';
import { Place } from '../StartAnAdventure/components/Attractions/Attractions';

const mockData: Place[] = [
  {
    id: "1",
    types: ["tourist_attraction", "point_of_interest", "establishment"],
    formattedAddress: "20 W 34th St, New York, NY 10118, USA",
    location: {
      latitude: 40.748817,
      longitude: -73.985428,
    },
    rating: 4.7,
    businessStatus: "OPERATIONAL",
    userRatingCount: 12345,
    displayName: {
      text: "Empire State Building",
      languageCode: "en",
    },
    goodForChildren: true,
    priceRange: {
      startPrice: {
        currencyCode: "USD",
        units: "30",
      },
    },
    priceLevel: "3",
    restroom: true,
    accessibilityOptions: {
      wheelchairAccessibleEntrance: true,
    },
    parkingOptions: {
      freeParkingLot: true,
    },
  },
  // Add more mock places as needed
];

export function Itineraries() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<Place[]>([]);

  const handleFavoriteClick = (itemId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(itemId)
        ? prevFavorites.filter((id) => id !== itemId)
        : [...prevFavorites, itemId]
    );
  };

  const handleAddToItinerary = (item: Place) => {
    setItinerary((prevItinerary) => {
      const exists = prevItinerary.some((i) => i.id === item.id);
      if (!exists) {
        return [...prevItinerary, item];
      }
      return prevItinerary;
    });
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Itineraries
      </Typography>
      <Typography variant="h6" gutterBottom>
        Hello, {currentUser?.username}
      </Typography>
      <AttractionCards
        data={mockData}
        favorites={favorites}
        onFavoriteClick={handleFavoriteClick}
        onAddToItinerary={handleAddToItinerary}
        showButtons={false} // Pass false to hide the buttons
      />
    </Container>
  );
}