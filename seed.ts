import mongoose, { Types } from "mongoose";
import axios from "axios";
import User from "./src/models/user-model";
import SafeRoom from "./src/models/room-model";
import Zone from "./src/models/zone-model";
import { connectDB } from "./src/config/db";

const API_KEY = process.env.API_KEY; // Replace with your Google API key
const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const QUERY = "bomb shelter";
const GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
// Function to fetch places using Google Places API
async function fetchPlaces(lat: any, lng: any, nextPageToken: any) {
  const params: any = {
    location: `${lat},${lng}`,
    radius: 10000,
    keyword: QUERY,
    key: API_KEY,
  };
  if (nextPageToken) {
    params.pagetoken = nextPageToken;
  }

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    const errorMessage = (error as Error).message; // Type assertion
    console.error(`Error fetching places: ${errorMessage}`);
    // Retry logic can be added here
    throw error; // Re-throw the error after logging it
  }
}
async function getAddressFromLatLng(lat: number, lng: number): Promise<string> {
  try {
    const response = await axios.get(GEOCODE_BASE_URL, {
      params: {
        latlng: `${lat},${lng}`,
        key: API_KEY,
      },
    });
    const results = response.data.results;
    if (results.length > 0) {
      return results[0].formatted_address;
    } else {
      return "Address not found";
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`Error fetching address: ${errorMessage}`);
    throw error;
  }
}

async function seed() {
  await connectDB(); // Connect to your MongoDB database

  try {
    // Clear existing data
    await User.deleteMany({});
    await SafeRoom.deleteMany({});
    await Zone.deleteMany({});
    console.log("Cleared existing users, safe rooms, and zones");

    // Create default user
    const defaultUser = new User({
      email: "eladlevy42@gmail.com",
      password: "$2b$10$otym7VUoHAULD4Vlf5jPCehL9bYZ5D2JCnYJgCIbZXnNu1ScRrTMC", // Hash the password
      firstName: "Elad",
      lastName: "Levy",
      phoneNumber: "+972-50-123-4567",
      profilePicture: "path/to/profile.jpg",
      safeRooms: [],
      favorites: [],
    });

    await defaultUser.save();

    // Define grid for searching across Israel
    const gridSpacing = 0.1; // Fine-tune spacing to ensure coverage
    const latRange = { min: 29.5, max: 33.3 }; // Approximate latitudinal range of Israel
    const lngRange = { min: 34.25, max: 35.9 }; // Approximate longitudinal range of Israel

    const locations: { lat: number; lng: number }[] = [];
    for (let lat = latRange.min; lat <= latRange.max; lat += gridSpacing) {
      for (let lng = lngRange.min; lng <= lngRange.max; lng += gridSpacing) {
        locations.push({ lat, lng });
      }
    }

    let insertedCount = 0;

    // Loop through all grid locations
    for (const loc of locations) {
      let nextPageToken: string | undefined;

      do {
        const data = await fetchPlaces(loc.lat, loc.lng, nextPageToken);
        const bombShelters = data.results;
        nextPageToken = data.next_page_token;

        if (bombShelters.length === 0) {
          console.log(
            `No bomb shelters found at location (${loc.lat}, ${loc.lng})`
          );
          continue; // Move to the next location in the grid
        }

        for (const shelter of bombShelters) {
          const address = await getAddressFromLatLng(
            shelter.geometry.location.lat,
            shelter.geometry.location.lng
          );
          const city =
            address.split(",")[1] || shelter.vicinity || "Unkown City";
          const stNum = address.split(",")[0].split(" ");
          const streetNumber = stNum[stNum.length - 1] || "0";
          const st = address.split(streetNumber)[0] || "Unknown Street";
          // Check if the shelter already exists in the database
          const existingSafeRoom = await SafeRoom.findOne({
            "location.lat": shelter.geometry.location.lat,
            "location.lng": shelter.geometry.location.lng,
          });

          if (!existingSafeRoom) {
            const newSafeRoom = new SafeRoom({
              title:
                shelter.name || `Bomb Shelter at ${shelter.formatted_address}`,
              address: {
                city: city,
                street: st,
                number: streetNumber,
                floor: "0",
                apartment: "0",
              },
              location: {
                lng: shelter.geometry.location.lng,
                lat: shelter.geometry.location.lat,
              },
              images: [`path/to/image${insertedCount + 1}.jpg`],
              capacity: Math.floor(Math.random() * 30) + 10, // Random capacity between 10 and 40
              ownerId: defaultUser._id, // Assign to the default user
              description: `Bomb shelter located at ${address} in ${city}.`,
              available: true, // 80% chance of being available
              accessible: true, // 50% chance of being accessible
              isPublic: true, // Automatically set to public
            });

            await newSafeRoom.save();
            insertedCount++;
            console.log(
              `Inserted shelter ${insertedCount}: ${newSafeRoom.title}`
            );
            console.log(address, newSafeRoom.address);
          } else {
            console.log(insertedCount);
          }
        }

        // Respect API rate limits by adding a delay before making the next request
        if (nextPageToken) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } while (nextPageToken);

      // If a certain number of shelters have been inserted, you can break early
      if (insertedCount >= 20000) {
        console.log(`Reached limit of 20000 shelters, stopping early.`);
        break;
      }
    }

    console.log(`Inserted ${insertedCount} new safe rooms into the database`);

    const zones = [
      {
        name: "Metula",
        location: { lat: 33.2803, lng: 35.5731 },
        countdown: 15,
      },
      {
        name: "Kiryat Shmona",
        location: { lat: 33.2078, lng: 35.5722 },
        countdown: 15,
      },
      { name: "Tzfat", location: { lat: 32.9646, lng: 35.496 }, countdown: 30 },
      {
        name: "Rosh Pina",
        location: { lat: 32.969, lng: 35.5422 },
        countdown: 30,
      },
      {
        name: "Nahariya",
        location: { lat: 33.0078, lng: 35.0938 },
        countdown: 60,
      },
      { name: "Acre", location: { lat: 32.9233, lng: 35.0734 }, countdown: 60 },
      { name: "Haifa", location: { lat: 32.794, lng: 34.9896 }, countdown: 60 },
      {
        name: "Kiryat",
        location: { lat: 32.837, lng: 35.1063 },
        countdown: 60,
      },
      {
        name: "Tiberias",
        location: { lat: 32.7922, lng: 35.5341 },
        countdown: 60,
      },
      {
        name: "Afula",
        location: { lat: 32.6074, lng: 35.2897 },
        countdown: 60,
      },
      {
        name: "Beit Shean",
        location: { lat: 32.5018, lng: 35.4962 },
        countdown: 60,
      },
      {
        name: "Tel Aviv",
        location: { lat: 32.0853, lng: 34.7818 },
        countdown: 90,
      },
      {
        name: "Ramat Gan",
        location: { lat: 32.0823, lng: 34.8107 },
        countdown: 90,
      },
      {
        name: "Givatayim",
        location: { lat: 32.0707, lng: 34.8118 },
        countdown: 90,
      },
      {
        name: "Jerusalem",
        location: { lat: 31.7683, lng: 35.2137 },
        countdown: 90,
      },
      {
        name: "Petah Tikva",
        location: { lat: 32.084, lng: 34.8878 },
        countdown: 90,
      },
      {
        name: "Netanya",
        location: { lat: 32.3215, lng: 34.8532 },
        countdown: 60,
      },
      {
        name: "Herzliya",
        location: { lat: 32.1663, lng: 34.8436 },
        countdown: 90,
      },
      {
        name: "Ra'anana",
        location: { lat: 32.1848, lng: 34.8706 },
        countdown: 90,
      },
      {
        name: "Kfar Saba",
        location: { lat: 32.1782, lng: 34.9076 },
        countdown: 90,
      },
      {
        name: "Hod Hasharon",
        location: { lat: 32.1594, lng: 34.8994 },
        countdown: 90,
      },
      {
        name: "Rehovot",
        location: { lat: 31.8948, lng: 34.809 },
        countdown: 90,
      },
      {
        name: "Rishon LeZion",
        location: { lat: 31.973, lng: 34.7925 },
        countdown: 90,
      },
      {
        name: "Modiin",
        location: { lat: 31.898, lng: 35.0104 },
        countdown: 120,
      },
      {
        name: "Shoham",
        location: { lat: 31.9977, lng: 34.9484 },
        countdown: 120,
      },
      {
        name: "Ashdod",
        location: { lat: 31.8014, lng: 34.6435 },
        countdown: 30,
      },
      {
        name: "Ashkelon",
        location: { lat: 31.6688, lng: 34.5743 },
        countdown: 30,
      },
      {
        name: "Beersheba",
        location: { lat: 31.252, lng: 34.7915 },
        countdown: 90,
      },
      {
        name: "Sderot",
        location: { lat: 31.525, lng: 34.5951 },
        countdown: 15,
      },
      {
        name: "Netivot",
        location: { lat: 31.4207, lng: 34.5891 },
        countdown: 15,
      },
      {
        name: "Eilat",
        location: { lat: 29.5581, lng: 34.9482 },
        countdown: 180,
      },
      {
        name: "Kiryat Gat",
        location: { lat: 31.6093, lng: 34.7641 },
        countdown: 45,
      },
      { name: "Arad", location: { lat: 31.255, lng: 35.21 }, countdown: 90 },
      {
        name: "Dimona",
        location: { lat: 31.0708, lng: 35.0337 },
        countdown: 90,
      },
      {
        name: "Gaza Envelope Settlements",
        location: { lat: 31.3222, lng: 34.3334 },
        countdown: 15,
      },
      {
        name: "Re'im",
        location: { lat: 31.3697, lng: 34.4384 },
        countdown: 15,
      },
      {
        name: "Nahal Oz",
        location: { lat: 31.316, lng: 34.4375 },
        countdown: 15,
      },
      {
        name: "Kissufim",
        location: { lat: 31.3528, lng: 34.3962 },
        countdown: 15,
      },
    ];

    const insertedZones = await Zone.insertMany(zones);
    console.log(
      `Inserted ${insertedZones.length} zones into the database with countdowns`
    );

    console.log(
      "Database seeded successfully with bomb shelters and zones across Israel"
    );
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
