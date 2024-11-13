import React, { useState, useEffect } from 'react';
import { useAuth } from "../../auth/authContext";
import { Typography, Container, List, Card, CardContent, Chip, Stack, } from "@mui/material";
import { AttractionCards } from '../StartAnAdventure/components/Attractions/AttractionCards/AttractionCards';
import { Place } from '../StartAnAdventure/components/Attractions/Attractions';
import { Button } from '@mui/material';
import { RiseLoader } from "react-spinners";
import { DeleteOutline, } from "@mui/icons-material";
import { useNavigate} from "react-router-dom";
import "./Itineraries.scss";

export interface Itinerary {
  id: string;
  username: string;
  city: string;
  itineraryName: string;
  places: Place[];
}

export function Itineraries() {
  const { getItineraries, currentUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const userItineraries = await getItineraries(currentUser?.username ?? "");
        // console.log("userItineraries", userItineraries);
        setItineraries(userItineraries);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItineraries();
  }, [currentUser]);

  const handleFavoriteClick = (itemId: string) => {
  };

  const handleAddToItinerary = (item: Place) => {
  };

  const handleItineraryClick = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary);
  };

  const handleRemoveFromItinerary = (item: Place) => {
    //TODO: write remove from itinerary functionality
  };

  return (
    <Container>
      <Typography className="itineraries-title">Your Itineraries!</Typography>
      {isLoading ? (
        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <RiseLoader color="#413C58" />
        </Container>
      ) : selectedItinerary ? ( // this is for when an itinerary is selected and we should see all itineraries
        <>
          <Typography className="itinerary-name" variant="h5" gutterBottom>
            {selectedItinerary.itineraryName}
          </Typography>
          <AttractionCards
            data={selectedItinerary.places}
            favorites={favorites}
            onFavoriteClick={handleFavoriteClick}
            onAddToItinerary={handleAddToItinerary}
            removeFromItinerary={(item: Place) => 
              handleRemoveFromItinerary(item)
            }
            showButtons={false}
            showDelete={true}
          />
          <div className="button-container" >
            <Button className="button" onClick={() => setSelectedItinerary(null)}>Back to Itineraries</Button>
          </div>
        </>
      ) : ( // this is for when no itinerary is selected aka we're only seeing itineraries 
        <>
        {itineraries.length !== 0 ? (
        <List className="cards">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="card" onClick={() => handleItineraryClick(itinerary)} sx={{ mb: 2 }}>
              <CardContent className="card__content">
                <span className="card__content__container">
                  <Typography className="card__content__container__text">
                  {itinerary.itineraryName}
                  </Typography>
                  <DeleteOutline className="delete-icon"/>
                </span>
                <Stack direction="row" spacing={1}>
                  <Chip 
                    key={itinerary.id} 
                    label={itinerary.city}
                    size="small"
                  />
              </Stack>
              </CardContent>
            </Card>
          ))}
        </List>
        ) : (
            <div className="no-itineraries">
            <Typography className="itineraries-subtitle" variant="h6" gutterBottom>
              No itineraries found:(
            </Typography>
            <img 
              src="/vacation-cat.jpg" 
              alt="Saved Itinerary" 
              style={{ width: '100%', maxWidth: '400px', height: 'auto', marginBottom: '20px' }}
            />
            <Button 
              className="button" 
              variant="contained" 
              color="primary" 
              onClick={() => navigate("/start-an-adventure")}
            >
              Create an Itinerary!
            </Button>
            </div>
        )}
        </>
      )}
    </Container>
  );
}