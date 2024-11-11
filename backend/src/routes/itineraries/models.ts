// models.ts
export interface Place {
    name: string;
    rating: string;
    types: string[];
  }
  
  export interface UpdateItineraryRequest {
    username: string;
    name: string;
    places: Place[];
  }