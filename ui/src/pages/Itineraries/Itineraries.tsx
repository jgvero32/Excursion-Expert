import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/authContext";
import {
  Typography,
  Container,
  List,
  Card,
  CardContent,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AttractionCards } from "../StartAnAdventure/components/Attractions/AttractionCards/AttractionCards";
import { Place } from "../StartAnAdventure/components/Attractions/Attractions";
import { RiseLoader } from "react-spinners";
import { DeleteOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./Itineraries.scss";

export interface Itinerary {
  id: string;
  username: string;
  city: string;
  itineraryName: string;
  places: Place[];
}

export function Itineraries() {
  const { getItineraries, deleteItinerary, deleteFromItinerary, currentUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const userItineraries = await getItineraries(
          currentUser?.username ?? ""
        );
        setItineraries(userItineraries);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItineraries();
  }, [currentUser]);

  const handleFavoriteClick = (itemId: string) => {};

  const handleAddToItinerary = (item: Place) => {};

  const handleRemoveFromItinerary = async (item: Place, itinerary: Itinerary) => {
    console.log(itinerary.places.length);
    console.log("Removing item from itinerary:", item);
    try {
      setIsLoading(true);
      
      console.log("Deleting itinerary with id:", item);
      await deleteFromItinerary(itinerary.id, item.displayName?.text ?? "");
      const updatedItinerary = await getItineraries(currentUser?.username ?? "");
      setItineraries(updatedItinerary);
      const updatedPlaces = itinerary.places.filter(
        (place) => place.displayName?.text !== item.displayName?.text
      );
      setItineraries((prev) =>
        prev.map((it) =>
          it.id === itinerary.id ? { ...it, places: updatedPlaces } : it
        )
      );

      if (updatedPlaces.length === 0) {
        handleRemoveItinerary(itinerary);
      }
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItinerary = async (item: Itinerary) => {
    try {
      setIsLoading(true);
      console.log("Deleting itinerary with id:", item.id);
      await deleteItinerary(item.id);
      setItineraries(itineraries.filter(itinerary => itinerary.id !== item.id));
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="itineraries">
    <Container>
      <Typography className="itineraries-title">Your Itineraries!</Typography>
      {isLoading ? (
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <RiseLoader color="#413C58" />
        </Container>
      ) : (
        <>
          {itineraries.length !== 0 ? (
            <List className="cards">
              {itineraries.map((itinerary) => (
                <Accordion
                  key={itinerary.id}
                  expanded={expanded === itinerary.id}
                  onChange={handleAccordionChange(itinerary.id)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${itinerary.id}-content`}
                    id={`${itinerary.id}-header`}
                  >
                    <Typography className="itinerary-name" gutterBottom>
                      {itinerary.itineraryName}
                    </Typography>
                    <DeleteOutline
                      className="delete-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItinerary(itinerary);
                      }}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ overflow: "scroll", height: "70vh" }}>
                      <AttractionCards
                        data={itinerary.places}
                        favorites={favorites}
                        onFavoriteClick={handleFavoriteClick}
                        onAddToItinerary={handleAddToItinerary}
                        removeFromItinerary={(item: Place) =>
                          handleRemoveFromItinerary(item, itinerary)
                        }
                        showButtons={false}
                        showDelete={true}
                        itinerary={itinerary.places}
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          ) : (
            <div className="no-itineraries">
              <Typography
                className="itineraries-subtitle"
                variant="h6"
                gutterBottom
              >
                No itineraries found:(
              </Typography>
              <img
                src="/vacation-cat.jpg"
                alt="Saved Itinerary"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "auto",
                  marginBottom: "20px",
                }}
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
    </div>
  );
}