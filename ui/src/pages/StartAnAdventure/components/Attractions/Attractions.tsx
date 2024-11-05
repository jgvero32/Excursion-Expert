import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, IconButton, Rating, Slider, Stack, Typography } from "@mui/material";
import { AttractionCards } from "./AttractionCards/AttractionCards";
import { ArrowCircleLeftOutlined, ArrowCircleRightOutlined, Close, FilterAlt } from "@mui/icons-material";
import { useState, useEffect, SyntheticEvent } from "react";
import { mockData } from '../../mockData';

interface AttractionProps {
  city: string;
  onChooseAnother: () => void;
}

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

interface CategoryFavorites {
  sights: string[];
  food: string[];
  nightlife: string[];
  shopping: string[];
}

export interface PlaceResponse {
  html_attributions: string[];
  results: PlaceResult[];
  status: string;
}

type StateType = 'sights' | 'food' | 'nightlife' | 'shopping';
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
  sortBy: 'relevance' | 'rating' | 'reviews' | 'distance';
}

export const Attractions = ({ city, onChooseAnother }: AttractionProps) => {
  // State management
  const [currentState, setCurrentState] = useState<StateType>('sights');
  const [favorites, setFavorites] = useState<CategoryFavorites>({
    sights: [],
    food: [],
    nightlife: [],
    shopping: []
  });
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
    sortBy: 'relevance'
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Load initial data
  useEffect(() => {
    setData(mockData);
  }, []);

  // Handle state transitions
  const handleNextState = () => {
    const stateTransitions: Record<StateType, StateType> = {
      sights: 'food',
      food: 'nightlife',
      nightlife: 'shopping',
      shopping: 'sights'
    };
    setCurrentState(stateTransitions[currentState]);
  };

  // Handle favorites
  const handleFavoriteClick = (itemId: string) => {
    setFavorites(prev => {
      const currentFavorites = prev[currentState];
      const updatedFavorites = currentFavorites.includes(itemId)
        ? currentFavorites.filter(id => id !== itemId)
        : [...currentFavorites, itemId];
      
      return {
        ...prev,
        [currentState]: updatedFavorites
      };
    });
  };

  // Handle itinerary additions
  const handleAddToItinerary = (item: PlaceResult) => {
    setItinerary(prev => {
      const exists = prev.some(i => i.place_id === item.place_id);
      if (!exists) {
        return [...prev, item];
      }
      return prev;
    });
  };

  // Get current state title
  const getStateTitle = () => {
    return `${currentState.charAt(0).toUpperCase() + currentState.slice(1)} for ${city}, Illinois`;
  };

  // Get next state label
  const getNextStateLabel = () => {
    const nextStates: Record<StateType, string> = {
      sights: 'Food',
      food: 'Nightlife',
      nightlife: 'Shopping',
      shopping: ''
    };
    return nextStates[currentState];
  };

  const handleBackNavigation = () => {
    if (currentState === 'sights') {
      onChooseAnother();
    } else {
      const previousStates: Record<StateType, StateType> = {
        food: 'sights',
        nightlife: 'food',
        shopping: 'nightlife',
        sights: 'shopping' // This case won't be used but included for completeness
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
    if (filters.sortBy !== 'relevance') count++;
    Object.values(filters.amenities).forEach(value => {
      if (value) count++;
    });
    setActiveFiltersCount(count);
  }, [filters]);

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newValue as number[]
    }));
  };

  const handleDistanceChange = (event: Event, newValue: number | number[]) => {
    setFilters(prev => ({
      ...prev,
      distance: newValue as number
    }));
  };

  const handleRatingChange = (_: SyntheticEvent<Element, Event>, newValue: number | null) => {
    setFilters(prev => ({
      ...prev,
      minRating: newValue || 0
    }));
  };

  const handleAmenityChange = (amenity: keyof FilterState['amenities']) => {
    setFilters(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
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
      sortBy: 'relevance'
    });
  };

  const getFilteredData = () => {
    if (!data.length) return [];
    
    let currentData = [...data];
    
    // Apply filters
    currentData = currentData.map(item => ({
      ...item,
      results: item.results.filter(result => {
        // Price Range Filter
        if (result.price_level !== undefined && 
            (result.price_level < filters.priceRange[0] || 
             result.price_level > filters.priceRange[1])) {
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
        if (filters.amenities.petFriendly && 
            !result.types.some(type => type.includes('pet') || type.includes('animal'))) {
          return false;
        }

        if (filters.amenities.familyFriendly && 
            !result.types.includes('family_friendly')) {
          return false;
        }

        return true;
      })
    }));

    // Apply sorting
    currentData = currentData.map(item => ({
      ...item,
      results: item.results.sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'reviews':
            return b.user_ratings_total - a.user_ratings_total;
          case 'distance':
            // You would implement distance calculation here
            return 0;
          default:
            return 0;
        }
      })
    }));

    return currentData;
  };

  const getBackLabel = () => {
    if (currentState === 'sights') {
      return 'Choose Another City';
    }
    const previousStates: Record<StateType, string> = {
      food: 'Sights',
      nightlife: 'Food',
      shopping: 'Nightlife',
      sights: ''
    };
    return previousStates[currentState];
  };



  return (
    <div className="attractions">
      <Stack className="attractions__container" direction="row" spacing={2}>
        <div className="attractions__left-section">
          <ArrowCircleLeftOutlined 
            className="attractions__arrows" 
            onClick={handleBackNavigation}
          />
          <Typography 
            variant="caption" 
            className="attractions__back-text"
            sx={{
              display: 'block',
              textAlign: 'center',
              marginTop: 1
            }}
          >
            {getBackLabel()}
          </Typography>
        </div>
        <div className="attractions__container__content">
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center" 
            sx={{ marginBottom: 2 }}
          >
            <Typography className="attractions__text">
              {getStateTitle()}
            </Typography>
            <Button
              startIcon={<FilterAlt />}
              onClick={() => setFilterDialogOpen(true)}
              variant="outlined"
              sx={{ 
                borderColor: '#413C58',
                color: '#413C58',
                '&:hover': {
                  borderColor: '#B279A7',
                  backgroundColor: 'rgba(178, 121, 167, 0.04)'
                }
              }}
            >
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </Stack>
          <AttractionCards 
            data={getFilteredData()}
            favorites={favorites[currentState]}
            onFavoriteClick={handleFavoriteClick}
            onAddToItinerary={handleAddToItinerary}
          />
        </div>
        <div className="attractions__right-section">
          <ArrowCircleRightOutlined 
            className="attractions__arrows" 
            onClick={handleNextState}
          />
          <Typography 
            variant="caption" 
            className="attractions__next-text"
            sx={{ 
              display: 'block', 
              textAlign: 'center', 
              marginTop: 1 
            }}
          >
            {getNextStateLabel()}
          </Typography>
        </div>
      </Stack>
      <Dialog 
        open={filterDialogOpen} 
        onClose={() => setFilterDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            Filters
            <IconButton onClick={() => setFilterDialogOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            {/* Price Range */}
            <div>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={filters.priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                marks={[
                  { value: 0, label: '$' },
                  { value: 1, label: '$$' },
                  { value: 2, label: '$$$' },
                  { value: 3, label: '$$$$' },
                  { value: 4, label: '$$$$$' }
                ]}
                min={0}
                max={4}
              />
            </div>

            <Divider />

            {/* Rating */}
            <div>
              <Typography gutterBottom>Minimum Rating</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Rating
                  value={filters.minRating}
                  onChange={handleRatingChange}
                  precision={0.5}
                />
                <Typography variant="body2">& up</Typography>
              </Stack>
            </div>

            <Divider />

            {/* Distance */}
            <div>
              <Typography gutterBottom>Distance</Typography>
              <Slider
                value={filters.distance}
                onChange={handleDistanceChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} km`}
                marks={[
                  { value: 1, label: '1 km' },
                  { value: 5, label: '5 km' },
                  { value: 10, label: '10 km' },
                  { value: 20, label: '20 km' }
                ]}
                min={1}
                max={20}
              />
            </div>

            <Divider />

            {/* Amenities */}
            <div>
              <Typography gutterBottom>Amenities</Typography>
              <FormGroup>
                <Stack direction="row" flexWrap="wrap">
                  {Object.entries(filters.amenities).map(([key, value]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox 
                          checked={value}
                          onChange={() => handleAmenityChange(key as keyof FilterState['amenities'])}
                        />
                      }
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      sx={{ width: '50%' }}
                    />
                  ))}
                </Stack>
              </FormGroup>
            </div>

            <Divider />

            {/* Open Now */}
            <FormControlLabel
              control={
                <Checkbox 
                  checked={filters.openNow}
                  onChange={() => setFilters(prev => ({ ...prev, openNow: !prev.openNow }))}
                />
              }
              label="Open Now"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetFilters} sx={{ color: '#413C58' }}>
            Reset All
          </Button>
          <Button 
            onClick={() => setFilterDialogOpen(false)}
            variant="contained"
            sx={{ 
              backgroundColor: '#B279A7',
              '&:hover': {
                backgroundColor: '#9b6791'
              }
            }}
          >
            Show Results
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};