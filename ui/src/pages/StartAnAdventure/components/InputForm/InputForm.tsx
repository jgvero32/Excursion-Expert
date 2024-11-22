import {
  Autocomplete,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
} from "@mui/material";
import Cities from "../../Cities";
import { useState } from "react";

interface InputBarProps {
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    currentCity: string
  ) => void;
}

export const InputForm = ({ onSubmit }: InputBarProps) => {
  const [inputValue, setInputValue] = useState("");
  const [useDefaultLocation, setUseDefaultLocation] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event, inputValue);
  };

  return (
    <div className="inputForm">
      <Typography className="inputForm__text">Choose a Location</Typography>
      <div className="inputForm__container">
        <div className="inputForm__container__content">
          <Typography className="inputForm__container__content__text">
            Location
          </Typography>
          <form onSubmit={handleSubmit} className="inputForm__form">
            <Autocomplete
              className="inputForm__container__content__textField"
              disablePortal
              size="small"
              options={Cities}
              renderInput={(params) => (
                <TextField {...params} placeholder="Enter A location" />
              )}
              value={inputValue}
              onChange={(
                event: React.SyntheticEvent,
                newValue: string | null
              ) => {
                setInputValue(newValue || "");
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              disabled={useDefaultLocation}
              ListboxProps={{
                sx: {
                  "& .MuiAutocomplete-option": {
                    color: "#413C58",
                  },
                  '& .MuiAutocomplete-option[data-focus="true"]': {
                    backgroundColor: "#B279A7",
                  },
                  '& .MuiAutocomplete-option[aria-selected="true"]': {
                    backgroundColor: "#B279A7",
                  },
                },
              }}
              sx={{
                "&:hover .MuiOutlinedInput-root": {
                  borderColor: "#413C58",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#B279A7",
                },
                "& .MuiOutlinedInput-root": {
                  borderColor: "#413C58",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#B279A7",
                },
                '& .MuiAutocomplete-inputRoot[class*="Mui-focused"] .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: "#B279A7",
                  },
              }}
            />
            <FormControlLabel
              className="inputForm__container__content__checkbox"
              control={
                <Checkbox
                  checked={useDefaultLocation}
                  onChange={(e) => setUseDefaultLocation(e.target.checked)}
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "white",
                    },
                  }}
                />
              }
              label="Use default location"
            />
            <div className="inputForm__buttonContainer">
              <Button
                fullWidth
                variant="contained"
                className="inputForm__container__content__button"
                type="submit"
                disabled={!useDefaultLocation && inputValue === ""}
              >
                Next!
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
