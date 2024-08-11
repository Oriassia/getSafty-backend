// import User from './src/models/user-model'; // Adjust the import path according to your project structure
// import SafeRoom from './src/models/room-model'; // Adjust the import path according to your project structure
// import { connectDB } from './src/config/db'; // Adjust the import path according to your project structure

// async function seed() {
//     await connectDB(); // Connect to your MongoDB database

//     try {
//         // Clear existing data
//         await User.deleteMany({});
//         await SafeRoom.deleteMany({});

//         // Create Users
//         const users = await User.insertMany([
//             {
//                 email: 'john.doe@example.com',
//                 password: 'securepassword123', // Remember to hash passwords in production
//                 firstName: 'John',
//                 lastName: 'Doe',
//                 phoneNumber: '+972-50-123-4567',
//                 profilePicture: 'path/to/john.jpg',
//             },
//             {
//                 email: 'jane.doe@example.com',
//                 password: 'securepassword123', // Remember to hash passwords in production
//                 firstName: 'Jane',
//                 lastName: 'Doe',
//                 phoneNumber: '+972-50-765-4321',
//                 profilePicture: 'path/to/jane.jpg',
//             },
//             {
//                 email: 'michael.smith@example.com',
//                 password: 'securepassword123',
//                 firstName: 'Michael',
//                 lastName: 'Smith',
//                 phoneNumber: '+972-50-111-2222',
//                 profilePicture: 'path/to/michael.jpg',
//             },
//             {
//                 email: 'sarah.connor@example.com',
//                 password: 'securepassword123',
//                 firstName: 'Sarah',
//                 lastName: 'Connor',
//                 phoneNumber: '+972-50-333-4444',
//                 profilePicture: 'path/to/sarah.jpg',
//             },
//             {
//                 email: 'david.johnson@example.com',
//                 password: 'securepassword123',
//                 firstName: 'David',
//                 lastName: 'Johnson',
//                 phoneNumber: '+972-50-555-6666',
//                 profilePicture: 'path/to/david.jpg',
//             },
//         ]);

//         // Array of addresses and coordinates for Tel Aviv bomb shelters
//         const bombShelterLocations = [
//             { street: 'Dizengoff', number: '123', lng: 34.7748, lat: 32.0853 },
//             { street: 'Allenby', number: '45', lng: 34.7688, lat: 32.0653 },
//             { street: 'Rothschild Blvd', number: '22', lng: 34.7797, lat: 32.0627 },
//             { street: 'Ben Yehuda', number: '76', lng: 34.7718, lat: 32.0856 },
//             { street: 'King George', number: '33', lng: 34.7739, lat: 32.0751 },
//             { street: 'Herzl', number: '12', lng: 34.7645, lat: 32.0558 },
//             { street: 'Florentin', number: '7', lng: 34.7679, lat: 32.0564 },
//             { street: 'Shenkin', number: '9', lng: 34.7764, lat: 32.0689 },
//             { street: 'Bograshov', number: '10', lng: 34.7701, lat: 32.0801 },
//             { street: 'Yarkon', number: '50', lng: 34.7649, lat: 32.0884 },
//             { street: 'Ibn Gabirol', number: '120', lng: 34.7820, lat: 32.0860 },
//             { street: 'Levinsky', number: '11', lng: 34.7735, lat: 32.0622 },
//             { street: 'Nahalat Binyamin', number: '18', lng: 34.7722, lat: 32.0650 },
//             { street: 'Carlebach', number: '21', lng: 34.7808, lat: 32.0675 },
//             { street: 'HaMasger', number: '33', lng: 34.7802, lat: 32.0628 },
//             { street: 'Menachem Begin', number: '38', lng: 34.7819, lat: 32.0623 },
//             { street: 'Arlozorov', number: '25', lng: 34.7804, lat: 32.0865 },
//             { street: 'Weizmann', number: '8', lng: 34.7829, lat: 32.0827 },
//             { street: 'Trumpeldor', number: '15', lng: 34.7694, lat: 32.0735 },
//             { street: 'Nordau', number: '18', lng: 34.7730, lat: 32.0965 },
//             { street: 'HaYarkon', number: '66', lng: 34.7698, lat: 32.0870 },
//             { street: 'Frishman', number: '5', lng: 34.7715, lat: 32.0825 },
//             { street: 'Mazel Tov', number: '1', lng: 34.7640, lat: 32.0700 },
//             { street: 'Ben Gurion', number: '39', lng: 34.7741, lat: 32.0810 },
//             { street: 'Yehuda HaMaccabi', number: '20', lng: 34.7840, lat: 32.0940 },
//             { street: 'Gordon', number: '8', lng: 34.7708, lat: 32.0818 },
//             { street: 'Pinsker', number: '13', lng: 34.7710, lat: 32.0750 },
//             { street: 'Allenby', number: '92', lng: 34.7685, lat: 32.0620 },
//             { street: 'Lilienblum', number: '17', lng: 34.7673, lat: 32.0625 },
//             { street: 'Montefiore', number: '34', lng: 34.7724, lat: 32.0648 },
//         ];

//         // Create SafeRooms based on bomb shelter locations
//         const safeRooms = await SafeRoom.insertMany(
//             bombShelterLocations.map((location, index) => ({
//                 title: `Bomb Shelter at ${location.street}`, // Adding title based on location street
//                 address: {
//                     city: 'Tel Aviv',
//                     street: location.street,
//                     number: location.number,
//                     floor: index % 4 === 0 ? '1' : 'B',
//                     apartment: index % 4 === 0 ? '3' : '2',
//                 },
//                 location: {
//                     lng: location.lng,
//                     lat: location.lat,
//                 },
//                 images: [`path/to/image${index + 1}.jpg`],
//                 capacity: Math.floor(Math.random() * 30) + 10, // Random capacity between 10 and 40
//                 ownerId: users[index % users.length]._id,
//                 description: `Bomb shelter located at ${location.street} in Tel Aviv.`,
//                 available: Math.random() > 0.2, // 80% chance of being available
//                 accessible: Math.random() > 0.5, // 50% chance of being accessible
//                 isPublic: Math.random() > 0.3, // 70% chance of being public
//             }))
//         );

//         console.log('Database seeded successfully with 5 users and 30 bomb shelters');
//         process.exit(0);
//     } catch (error) {
//         console.error('Error seeding database:', error);
//         process.exit(1);
//     }
// }

// seed();

import mongoose, { Types } from "mongoose";
import axios from "axios";
import User from "./src/models/user-model"; // Adjust the import path according to your project structure
import SafeRoom from "./src/models/room-model"; // Adjust the import path according to your project structure
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
        console.log("Cleared existing users and safe rooms");

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

        console.log(
            "Database seeded successfully with bomb shelters across Israel"
        );
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seed();
