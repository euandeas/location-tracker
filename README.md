# 🏃‍♂️ Edge GPS Tracker - Take Home Test

React Native app that allows users to track their workout. Allows user to see their route on a live map, view live metrics (time, distance, and average speed) and receive a summary of their workout when they finish.

---

## 📦 Features

- Start a workout session that tracks their GPS location.
- View their route on a live map.
- Pause the session if they need a quick break.
- View metrics like time, distance, and speed while tracking.
- Receive a summary of their workout, including total distance, average speed, moving time and elapsed time.

## 📦 Technical Features

- Distance calculation using Haversine formula
- Handles permission errors gracefully

---

## 🧪 Project Setup

1. Clone and install dependencies

```bash
git clone https://github.com/euandeas/location-tracker.git
cd location-tracker
npm install
```

2. Start development server

 - Android:
 ```bash
 npm run start
 npm run android
 ```

 - iOS:
 ```bash
 cd ios && pod install && cd ..
 npm run start
 npm run ios
```

---

## 📁 Project Structure

```
.
├── components
│   └── LargeButton.tsx
├── ui
│   ├── LocationPermissionPrompt.tsx
│   └── TrackingButtons.tsx
├── utils
│   ├── Formatting.ts
│   └── Tracking.ts
├── MapScreen.tsx - Live Tracking
└── WorkoutComplete.tsx - Workout Summary
```
