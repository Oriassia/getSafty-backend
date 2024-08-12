
// import mongoose, { Types } from "mongoose";
// import axios from "axios";
// import User from "./src/models/user-model"; // Adjust the import path according to your project structure
// import SafeRoom from "./src/models/room-model"; // Adjust the import path according to your project structure
// import { connectDB } from "./src/config/db"; // Adjust the import path according to your project structure

// const API_KEY = 'AIzaSyDwY1nKLe_qB7XyA6_8uBsBkOG_uNdtxgg'; // Replace with your Google API key
// const BASE_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
// const QUERY = 'bomb shelter';

// async function fetchPlaces(nextPageToken?: string) {
//     const params: any = {
//         query: QUERY,
//         key: API_KEY,
//     };
//     if (nextPageToken) {
//         params.pagetoken = nextPageToken;
//     }

//     const response = await axios.get(BASE_URL, { params });
//     return response.data;
// }

// async function getAllBombShelters() {
//     let results: any[] = [];
//     let nextPageToken: string | undefined;

//     do {
//         const data = await fetchPlaces(nextPageToken);
//         results = results.concat(data.results);
//         nextPageToken = data.next_page_token;
//         console.log(
//             `Fetched ${data.results.length} shelters, nextPageToken: ${nextPageToken}`
//         );
//         if (nextPageToken)
//             await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay to avoid API rate limits
//     } while (nextPageToken);

//     return results;
// }

// async function seed() {
//     await connectDB(); // Connect to your MongoDB database

//     try {
//         // Clear existing data
//         await User.deleteMany({});
//         await SafeRoom.deleteMany({});
//         console.log("Cleared existing users and safe rooms");

//         // Fetch bomb shelters data from the Google Places API
//         const bombShelters = await getAllBombShelters();
//         console.log(`Total bomb shelters fetched: ${bombShelters.length}`);

//         if (bombShelters.length === 0) {
//             console.log('No bomb shelters found, skipping seeding process');
//             process.exit(0);
//         }

//         console.log("bombShelters", bombShelters);


//         // Extract unique cities from the bomb shelter data, filtering out undefined or invalid entries
//         const cities = [
//             ...new Set(
//                 bombShelters
//                     .map((shelter: any) => {
//                         const city =
//                             shelter.plus_code?.compound_code?.split(", ")[1] ||
//                             shelter.formatted_address?.split(", ")[1] ||
//                             "Unknown City";
//                         return city;
//                     })
//                     .filter(Boolean)
//             ),
//         ];

//         console.log(`Cities identified: ${cities.join(", ")}`);

//         // Create a user for each city
//         const cityUsers = await Promise.all(
//             cities.map(async (city) => {
//                 const cityUser = new User({
//                     email: `${city.toLowerCase().replace(/\s/g, "")}@municipality.com`,
//                     password: "securepassword123", // Remember to hash passwords in production
//                     firstName: city,
//                     lastName: "Municipality",
//                     phoneNumber: "+972-50-000-0000",
//                     profilePicture: `path/to/${city
//                         .toLowerCase()
//                         .replace(/\s/g, "")}.jpg`,
//                 });
//                 return cityUser.save();
//             })
//         );

//         // Create a map of city names to ObjectIds
//         const cityUserMap = cityUsers.reduce<Record<string, Types.ObjectId>>(
//             (map, user) => {
//                 map[user.firstName] = user._id as Types.ObjectId;
//                 return map;
//             },
//             {}
//         );

//         console.log("City users created:", cityUserMap);

//         // Create SafeRooms based on bomb shelter data and city associations
//         const safeRooms = await SafeRoom.insertMany(
//             bombShelters.map((shelter: any, index: number) => {
//                 const city =
//                     shelter.plus_code?.compound_code?.split(", ")[1] ||
//                     shelter.formatted_address?.split(", ")[1] ||
//                     "Unknown City";
//                 return {
//                     title: shelter.name || `Bomb Shelter at ${shelter.formatted_address}`,
//                     address: {
//                         city: city,
//                         street: shelter.formatted_address.split(", ")[0] || "Unknown",
//                         number: "N/A",
//                         floor: index % 4 === 0 ? "1" : "B",
//                         apartment: index % 4 === 0 ? "3" : "2",
//                     },
//                     location: {
//                         lng: shelter.geometry.location.lng,
//                         lat: shelter.geometry.location.lat,
//                     },
//                     images: [`path/to/image${index + 1}.jpg`],
//                     capacity: Math.floor(Math.random() * 30) + 10, // Random capacity between 10 and 40
//                     ownerId: cityUserMap[city] || cityUserMap["Tel Aviv"], // Default to Tel Aviv if city not found
//                     description: `Bomb shelter located at ${shelter.formatted_address} in ${city}.`,
//                     available: Math.random() > 0.2, // 80% chance of being available
//                     accessible: Math.random() > 0.5, // 50% chance of being accessible
//                     isPublic: Math.random() > 0.3, // 70% chance of being public
//                 };
//             })
//         );

//         console.log(`Inserted ${safeRooms.length} safe rooms into the database`);

//         console.log(
//             "Database seeded successfully with bomb shelters across Israel"
//         );
//         process.exit(0);
//     } catch (error) {
//         console.error("Error seeding database:", error);
//         process.exit(1);
//     }
// }

// seed();

import mongoose, { Types } from "mongoose";
import axios from "axios";
import User from "./src/models/user-model"; // Adjust the import path according to your project structure
import SafeRoom from "./src/models/room-model"; // Adjust the import path according to your project structure
import Zone from "./src/models/zone-model"; // Import your Zone model
import { connectDB } from "./src/config/db"; // Adjust the import path according to your project structure

const API_KEY = 'AIzaSyDwY1nKLe_qB7XyA6_8uBsBkOG_uNdtxgg'; // Replace with your Google API key
const BASE_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const QUERY = 'bomb shelter';

async function fetchPlaces(nextPageToken?: string) {
    const params: any = {
        query: QUERY,
        key: API_KEY,
    };
    if (nextPageToken) {
        params.pagetoken = nextPageToken;
    }

    const response = await axios.get(BASE_URL, { params });
    return response.data;
}

async function getAllBombShelters() {
    let results: any[] = [];
    let nextPageToken: string | undefined;

    do {
        const data = await fetchPlaces(nextPageToken);
        results = results.concat(data.results);
        nextPageToken = data.next_page_token;
        console.log(
            `Fetched ${data.results.length} shelters, nextPageToken: ${nextPageToken}`
        );
        if (nextPageToken)
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay to avoid API rate limits
    } while (nextPageToken);

    return results;
}

async function seed() {
    await connectDB(); // Connect to your MongoDB database

    try {
        // Clear existing data
        await User.deleteMany({});
        await SafeRoom.deleteMany({});
        await Zone.deleteMany({});
        console.log("Cleared existing users, safe rooms, and zones");

        // Fetch bomb shelters data from the Google Places API
        const bombShelters = await getAllBombShelters();
        console.log(`Total bomb shelters fetched: ${bombShelters.length}`);

        if (bombShelters.length === 0) {
            console.log('No bomb shelters found, skipping seeding process');
            process.exit(0);
        }

        console.log("bombShelters", bombShelters);

        // Extract unique cities from the bomb shelter data, filtering out undefined or invalid entries
        const cities = [
            ...new Set(
                bombShelters
                    .map((shelter: any) => {
                        const city =
                            shelter.plus_code?.compound_code?.split(", ")[1] ||
                            shelter.formatted_address?.split(", ")[1] ||
                            "Unknown City";
                        return city;
                    })
                    .filter(Boolean)
            ),
        ];

        console.log(`Cities identified: ${cities.join(", ")}`);

        // Create a user for each city
        const cityUsers = await Promise.all(
            cities.map(async (city) => {
                const cityUser = new User({
                    email: `${city.toLowerCase().replace(/\s/g, "")}@municipality.com`,
                    password: "securepassword123", // Remember to hash passwords in production
                    firstName: city,
                    lastName: "Municipality",
                    phoneNumber: "+972-50-000-0000",
                    profilePicture: `path/to/${city
                        .toLowerCase()
                        .replace(/\s/g, "")}.jpg`,
                });
                return cityUser.save();
            })
        );

        // Create a map of city names to ObjectIds
        const cityUserMap = cityUsers.reduce<Record<string, Types.ObjectId>>(
            (map, user) => {
                map[user.firstName] = user._id as Types.ObjectId;
                return map;
            },
            {}
        );

        console.log("City users created:", cityUserMap);

        // Create SafeRooms based on bomb shelter data and city associations
        const safeRooms = await SafeRoom.insertMany(
            bombShelters.map((shelter: any, index: number) => {
                const city =
                    shelter.plus_code?.compound_code?.split(", ")[1] ||
                    shelter.formatted_address?.split(", ")[1] ||
                    "Unknown City";
                return {
                    title: shelter.name || `Bomb Shelter at ${shelter.formatted_address}`,
                    address: {
                        city: city,
                        street: shelter.formatted_address.split(", ")[0] || "Unknown",
                        number: "N/A",
                        floor: index % 4 === 0 ? "1" : "B",
                        apartment: index % 4 === 0 ? "3" : "2",
                    },
                    location: {
                        lng: shelter.geometry.location.lng,
                        lat: shelter.geometry.location.lat,
                    },
                    images: [`path/to/image${index + 1}.jpg`],
                    capacity: Math.floor(Math.random() * 30) + 10, // Random capacity between 10 and 40
                    ownerId: cityUserMap[city] || cityUserMap["Tel Aviv"], // Default to Tel Aviv if city not found
                    description: `Bomb shelter located at ${shelter.formatted_address} in ${city}.`,
                    available: Math.random() > 0.2, // 80% chance of being available
                    accessible: Math.random() > 0.5, // 50% chance of being accessible
                    isPublic: Math.random() > 0.3, // 70% chance of being public
                };
            })
        );

        console.log(`Inserted ${safeRooms.length} safe rooms into the database`);

        // Add zones with countdown values
        const zones = [
            { name: 'Metula', location: { lat: 33.2803, lng: 35.5731 }, countdown: 15 },
            { name: 'Kiryat Shmona', location: { lat: 33.2078, lng: 35.5722 }, countdown: 15 },
            { name: 'Tzfat', location: { lat: 32.9646, lng: 35.4960 }, countdown: 30 },
            { name: 'Rosh Pina', location: { lat: 32.9690, lng: 35.5422 }, countdown: 30 },
            { name: 'Nahariya', location: { lat: 33.0078, lng: 35.0938 }, countdown: 60 },
            { name: 'Acre', location: { lat: 32.9233, lng: 35.0734 }, countdown: 60 },
            { name: 'Haifa', location: { lat: 32.7940, lng: 34.9896 }, countdown: 60 },
            { name: 'Kiryat', location: { lat: 32.8370, lng: 35.1063 }, countdown: 60 },
            { name: 'Tiberias', location: { lat: 32.7922, lng: 35.5341 }, countdown: 60 },
            { name: 'Afula', location: { lat: 32.6074, lng: 35.2897 }, countdown: 60 },
            { name: 'Beit Shean', location: { lat: 32.5018, lng: 35.4962 }, countdown: 60 },
            { name: 'Tel Aviv', location: { lat: 32.0853, lng: 34.7818 }, countdown: 90 },
            { name: 'Ramat Gan', location: { lat: 32.0823, lng: 34.8107 }, countdown: 90 },
            { name: 'Givatayim', location: { lat: 32.0707, lng: 34.8118 }, countdown: 90 },
            { name: 'Jerusalem', location: { lat: 31.7683, lng: 35.2137 }, countdown: 90 },
            { name: 'Petah Tikva', location: { lat: 32.0840, lng: 34.8878 }, countdown: 90 },
            { name: 'Netanya', location: { lat: 32.3215, lng: 34.8532 }, countdown: 60 },
            { name: 'Herzliya', location: { lat: 32.1663, lng: 34.8436 }, countdown: 90 },
            { name: 'Ra\'anana', location: { lat: 32.1848, lng: 34.8706 }, countdown: 90 },
            { name: 'Kfar Saba', location: { lat: 32.1782, lng: 34.9076 }, countdown: 90 },
            { name: 'Hod Hasharon', location: { lat: 32.1594, lng: 34.8994 }, countdown: 90 },
            { name: 'Rehovot', location: { lat: 31.8948, lng: 34.8090 }, countdown: 90 },
            { name: 'Rishon LeZion', location: { lat: 31.9730, lng: 34.7925 }, countdown: 90 },
            { name: 'Modiin', location: { lat: 31.8980, lng: 35.0104 }, countdown: 120 },
            { name: 'Shoham', location: { lat: 31.9977, lng: 34.9484 }, countdown: 120 },
            { name: 'Ashdod', location: { lat: 31.8014, lng: 34.6435 }, countdown: 30 },
            { name: 'Ashkelon', location: { lat: 31.6688, lng: 34.5743 }, countdown: 30 },
            { name: 'Beersheba', location: { lat: 31.2520, lng: 34.7915 }, countdown: 90 },
            { name: 'Sderot', location: { lat: 31.5250, lng: 34.5951 }, countdown: 15 },
            { name: 'Netivot', location: { lat: 31.4207, lng: 34.5891 }, countdown: 15 },
            { name: 'Eilat', location: { lat: 29.5581, lng: 34.9482 }, countdown: 180 },
            { name: 'Kiryat Gat', location: { lat: 31.6093, lng: 34.7641 }, countdown: 45 },
            { name: 'Arad', location: { lat: 31.2550, lng: 35.2100 }, countdown: 90 },
            { name: 'Dimona', location: { lat: 31.0708, lng: 35.0337 }, countdown: 90 },
            { name: 'Gaza Envelope Settlements', location: { lat: 31.3222, lng: 34.3334 }, countdown: 15 },
            { name: 'Re\'im', location: { lat: 31.3697, lng: 34.4384 }, countdown: 15 },
            { name: 'Nahal Oz', location: { lat: 31.3160, lng: 34.4375 }, countdown: 15 },
            { name: 'Kissufim', location: { lat: 31.3528, lng: 34.3962 }, countdown: 15 },
        ];

        const insertedZones = await Zone.insertMany(zones);
        console.log(`Inserted ${insertedZones.length} zones into the database with countdowns`);

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

