import { SyntheticEvent, useState } from "react";
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
  MenuItem,
  Rating,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { FilterState } from "../Attractions";

interface FiltersDialogProps {
  open: boolean;
  filters: FilterState;
  onClose: () => void;
  onApply: (newFilters: FilterState) => void; // Add this line
  onResetFilters: () => void;
}

export const FiltersDialog = ({
  open,
  filters,
  onClose,
  onApply,
  onResetFilters,
}: FiltersDialogProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Handlers for filter changes
  // const handlePriceRangeChange = (_: Event, newValue: number | number[]) => {
  //   if (Array.isArray(newValue)) {
  //     setLocalFilters((prev) => ({
  //       ...prev,
  //       priceRange: newValue as [number, number], // Ensure it's a tuple
  //     }));
  //   }
  // };

  const handleMinRatingChange = (
    _: SyntheticEvent<Element, Event>,
    newValue: number | null
  ) => {
    setLocalFilters((prev) => ({ ...prev, minRating: newValue ?? 0 }));
  };

  const handleAmenityChange = (amenity: keyof FilterState["amenities"]) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  // const handleSortByChange = (event: SelectChangeEvent) => {
  //   setLocalFilters((prev) => ({
  //     ...prev,
  //     sortBy: event.target.value as FilterState["sortBy"],
  //   }));
  // };

  const handleOpenNowChange = () => {
    setLocalFilters((prev) => ({ ...prev, openNow: !prev.openNow }));
  };

  const handleApplyFilters = () => {
    onApply(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 200], // Full range
      minRating: 0,
      amenities: {
        wheelchairAccessible: false,
        goodForChildren: false,
        restroom: false,
        parkingOptions: false,
      },
      openNow: false,
      sortBy: "relevance",
    };

    setLocalFilters(defaultFilters); // Reset local state
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Filters</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Price Range */}
          <div>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={localFilters.priceRange}
              onChange={(_, newValue) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  priceRange: newValue as number[],
                }))
              }
              valueLabelDisplay="auto"
              min={0}
              max={200}
              marks={[
                { value: 0, label: "$0" },
                { value: 50, label: "$50" },
                { value: 100, label: "$100" },
                { value: 150, label: "$150" },
                { value: 200, label: "$200+" },
              ]}
            />
          </div>

          <Divider />

          {/* Minimum Rating */}
          <div>
            <Typography gutterBottom>Minimum Rating</Typography>
            <Rating
              value={localFilters.minRating}
              onChange={handleMinRatingChange}
              precision={0.5}
            />
          </div>

          <Divider />

          {/* Amenities */}
          <div>
            <Typography gutterBottom>Amenities</Typography>
            <FormGroup>
              <Stack direction="column" spacing={1}>
                {Object.entries(localFilters.amenities).map(([key, value]) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={value}
                        onChange={() =>
                          handleAmenityChange(
                            key as keyof FilterState["amenities"]
                          )
                        }
                      />
                    }
                    label={key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
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
                checked={localFilters.openNow}
                onChange={handleOpenNowChange}
              />
            }
            label="Open Now"
          />

          {/* <Divider /> */}

          {/* Sort By */}
          {/* <div>
            <Typography gutterBottom>Sort By</Typography>
            <Select
              value={localFilters.sortBy}
              onChange={handleSortByChange}
              fullWidth
            >
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="reviews">Reviews</MenuItem>
              <MenuItem value="distance">Distance</MenuItem>
            </Select>
          </div> */}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleResetFilters();
            onResetFilters();
          }}
          color="primary"
        >
          Reset
        </Button>
        <Button
          onClick={handleApplyFilters}
          color="primary"
          variant="contained"
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};
