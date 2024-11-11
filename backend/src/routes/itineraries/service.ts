import { UpdateItineraryRequest } from './models';
import { v4 as uuidv4 } from 'uuid';

export class ItineraryService {
  static async saveItinerary(requestBody: UpdateItineraryRequest): Promise<string> {
    console.log('saveItinerary', requestBody);
    //TODO: @danny put your query here: save itinerary to database
    const itineraryId = uuidv4();
    return itineraryId;
  }
}