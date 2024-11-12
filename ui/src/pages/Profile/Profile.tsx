import { Box, Button, TextField, Typography} from '@mui/material';
import './Profile.scss';

export function Profile() {


  return (
    <Box className="profile">
      <Box className="profile-container">
        <Typography variant="h4" className="profile-title">
          Your Profile
        </Typography>
        <Box component="form" className="profile-form">
          <Box className="profile-field">
            <TextField
              sx={{backgroundColor:"White", borderRadius: "8px"}}
              label="Username"
              name="username"
              fullWidth
            />
          </Box>
          <Box className="profile-field">
            <TextField
              sx={{backgroundColor:"White", borderRadius: "8px"}}
              label="Password"
              name="password"
              fullWidth
            />
          </Box>
          <Box className="profile-field">
            <TextField 
              sx={{backgroundColor:"White",borderRadius: "8px"}}
              label="Default Location"
              name="location"
              fullWidth
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="update-button"
            sx={{ marginTop: 2 }}
          >
            Update Profile!
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
