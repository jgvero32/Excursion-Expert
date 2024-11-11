export interface Place {
    name: string;
    rating: string;
    types: string[];
  }
  
  export interface UpdateItineraryRequest {
    username: string;
    itineraryName: string;
    places: Place[];
  }