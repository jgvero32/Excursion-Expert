import { Response } from 'express';
import { ItineraryService } from './service';
import { SaveItineraryRequest, GetItinerariesRequest } from './models';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ItineraryController {
  static async saveItinerary(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const itineraryId = await ItineraryService.saveItinerary(req.body as SaveItineraryRequest);
      res.json(itineraryId);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getItineraries(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const username = req.query.username as string;
      if (!username) {
        res.status(400).json({ message: "Username is required" });
        return;
      }
      const itineraries = await ItineraryService.getItineraries({ username });
      res.json(itineraries);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}