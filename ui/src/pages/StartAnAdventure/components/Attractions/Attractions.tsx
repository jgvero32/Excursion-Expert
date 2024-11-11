import {
  Button,
  Card,
  CardContent,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { AttractionCards } from "./AttractionCards/AttractionCards";
import {
  ArrowCircleLeftOutlined,
  ArrowCircleRightOutlined,
  DeleteOutline,
  FilterAlt,
} from "@mui/icons-material";
import { useState, useEffect, SyntheticEvent } from "react";
import { mockData } from "../../mockData";
import { FiltersDialog } from "./FiltersDialog/FiltersDialog";
import { useAuth } from '../../../../auth/authContext';
import { RiseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";



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
interface Location {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: Location;
  southwest: Location;
}

interface Geometry {
  location: Location;
  viewport: Viewport;
}

interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export interface PlaceResult {
  business_status: string;
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Photo[];
  place_id: string;
  rating: number;
  reference: string;
  types: string[];
  user_ratings_total: number;
  vicinity: string;
  price_level?: number;
}

export interface PlaceResponse {
  html_attributions: string[];
  results: PlaceResult[];
  status: string;
}

type StateType = "sights" | "food" | "nightlife" | "shopping" | "finalize" | "savedItinerary";
interface FilterState {
  priceRange: number[];
  minRating: number;
  distance: number;
  amenities: {
    parking: boolean;
    wheelchairAccessible: boolean;
    publicTransit: boolean;
    wifi: boolean;
    restrooms: boolean;
    familyFriendly: boolean;
    petFriendly: boolean;
  };
  openNow: boolean;
  sortBy: "relevance" | "rating" | "reviews" | "distance";
}

export const Attractions = ({ city, onChooseAnother }: AttractionProps) => {
  // State management
  const [currentState, setCurrentState] = useState<StateType>("sights");
  const [data, setData] = useState<PlaceResponse[]>([]);
  const [itinerary, setItinerary] = useState<PlaceResult[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 4],
    minRating: 0,
    distance: 5,
    amenities: {
      parking: false,
      wheelchairAccessible: false,
      publicTransit: false,
      wifi: false,
      restrooms: false,
      familyFriendly: false,
      petFriendly: false,
    },
    openNow: false,
    sortBy: "relevance",
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { saveItinerary, currentUser } = useAuth();
  const [isItinerarySaved, setIsItinerarySaved] = useState(true);

  const navigate = useNavigate();
  // Load initial data
  useEffect(() => {
    setData(mockData);
  }, []);

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

  // Handle itinerary additions
  const handleAddToItinerary = (item: PlaceResult) => {
    setItinerary((prev) => {
      const exists = prev.some((i) => i.place_id === item.place_id);
      if (!exists) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const handleSaveItinerary =  async () => {
    // Save itinerary to backend
    setIsLoading(true);

    const formatedItinerary = {
      username: currentUser?.username,
      itineraryName: "intinerary-placeholder-name",
      places: itinerary.map((place: PlaceResult) => ({
        name: place.name,
        rating: `Rating: ${place.rating} (${place.user_ratings_total} reviews)`,
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
  }

  // Get current state title
  const getStateTitle = () => {
    if (currentState === "savedItinerary") {
      return "Yay, you saved an itinerary!";
    }
    return `${
      currentState.charAt(0).toUpperCase() + currentState.slice(1)
    } for ${city}, Illinois`;
  };

  // Get next state label
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

  useEffect(() => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 4) count++;
    if (filters.minRating > 0) count++;
    if (filters.distance !== 5) count++;
    if (filters.openNow) count++;
    if (filters.sortBy !== "relevance") count++;
    Object.values(filters.amenities).forEach((value) => {
      if (value) count++;
    });
    setActiveFiltersCount(count);
  }, [filters]);

  const handlePriceRangeChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: newValue as number[],
    }));
  };

  const handleDistanceChange = (event: Event, newValue: number | number[]) => {
    setFilters((prev) => ({
      ...prev,
      distance: newValue as number,
    }));
  };

  const handleRatingChange = (
    _: SyntheticEvent<Element, Event>,
    newValue: number | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      minRating: newValue || 0,
    }));
  };

  const handleAmenityChange = (amenity: keyof FilterState["amenities"]) => {
    setFilters((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 4],
      minRating: 0,
      distance: 5,
      amenities: {
        parking: false,
        wheelchairAccessible: false,
        publicTransit: false,
        wifi: false,
        restrooms: false,
        familyFriendly: false,
        petFriendly: false,
      },
      openNow: false,
      sortBy: "relevance",
    });
  };

  const getFilteredData = () => {
    if (!data.length) return [];

    const typeFilterMap: Record<StateType, string> = {
      sights: "point_of_interest",
      food: "food",
      nightlife: "tourist_attraction",
      shopping: "store",
      finalize: "",
      savedItinerary: "",
    };
    const filterType = typeFilterMap[currentState];

    let currentData = [...data];

    // Apply filters
    currentData = currentData.map((item) => ({
      ...item,
      results: item.results.filter((result) => {
        // Page-specific Type Filter
        if (!result.types.includes(filterType)) {
          return false;
        }

        // Price Range Filter
        if (
          result.price_level !== undefined &&
          (result.price_level < filters.priceRange[0] ||
            result.price_level > filters.priceRange[1])
        ) {
          return false;
        }

        // Rating Filter
        if (result.rating < filters.minRating) {
          return false;
        }

        // Open Now Filter
        if (filters.openNow && result.opening_hours?.open_now === false) {
          return false;
        }

        // Amenity Filters
        if (
          filters.amenities.petFriendly &&
          !result.types.some(
            (type) => type.includes("pet") || type.includes("animal")
          )
        ) {
          return false;
        }

        if (
          filters.amenities.familyFriendly &&
          !result.types.includes("family_friendly")
        ) {
          return false;
        }

        return true;
      }),
    }));

    // Apply sorting
    currentData = currentData.map((item) => ({
      ...item,
      results: item.results.sort((a, b) => {
        switch (filters.sortBy) {
          case "rating":
            return b.rating - a.rating;
          case "reviews":
            return b.user_ratings_total - a.user_ratings_total;
          case "distance":
            // You would implement distance calculation here
            return 0;
          default:
            return 0;
        }
      }),
    }));

    return currentData;
  };

  const getBackLabel = () => {
    if (currentState === "sights") {
      return "Choose Another City";
    }
    const previousStates: Record<StateType, string> = {
      food: "Sights",
      nightlife: "Food",
      shopping: "Nightlife",
      sights: "",
      finalize: "Shopping",
      savedItinerary: "Finalize",
    };
    return previousStates[currentState];
  };

  return (
    <div className="attractions">
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
                sx={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 1,
                }}
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
                : getStateTitle()}
            </Typography>
            {(currentState !== "finalize" && currentState !== "savedItinerary") && (
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
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            )}
          </Stack>

          {currentState === "savedItinerary" && (
            <div>
              <img src="/balloons.jpg" alt="Balloons" className="balloons-image" />
                <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
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
            <div>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Selected Locations ({itinerary.length})
              </Typography>
              {itinerary.map((item) => (
                <Card key={item.place_id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <div>
                      {item.types.map((type) => (
                        <Typography
                          key={type}
                          variant="body2"
                          color="textSecondary"
                          component="span"
                          sx={{ marginRight: 1 }}
                        >
                          {type}
                        </Typography>
                      ))}
                    </div>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {`Rating: ${item.rating} (${item.user_ratings_total} reviews)`}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        setItinerary((prev) =>
                          prev.filter((i) => i.place_id !== item.place_id)
                        );
                      }}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#413C58",
                  "&:hover": {
                    backgroundColor: "#302c41",
                  },
                }}
                onClick={() => {
                  handleSaveItinerary();
                }}
              >
                Save Itinerary
              </Button>
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <RiseLoader color="#413C58" />
                </div>
              )}
            </div>
          ) : (
            <AttractionCards
              data={getFilteredData()}
              onAddToItinerary={handleAddToItinerary}
              favorites={[]}
              onFavoriteClick={function (itemId: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          )}
        </div>
        <div className="attractions__right-section">
        {currentState !== "savedItinerary" && (
          <div>
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
              sx={{
                display: "block",
                textAlign: "center",
                marginTop: 1,
              }}
            >
              {getNextStateLabel()}
            </Typography>
          </div>
        )}
        </div>
      </Stack>
      <FiltersDialog
        open={filterDialogOpen}
        filters={filters}
        onClose={() => setFilterDialogOpen(false)}
        onPriceRangeChange={handlePriceRangeChange}
        onDistanceChange={handleDistanceChange}
        onRatingChange={handleRatingChange}
        onAmenityChange={handleAmenityChange}
        onOpenNowChange={() => setFilters(prev => ({ ...prev, openNow: !prev.openNow }))}
        onResetFilters={resetFilters}
      />
    </div>
  );
};
