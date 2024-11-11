import React from 'react';

const YouSavedItinerary: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Your Saved Itinerary</h1>
            <img 
                src="https://via.placeholder.com/600x400" 
                alt="Saved Itinerary" 
                style={{ width: '100%', maxWidth: '600px', height: 'auto', marginBottom: '20px' }}
            />
            <div>
                <button color="primary" style={{ marginRight: '10px' }}>
                    Edit Itinerary
                </button>
                <button color="secondary">
                    Delete Itinerary
                </button>
            </div>
        </div>
    );
};

export default YouSavedItinerary;