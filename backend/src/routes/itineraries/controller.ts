import { Response } from 'express';
import { ItineraryService } from './service';
import { UpdateItineraryRequest } from './models';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ItineraryController {
  static async saveItinerary(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const itineraryId = await ItineraryService.saveItinerary(req.body as UpdateItineraryRequest);
      res.json(itineraryId);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}