import { UpdateItineraryRequest } from './models';
import { v4 as uuidv4 } from 'uuid';

const { pool } = require("../../../dbConfig");

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
    const iter_add = [
      itineraryId,
      itinerary.city,
      itinerary.itineraryName,
      itinerary.username
    ];
    try{
      const result = await pool.query("INSERT INTO itineraries VALUES ($1, $2, $3, $4) RETURNING *", iter_add); //creates itinerary and adds to table
      console.log("inserted itinerary: ", result.rows[0])
    } catch (error) {
        console.error("Error inserting itinerary:", error);
    }
    for (const p of itinerary.places){
      const curr = [
        p.name,
        itinerary.city,
        "https://maps.google.com/",
        p.rating,
        itineraryId
      ]
      try{
        const place = await pool.query("INSERT INTO landmarks VALUES ($1, $2, $3, $4, $5) RETURNING *", curr); //adds each landmark per itinerary
      } catch (error) {
          console.error("Error inserting landmark:", error);
      }
      for (const tag of p.types){
        const currtag = [
          p.name,
          tag
        ] 
        try{
          const ret_tag = await pool.query("INSERT INTO tags VALUES ($1, $2) RETURNING *", currtag); //adds each landmark tag per landmark
        } catch (error) {
            console.error("Error inserting tag:", error);
        }
      }
    }

    // ** query to get all itineraries **
    // try{
    //   const [user_iters] = await pool.query("with full_lms as (select landmarks.*,	tag.lm_tag from landmarks left join tags on landmarks.lm_name = tags.lm_name) select i.*,  full_lms.lm_name, full_lms.maplink,	full_lms.rating,	full_lms.tags from itineraries i left join full_lms on i.iter_id = full_lms.iter_id where username = $", itinerary.username); //finds all itinerary info for a given user
    // } catch (error) {
    //     console.error("Error inserting type:", error);
    // }


    return itineraryId;
  }
}