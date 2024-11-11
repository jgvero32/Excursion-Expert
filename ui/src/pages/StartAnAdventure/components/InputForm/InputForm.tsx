import { Autocomplete, TextField, FormControlLabel, Checkbox, Button, Typography } from "@mui/material";
import Cities from "../../Cities";
import { useState } from "react";

interface InputBarProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>, currentCity: string) => void;
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
      <Typography className="inputForm__text">
        Choose a Location
      </Typography>
      <div className="inputForm__container">
        <div className="inputForm__container__content">
          <Typography className="inputForm__container__content__text">
            Location
          </Typography>
          <form onSubmit={handleSubmit}>
            <Autocomplete
              className="inputForm__container__content__textField"
              disablePortal
              size="small"
              options={Cities}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter A location"
                />
              )}
              value={inputValue}
              onChange={(event: React.SyntheticEvent, newValue: string | null) => {
                setInputValue(newValue || "");
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              disabled={useDefaultLocation}
            />
            <FormControlLabel
              className="inputForm__container__content__checkbox"
              control={
                <Checkbox
                  checked={useDefaultLocation}
                  onChange={(e) => setUseDefaultLocation(e.target.checked)}
                />
              }
              label="Use default location"
            />
            <Button
              variant="contained"
              className="inputForm__container__content__button"
              type="submit"
              disabled={!useDefaultLocation && inputValue === ""}
            >
              Next!
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}