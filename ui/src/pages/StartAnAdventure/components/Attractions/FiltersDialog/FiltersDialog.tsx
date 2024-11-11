import { 
  Button, 
  Checkbox, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Divider, 
  FormControlLabel, 
  FormGroup, 
  IconButton, 
  Rating, 
  Slider, 
  Stack, 
  Typography 
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { SyntheticEvent } from "react";

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

interface FiltersDialogProps {
  open: boolean;
  filters: FilterState;
  onClose: () => void;
  onPriceRangeChange: (event: Event, newValue: number | number[]) => void;
  onDistanceChange: (event: Event, newValue: number | number[]) => void;
  onRatingChange: (_: SyntheticEvent<Element, Event>, newValue: number | null) => void;
  onAmenityChange: (amenity: keyof FilterState['amenities']) => void;
  onOpenNowChange: () => void;
  onResetFilters: () => void;
}

export const FiltersDialog = ({
  open,
  filters,
  onClose,
  onPriceRangeChange,
  onDistanceChange,
  onRatingChange,
  onAmenityChange,
  onOpenNowChange,
  onResetFilters
}: FiltersDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          Filters
          <IconButton onClick={onClose}>
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
              onChange={onPriceRangeChange}
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
                onChange={onRatingChange}
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
              onChange={onDistanceChange}
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
                        onChange={() => onAmenityChange(key as keyof FilterState['amenities'])}
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
                onChange={onOpenNowChange}
              />
            }
            label="Open Now"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onResetFilters} sx={{ color: '#413C58' }}>
          Reset All
        </Button>
        <Button 
          onClick={onClose}
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
  );
};