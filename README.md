# CivicLens AI

A full-stack MERN platform designed to streamline civic issue reporting. The goal of this project is to help citizens report local problems like potholes, illegal dumping, or broken streetlights using AI verification and real-time location data.

## Why I built this
In many cities, reporting a civic issue is a slow and manual process. I built CivicLens AI to make it more efficient. By using AI to verify photos instantly, we can filter out spam reports, and by using automated geolocation, authorities get the exact coordinates without the user having to type an address.

## Core Features
* **AI Image Verification**: Uses Google Gemini 2.5 Flash to check if the uploaded photo is actually a civic issue.
* **Smart Mapping**: Integrated with Leaflet.js to capture coordinates and show them on an admin dashboard.
* **Performance**: Added client-side image compression so that high-res photos don't slow down the upload process.
* **Developer Friendly**: Production logs are programmatically disabled to keep the console clean and secure once the app is live.

## Tech Stack
* **Frontend**: React (Vite), Tailwind CSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Other Tools**: Cloudinary (Image storage), OpenStreetMap (Location data)

## Local Setup

### 1. Backend
* Navigate to the `backend` folder.
* Run `npm install`.
* Create a `.env` file with your credentials.
* Run `npm start`.

### 2. Frontend
* Navigate to the `frontend` folder.
* Run `npm install`.
* Run `npm run dev`.