# MicMagic - Voice Recording App

## Overview
MicMagic is a user-friendly voice recording app designed for seamless audio recording, playback, and management. Built with React Native and Firebase, it enables users to record, save, and organize audio files, update recording names, search for recordings, and manage their profiles in a secure and intuitive environment.

## Features

### Audio Recording
* Create high-quality voice recordings with intuitive controls for starting, pausing, and stopping
* Play back saved recordings directly within the app with full playback controls
* Save recordings with customizable names for easy organization
* Search through your recording library by name or date
* Share recordings with others through integration with external apps

### User Profile Management
* Update your account details including email, username, and password
* Automatic profile picture generation using email first letter
* Secure sign-out functionality

### Security
* Robust authentication system powered by Firebase
* Protected routes ensuring only authenticated users can access features
* Clear terms of use and privacy guidelines

## Technology Stack

### Frontend
* React Native
* Expo
* React Navigation (@react-navigation/native, @react-navigation/stack)
* React Native Stylesheet

### Backend & Services
* Firebase Authentication
* Firebase Firestore
* Firebase Storage

### State Management & Permissions
* React Hooks (useState, useEffect)
* Expo Permissions for microphone and media access
* Expo Sharing for recording distribution

## Screenshot
![Image](https://github.com/user-attachments/assets/e22e4489-541a-47b9-b3d8-ec7cdf01c79a)

## Installation

### Prerequisites
* Node.js (v16 or higher)
* Expo CLI (`npm install -g expo-cli`)
* Firebase project

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/sphllzulu/voiceRec.git
cd voiceRec
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   * Create a project at [Firebase Console](https://console.firebase.google.com)
   * Add a web app to your project
   * Copy the Firebase configuration
   * Update `src/config/firebaseConfig.js` with your configuration

4. Launch the app:
```bash
npx expo start
```

5. Run on device:
   * Scan the QR code using Expo Go (Android)
   * Use iOS simulator
   * Connect physical device through USB

## Usage Guide

### Recording Audio
1. Navigate to the AudioRecording screen
2. Tap the microphone icon to begin recording
3. Use pause/resume as needed
4. Stop recording to save
5. Manage recordings through the search and rename features

### Profile Management
1. Access the Profile screen
2. Update personal information
3. Change authentication details
4. Sign out through the provided button

## Project Structure
```
micmagic/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── ProfileScreen.js
│   │   │   └── ProtectedRoute.js
│   │   ├── audio/
│   │   │   └── AudioRecording.js
│   ├── config/
│   │   └── firebaseConfig.js
│   ├── navigation/
│   │   └── AppNavigator.js
├── assets/
│   ├── fonts/
│   └── images/
├── App.js
└── README.md
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## Acknowledgments

* Expo team for their development platform
* Firebase for backend infrastructure
* React Navigation team for navigation solutions

## Contact

For questions or feedback:
* Email: sphllzulu@gmail.com

Enjoy using MicMagic! 🎤✨
