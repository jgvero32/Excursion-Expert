export interface Place {
    name: string;
    rating: string;
    types: string[];
  }
  
  export interface SaveItineraryRequest {
    username: string;
    itineraryName: string;
    city: string;
    places: Place[];
  }

  export interface GetItinerariesRequest {
    username: string;
  }