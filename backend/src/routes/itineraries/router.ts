import { Router } from 'express';
import { ItineraryController } from './controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/save-itinerary', authenticateToken, ItineraryController.saveItinerary.bind(ItineraryController));

export default router;