# MicMagic - Voice Recording App
MicMagic is a user-friendly voice recording app designed for seamless audio recording, playback, and management. It allows users to record, save, and organize audio files, update recording names, search for recordings, and manage their profile. Built with React Native and Firebase, MicMagic offers a secure and intuitive experience for all users.

## Features
### Audio Recording
Record Audio: Start, pause, and stop recordings with ease.

Playback: Listen to saved recordings directly within the app.

Save Recordings: Store recordings with customizable names.

Search: Search for recordings by name or date.

Share: Share recordings with others via external apps.

### User Profile
Profile Management: Update email, username, and password.

Profile Picture: Use the first letter of the email as a profile picture.

Sign Out: Securely sign out of the app.

### Authentication
Login/Register: Secure authentication using Firebase.

Protected Routes: Only authenticated users can access the app’s main features.

Terms of Use
Terms of Use Section: Clear and concise terms of use for the app.

### Technologies Used
Frontend: React Native, Expo

Backend: Firebase (Authentication, Firestore, Storage)

State Management: React Hooks (useState, useEffect)

Navigation: React Navigation (@react-navigation/native, @react-navigation/stack)

Styling: React Native Stylesheet

Permissions: Expo Permissions (for microphone and media library access)

Sharing: Expo Sharing (for sharing recordings)

## Installation
Prerequisites
Node.js (v16 or higher)

Expo CLI (npm install -g expo-cli)

Firebase project (for authentication and Firestore)

Steps
Clone the Repository:

bash
Copy
git clone https://github.com/sphllzulu/voiceRec.git
cd voiceRec
Install Dependencies:

```
npm install
```
Set Up Firebase:

Create a Firebase project at Firebase Console.

Add a web app to your Firebase project and copy the Firebase configuration.

Replace the Firebase configuration in src/config/firebaseConfig.js with your own.

Run the App:
```
 npx expo start

```
Scan the QR code with the Expo Go app (Android) or use an iOS simulator.

### Usage
Recording Audio
Open the app and navigate to the AudioRecording screen.

Tap the microphone button to start recording.

Use the pause button to pause/resume the recording.

Tap the stop button to save the recording.

Rename recordings and search for them using the search bar.

Managing Profile
Navigate to the Profile screen.

Update your email, username, or password.

Sign out of the app using the Sign Out button.

Terms of Use
Navigate to the Terms of Use section from the Profile screen.

Read the terms and conditions for using MicMagic.

Screenshots
Login Screen	Audio Recording Screen	Profile Screen
Login	Recording	Profile
Folder Structure
Copy
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
Contributing
Contributions are welcome! Follow these steps to contribute:

Fork the repository.

Create a new branch (git checkout -b feature/YourFeatureName).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/YourFeatureName).

Open a pull request.

Acknowledgments
Expo for providing a seamless development environment.

Firebase for backend services.

React Navigation for smooth navigation between screens.

Contact
For questions or feedback, feel free to reach out:

Email: sphllzulu@gmail.com


Enjoy using MicMagic! 🎤✨

