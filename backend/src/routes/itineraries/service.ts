import { UpdateItineraryRequest } from './models';
import { v4 as uuidv4 } from 'uuid';

export class ItineraryService {
  static async saveItinerary(requestBody: UpdateItineraryRequest): Promise<string> {
    console.log('saveItinerary', requestBody);
    const itinerary = {
      username: requestBody.username,
      city: requestBody.city,
      itineraryName: requestBody.itineraryName,
      places: requestBody.places,
    };

    console.log(itinerary);
    //TODO: @danny put your query here: save itinerary to database
    // go to models.ts to see what places contains
    // this below is in models.ts
    // export interface Place {
    //   name: string;
    //   rating: string;
    //   types: string[];
    // }

    const itineraryId = uuidv4(); // this is how to generate a unique uuid id
    return itineraryId;
  }
}