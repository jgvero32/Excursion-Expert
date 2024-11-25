import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './AreYouSureModal.scss'; 


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

interface AreYouSureModalProps {
  openModal: boolean;
  onCloseStay: () => void;
  onCloseLeave: () => void;
}

export function AreYouSureModal({ openModal, onCloseStay, onCloseLeave }: AreYouSureModalProps) {
  const handleCloseStay = () => {
    onCloseStay();
  };
  const handleCloseLeave = () => {
    onCloseLeave();
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseStay}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography className="modal-modal-title">
            Are you sure you want to leave?
          </Typography>
          <Typography className="modal-modal-description" sx={{ mt: 2 }}>
            Leaving this page will discard all the progress you've made in creating your itinerary.
          </Typography>
          <div className="modal-modal-buttons">
          <Button onClick={handleCloseLeave} sx={{
                    width: "152px",
                    height: "40px",
                    color: "#FFF",
                    textTransform: "none",
                    backgroundColor: "#413C58",
                  }}
                  >Leave this page</Button>
          <Button onClick={handleCloseStay}sx={{
                    width: "152px",
                    height: "40px",
                    color: "#FFF",
                    textTransform: "none",
                    backgroundColor: "#B279A7",
                  }} >Stay on this page</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}