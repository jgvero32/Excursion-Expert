import { Button, Stack, Typography, Box } from "@mui/material";

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { styled } from '@mui/material/styles';
import { AttractionCards } from "./AttractionCards/AttractionCards";
import { ArrowCircleLeftOutlined, ArrowCircleRightOutlined, FilterAlt } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { mockData } from "../../mockData";
import { FiltersDialog } from "./FiltersDialog/FiltersDialog";
import { useAuth } from "../../../../auth/authContext";
import { RiseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";

interface AttractionProps {
  city: string;
  onChooseAnother: () => void;
}
//on page load hit backend 4 different queries, frontend arrays bellow
// let useState array of restaurants = 20results query hook up to current pageState(sights, nightLife, food,...)
// let useState array of sights = 20 results query
// let useState array of nightlife = 20results query
// being in page 1 "add to itinerary" update current useState array to include addedToItinerary var
// move to the next page2, then move back to page 1 and set current data to be useState array
// the array already know that this location was added to itinerary because the addedToItinerary
// if prop added then show heart button

// alternate, if the current card data is in itinerary useState array then it should show that its there. ei heart is shown. check if data === to each other

// useState currentData[] passed to card component
// start at sights set current data to sights array.
// next click: go to Food state, set current data as food array
// useState itinerary[]

// update cards component to include optional trash-can , optional buttons
// add prop is added to itinerary to card component, update data

// finalize right button CREATE backend query to save itinerary to db

// queries are done in the backend to GOOG API, figure out endpoints to make request from frontend to backend to API
// format response in backend (no need to save), send needed data to frontend. this is put in appropriate useState array

// Shared interfaces that match the Google Places API structure

type StateType =
  | "sights"
  | "food"
  | "nightlife"
  | "shopping"
  | "finalize"
  | "savedItinerary";

export interface Place {
  id: string;
  types: string[];
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  businessStatus?: string;
  userRatingCount?: number;
  displayName?: {
    text: string;
    languageCode: string;
  };
  goodForChildren?: boolean;
  priceRange?: {
    startPrice: {
      currencyCode: string;
      units: string;
    };
    endPrice?: {
      currencyCode: string;
      units: string;
    };
  };
  priceLevel?: string;
  restroom?: boolean;
  accessibilityOptions?: {
    wheelchairAccessibleEntrance?: boolean;
    wheelchairAccessibleRestroom?: boolean;
    wheelchairAccessibleSeating?: boolean;
    wheelchairAccessibleParking?: boolean;
  };
  parkingOptions?: {
    freeParkingLot?: boolean;
    paidParkingLot?: boolean;
    paidStreetParking?: boolean;
    valetParking?: boolean;
    paidGarageParking?: boolean;
  };
}

export interface FilterState {
  priceRange: number[];
  minRating: number;
  amenities: {
    parking: boolean;
    wheelchairAccessible: boolean;
    publicTransit: boolean;
    wifi: boolean;
    restrooms: boolean;
    familyFriendly: boolean;
    petFriendly: boolean;
    goodForChildren: boolean;
    restroom: boolean;
    parkingOptions: boolean;
  };
  openNow: boolean;
  sortBy: "relevance" | "rating" | "reviews" | "distance";
}

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#413C58',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#413C58',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#413C58',
    },
    '&:hover fieldset': {
      borderColor: '#B279A7',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#B279A7',
    },
  },
});

export const Attractions = ({ city, onChooseAnother }: AttractionProps) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const { saveItinerary, currentUser } = useAuth();
  const [isItinerarySaved, setIsItinerarySaved] = useState(true);
  const [currentState, setCurrentState] = useState<StateType>("sights");
  const [data, setData] = useState<Place[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [itinerary, setItinerary] = useState<Place[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 4],
    minRating: 0,
    amenities: {
      parking: false,
      wheelchairAccessible: false,
      publicTransit: false,
      wifi: false,
      restrooms: false,
      familyFriendly: false,
      petFriendly: false,
      goodForChildren: false,
      restroom: false,
      parkingOptions: false,
    },
    openNow: false,
    sortBy: "relevance", // Default sortBy value
  });

  // Predefined state-based arrays
  const [sightsData, setSightsData] = useState<Place[]>([]);
  const [foodData, setFoodData] = useState<Place[]>([]);
  const [nightlifeData, setNightlifeData] = useState<Place[]>([]);
  const [shoppingData, setShoppingData] = useState<Place[]>([]);
  const [itineraryName, setItineraryName] = useState("");
  const [noItineraryError, setNoItineraryError] = useState("");

  const navigate = useNavigate();

  const typeMapping: { [key: string]: string | null } = {
    sights: "tourist_attraction",
    food: "restaurant",
    nightlife: "night_club",
    shopping: "shopping_mall",
    finalize: null,
    savedItinerary: "",
  };
  // Load initial data

  const applyFilters = (places: Place[]) => {
    return places.filter((place) => {
      const isWithinPriceRange = place.priceLevel
        ? filters.priceRange.includes(parseInt(place.priceLevel))
        : true;
      const meetsRating = place.rating
        ? place.rating >= filters.minRating
        : true;
      const isOpenNow = filters.openNow
        ? place.businessStatus === "OPERATIONAL"
        : true;

      // Check if place meets all selected amenities criteria
      const meetsAmenities = Object.entries(filters.amenities).every(
        ([key, value]) => {
          if (value) {
            switch (key) {
              case "parking":
                return (
                  place.parkingOptions?.freeParkingLot ||
                  place.parkingOptions?.paidParkingLot
                );
              case "wheelchairAccessible":
                return place.accessibilityOptions?.wheelchairAccessibleEntrance;
              case "publicTransit":
                return place.accessibilityOptions?.wheelchairAccessibleEntrance;
              case "restrooms":
                return place.restroom === true;
              case "familyFriendly":
                return place.goodForChildren === true;
              case "goodForChildren":
                return place.goodForChildren === true;
              case "restroom":
                return place.restroom === true;
              case "parkingOptions":
                return (
                  place.parkingOptions?.freeParkingLot ||
                  place.parkingOptions?.paidParkingLot ||
                  place.parkingOptions?.paidStreetParking ||
                  place.parkingOptions?.valetParking ||
                  place.parkingOptions?.paidGarageParking
                );
              default:
                return true;
            }
          }
          return true;
        }
      );

      return isWithinPriceRange && meetsRating && isOpenNow && meetsAmenities;
    });
  };

  const formatTypes = (types: string[]): string[] => {
    return types.map(type => 
      type.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
  };

  // Data fetching and filtering based on state
  useEffect(() => {
    const filterByPageState = (pageState: StateType) => {
      const filterType = typeMapping[pageState];
      const allPlaces = mockData.flatMap((item) => item.places);
      const filteredData = filterType
        ? allPlaces.filter((place) => place.types.includes(filterType))
        : allPlaces;

      return applyFilters(filteredData); // Apply active filters
    };

    const fetchData = () => {
      const filteredData = filterByPageState(currentState);
      switch (currentState) {
        case "sights":
          setSightsData(filteredData);
          break;
        case "food":
          setFoodData(filteredData);
          break;
        case "nightlife":
          setNightlifeData(filteredData);
          break;
        case "shopping":
          setShoppingData(filteredData);
          break;
      }
      setData(filteredData);
    };

    fetchData();
  }, [currentState, filters]);

  // Handle state transitions
  const handleNextState = () => {
    const stateTransitions: Record<StateType, StateType> = {
      sights: "food",
      food: "nightlife",
      nightlife: "shopping",
      shopping: "finalize",
      finalize: "finalize",
      savedItinerary: "savedItinerary",
    };
    setCurrentState(stateTransitions[currentState]);
  };

  const handleBackNavigation = () => {
    if (currentState === "sights") {
      onChooseAnother();
    } else {
      const previousStates: Record<StateType, StateType> = {
        food: "sights",
        nightlife: "food",
        shopping: "nightlife",
        sights: "finalize",
        finalize: "shopping",
        savedItinerary: "finalize",
      };
      setCurrentState(previousStates[currentState]);
    }
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setFilterDialogOpen(false);
  };

  const handleAddToItinerary = (item: Place) => {
    setItinerary((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev : [...prev, item];
    });
  };

  const getStateTitle = () => {
    if (currentState === "savedItinerary") {
      return "Yay, you saved an itinerary!";
    }
    return `${
      currentState.charAt(0).toUpperCase() + currentState.slice(1)
    } for ${city}, Illinois`;
  };

  const getNextStateLabel = () => {
    const nextStates: Record<StateType, string> = {
      sights: "Food",
      food: "Nightlife",
      nightlife: "Shopping",
      shopping: "Finalize",
      finalize: "Save Itinerary",
      savedItinerary: "Save Itinerary",
    };
    return nextStates[currentState];
  };

  const getBackLabel = () =>
    currentState === "sights"
      ? "Choose Another City"
      : {
          food: "Sights",
          nightlife: "Food",
          shopping: "Nightlife",
          sights: "",
          finalize: "Shopping",
          savedItinerary: "",
        }[currentState];

  const handleSaveItinerary = async () => {
    // Save itinerary to backend
    if (itinerary.length === 0) {
      setNoItineraryError("Please add at least one location to your itinerary.");
      return;
    }

    setIsLoading(true);
    const formatedItinerary = {
      username: currentUser?.username,
      city: city +', Illinois',
      itineraryName: itineraryName,
      places: itinerary.map((place: Place) => ({
        name: place.displayName?.text,
        rating: `Rating: ${place.rating} (${place.userRatingCount} reviews)`,
        types: place.types,
      })),
    };
    console.log("Saving itinerary:", formatedItinerary);
    try {
      await saveItinerary(formatedItinerary);
    } catch (error) {
      console.error("Saving itinerary error:", error);
    } finally {
      setIsLoading(false);
      setIsItinerarySaved(true);
      setCurrentState("savedItinerary");
    }
  };

  const stateMapping: { [key in StateType]: number } = {
    sights: 0,
    food: 1,
    nightlife: 2,
    shopping: 3,
    finalize: 4,
    savedItinerary: 5,
  };

  const steps = ['Sights', 'Food', 'Nightlife', 'Shopping', 'Review Your Itinerary'];


  return (
    <div className="attractions">
      {currentState !== "savedItinerary" && (
     <div className="attractions__stepper">
        <Box sx={{ width: '80%' }}>
          <Stepper activeStep={stateMapping[currentState]} sx={{'.MuiStepIcon-root.Mui-completed': { color: "#B279A7" }, '.MuiStepIcon-root.Mui-active': { color: "#413C58" }, '.MuiStepIcon-root': { color: "#A3C4BC" }}}>
            {steps.map((label, index) => (
              <Step key={label}>
          <StepLabel> {label} </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </div>
      )}

      <Stack className="attractions__container" direction="row" spacing={2}>
        <div className="attractions__left-section">
          {currentState !== "savedItinerary" && (
            <div>
              <ArrowCircleLeftOutlined
              
                className="attractions__arrows"
                onClick={handleBackNavigation}
              />
              <Typography
                variant="caption"
                className="attractions__back-text"
                sx={{ display: "block", textAlign: "center", marginTop: 1 }}
              >
                {getBackLabel()}
              </Typography>
            </div>
          )}
        </div>
        <div className="attractions__container__content">
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: 2 }}
          >
            <Typography className="attractions__text">
              {currentState === "finalize"
                ? "Review Your Itinerary"
                : getStateTitle()
              }
            </Typography>
            {currentState !== "finalize" &&
              currentState !== "savedItinerary" && (
                <Button
                  startIcon={<FilterAlt />}
                  onClick={() => setFilterDialogOpen(true)}
                  variant="outlined"
                  sx={{
                    borderColor: "#413C58",
                    color: "#413C58",
                    "&:hover": {
                      borderColor: "#B279A7",
                      backgroundColor: "rgba(178, 121, 167, 0.04)",
                    },
                  }}
                >
                  Filters
                </Button>
              )}
          </Stack>

          {currentState === "savedItinerary" && (
            <div>
              <img
                src="/balloons.jpg"
                alt="Balloons"
                className="balloons-image"
              />
              <Stack
                direction="row"
                justifyContent="center"
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Button
                  sx={{
                    width: "152px",
                    height: "40px",
                    color: "#FFF",
                    textTransform: "none",
                    backgroundColor: "#413C58",
                  }}
                  onClick={() => navigate("/itineraries")}
                >
                  View Saved Itineraries
                </Button>
                <Button
                  sx={{
                    width: "152px",
                    height: "40px",
                    color: "#FFF",
                    textTransform: "none",
                    backgroundColor: "#B279A7",
                  }}
                  onClick={onChooseAnother}
                >
                  Create Another Itinerary
                </Button>
              </Stack>
            </div>
          )}
          {currentState === "finalize" ? (
          <>
            {itinerary.length !== 0 ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <div style={{ width: '60%', left: '173px' }}>
                    Selected Locations ({itinerary.length})
                  </div>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                  <CssTextField 
                    label="Enter itinerary name here" 
                    id="custom-css-outlined-input" 
                    sx={{ width: '60%', left: '173px' }}
                    value={itineraryName}
                    onChange={(e) => setItineraryName(e.target.value)}
                  />
                </Box>
                <AttractionCards
                  data={itinerary}
                  onAddToItinerary={handleAddToItinerary}
                  favorites={[]}
                  onFavoriteClick={(itemId: string) =>
                    handleAddToItinerary(
                      itinerary.find((item) => item.id === itemId)!
                    )
                  }
                  removeFromItinerary={(item: Place) => 
                    setItinerary((prev) => prev.filter((i) => i.id !== item.id))
                  }
                  showButtons={false}
                  showDelete={true}
                  itinerary={itinerary}
                />
                {isLoading && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <RiseLoader color="#413C58" />
                  </div>
                )}
              </>
            ) : (
              <>

                <Typography
                  variant="h6"
                  sx={{ display: "block", textAlign: "center", marginTop: 1 }}
                >
                  {"Please add at least one place to your itinerary."}
                </Typography>
              </>
            )}
          </>
        ) : (
          currentState !== "savedItinerary" && (
            <AttractionCards
              data={data}
              onAddToItinerary={handleAddToItinerary}
              favorites={[]}
              onFavoriteClick={(itemId: string) =>
                handleAddToItinerary(
                  itinerary.find((item) => item.id === itemId)!
                )
              }
              removeFromItinerary={(item: Place) => 
                setItinerary((prev) => prev.filter((i) => i.id !== item.id))
              }
              showButtons={true}
              itinerary={itinerary}
            />
          )
        )}
        </div>
        <div className="attractions__right-section">
          {currentState !== "savedItinerary" && (
            <div>
              {itinerary.length === 0 && currentState === "finalize" ? (
                <>
                </>
              ) : (
                <>
                  <ArrowCircleRightOutlined
                    className="attractions__arrows"
                    onClick={() => {
                      if (currentState === "finalize") {
                        handleSaveItinerary();
                      } else {
                        handleNextState();
                      }
                    }}
                  />
                  <Typography
                    variant="caption"
                    className="attractions__next-text"
                    sx={{ display: "block", textAlign: "center", marginTop: 1 }}
                  >
                    {getNextStateLabel()}
                  </Typography>
                </>
              )}
            </div>
          )}
        </div>
      </Stack>
      <FiltersDialog
        open={filterDialogOpen}
        filters={filters}
        onClose={() => setFilterDialogOpen(false)}
        onApply={handleApplyFilters}
        onResetFilters={() => {
          setFilterDialogOpen(false);
          setFilters({
            ...filters, // Reset each filter here to default
            priceRange: [0, 4],
            minRating: 0,
            amenities: {
              parking: false,
              wheelchairAccessible: false,
              publicTransit: false,
              wifi: false,
              restrooms: false,
              familyFriendly: false,
              petFriendly: false,
              goodForChildren: false,
              restroom: false,
              parkingOptions: false,
            },
            openNow: false,
            sortBy: "relevance",
          });
        }}
      />
    </div>
  );
};
