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

interface AreYouSureDeleteModalProps {
  openModal: boolean;
  onCloseStay: () => void;
  onCloseLeave: () => void;
    deleteType: string;
}

export function AreYouSureDeleteModal({ openModal, onCloseStay, onCloseLeave, deleteType }: AreYouSureDeleteModalProps) {
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
            Are you sure you want to delete this {deleteType.split(':')[0]}?
          </Typography>
          <Typography className="modal-modal-description" sx={{ mt: 2 }}>
            Deleting will delete this {deleteType} permanently.
          </Typography>
          <div className="modal-modal-buttons">
          <Button onClick={handleCloseLeave} sx={{
                    width: "152px",
                    height: "40px",
                    color: "#FFF",
                    textTransform: "none",
                    backgroundColor: "#413C58",
                  }}
                  >Delete</Button>
          <Button onClick={handleCloseStay}sx={{
                    width: "152px",
                    height: "40px",
                    color: "#FFF",
                    textTransform: "none",
                    backgroundColor: "#B279A7",
                  }} >Go Back</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}