import { Autocomplete, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import Cities from "./Cities";

export function StartAnAdventure() {
  return (
    <div className="startAdventure">
      <Typography className="startAdventure__text">Choose a Location</Typography>
      <div className="startAdventure__container">
        <div className="startAdventure__container__content">
          <Typography className="startAdventure__container__content__text">
            Location
          </Typography>
          <Autocomplete
            className="startAdventure__container__content__textField"
            disablePortal
            size="small"
            options={Cities}
            renderInput={(params) => (
              <TextField {...params} placeholder="Enter A location" />
            )}
          />
          <FormControlLabel className="startAdventure__container__content__checkbox" control={<Checkbox />} label="Use default location" />
          <Button variant="contained" className="startAdventure__container__content__button">Next!</Button>
        </div>
      </div>
    </div>
  );
}
