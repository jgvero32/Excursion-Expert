import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/authContext";
import {
  Typography,
  Container,
  List,
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
import { AreYouSureDeleteModal } from "../StartAnAdventure/components/AreYouSureModal/AreYouSureDeleteModal";
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
  const [wantsToLeave, setWantsToLeave] = useState(false);
  const [deleteType, setDeleteType] = useState<string>("");
  const [itineraryToDelete, setItineraryToDelete] = useState<Itinerary | null>(null);
  const [placeToDelete, setPlaceToDelete] = useState<{ place: Place | null, itinerary: Itinerary | null }>({ place: null, itinerary: null });

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
    try {
      setIsLoading(true);
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
        await deleteItinerary(itinerary.id);
        setItineraries(itineraries.filter(it => it.id !== itinerary.id));
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

  const handleCloseModal = () => {
    setWantsToLeave(false);
  };

  const onChooseAnother = async () => {
    if (deleteType.includes("itinerary")) {
      await handleRemoveItinerary(itineraryToDelete as Itinerary);
    } else if (deleteType.includes("place")) {
      const { place, itinerary } = placeToDelete;
      await handleRemoveFromItinerary(place as Place, itinerary as Itinerary);
    }

    setDeleteType("");
    setPlaceToDelete({ place: null, itinerary: null });
    setItineraryToDelete(null);
    setWantsToLeave(false);
  };

  return (
    <div className="itineraries">
      {wantsToLeave && (
        <div>
          <AreYouSureDeleteModal 
            openModal={wantsToLeave}     
            onCloseStay={handleCloseModal}      
            onCloseLeave={onChooseAnother} 
            deleteType={deleteType}
          />
        </div>
      )}
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
                          setWantsToLeave(true);
                          setDeleteType("itinerary: " + itinerary.itineraryName);
                          setItineraryToDelete(itinerary);
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
                          removeFromItinerary={(item: Place) => {
                            setDeleteType("place: " + item.displayName?.text);
                            setWantsToLeave(true);
                            setPlaceToDelete({ place: item, itinerary: itinerary });
                          }}
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