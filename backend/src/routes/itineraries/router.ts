import { Router } from 'express';
import { ItineraryController } from './controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/save-itinerary', authenticateToken, ItineraryController.saveItinerary.bind(ItineraryController));

router.get('/get-itineraries', authenticateToken, ItineraryController.getItineraries.bind(ItineraryController));

router.delete('/delete-itinerary/:itineraryId', authenticateToken, ItineraryController.deleteItinerary.bind(ItineraryController));

router.delete('/delete-from-itinerary', authenticateToken, ItineraryController.deleteFromItinerary.bind(ItineraryController));


export default router;