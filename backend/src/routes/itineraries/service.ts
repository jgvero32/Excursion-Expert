import { SaveItineraryRequest, GetItinerariesRequest, Place } from './models';
import { v4 as uuidv4 } from 'uuid';

const { pool } = require("../../../dbConfig");

export class ItineraryService {
  static async saveItinerary(requestBody: SaveItineraryRequest): Promise<string> {
    // console.log('saveItinerary', requestBody);
    const itinerary = {
      username: requestBody.username,
      city: requestBody.city,
      itineraryName: requestBody.itineraryName,
      places: requestBody.places,
    };

    console.log(itinerary);
    const itineraryId = uuidv4(); // this is how to generate a unique uuid id
    const iter_add = [
      itineraryId,
      itinerary.itineraryName,
      itinerary.city,
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

    return itineraryId;
  }

  // static async getItineraries(requestBody: GetItinerariesRequest): Promise<SaveItineraryRequest[]> {
  //   // console.log('getItineraries', username);
  //   try {
  //     // ** query to get all itineraries **
  //     const [rows] = await pool.query("with full_lms as (select landmarks.*,	tags.lm_tag from landmarks left join tags on landmarks.lm_name = tags.lm_name) select i.*,  full_lms.lm_name, full_lms.maplink,	full_lms.rating,	full_lms.lm_tag from itineraries i left join full_lms on i.iter_id = full_lms.iter_id where username = $", requestBody.username); //finds all itinerary info for a given user
      
  //     // Transform the data into the SaveItineraryRequest format
  //     const itineraryMap: { [key: string]: Place[] } = {};
  //     rows.forEach((row: any) => {
  //         if (!itineraryMap[row.iter_name]) {
  //             itineraryMap[row.iter_name] = [];
  //         }
  //         itineraryMap[row.iter_name].push({
  //             name: row.lm_name,
  //             rating: row.rating,
  //             types: row.lm_tag ? [row.lm_tag] : []
  //         });
  //     });

  //     const itineraries: SaveItineraryRequest[] = Object.keys(itineraryMap).map(iterName => ({
  //         username: requestBody.username,
  //         itineraryName: iterName,
  //         city: rows.find((row: any) => row.iter_name === iterName).loc,
  //         places: itineraryMap[iterName]
  //     }));
  //     console.log(itineraries);
  //     return itineraries;
  // } catch (error) {
  //     console.error("Error getting itineraries:", error);
  //     throw error;
  // }

  // }

  static async getItineraries(requestBody: GetItinerariesRequest): Promise<SaveItineraryRequest[]> {
    try {
      const result = await pool.query(
        `with full_lms as (select landmarks.*,	tags.lm_tag from landmarks left join tags on landmarks.lm_name = tags.lm_name) select i.*,  full_lms.lm_name, full_lms.maplink,	full_lms.rating,	full_lms.lm_tag from itineraries i left join full_lms on i.iter_id = full_lms.iter_id where username = $1`, 
        [requestBody.username]
      );
  
      const rows = result.rows;
      const itineraryMap: { [key: string]: { [key: string]: Place } } = {};
  
      rows.forEach((row: any) => {
        if (!itineraryMap[row.iter_name]) {
          itineraryMap[row.iter_name] = {};
        }
        if (!itineraryMap[row.iter_name][row.lm_name]) {
          itineraryMap[row.iter_name][row.lm_name] = {
            name: row.lm_name,
            rating: row.rating,
            types: []
          };
        }
        if (row.lm_tag) {
          itineraryMap[row.iter_name][row.lm_name].types.push(row.lm_tag);
        }
      });
  
      const itineraries: SaveItineraryRequest[] = Object.keys(itineraryMap).map(iterName => ({
        username: requestBody.username,
        itineraryName: iterName,
        city: rows.find((row: any) => row.iter_name === iterName).loc,
        places: Object.values(itineraryMap[iterName]),
        id: rows.find((row: any) => row.iter_name === iterName).iter_id
      }));
  
      // console.log(itineraries);
      return itineraries;
    } catch (error) {
      console.error("Error getting itineraries:", error);
      throw error;
    }
  }

  static async deleteItinerary(iter_id: string): Promise<void> {
    console.log('deleteItinerary', iter_id);
    try {
      const result1 = await pool.query(
        "DELETE FROM tags WHERE lm_name IN (SELECT lm_name FROM landmarks WHERE iter_id = $1)", 
        [iter_id]
      );
      const result2 = await pool.query(
        "DELETE FROM landmarks WHERE iter_id = $1", 
        [iter_id]
      );
      const result3 = await pool.query(
        "DELETE FROM itineraries WHERE iter_id = $1", 
        [iter_id]
      );
      console.log("Itinerary and associated data deleted successfully");
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }

  }
}