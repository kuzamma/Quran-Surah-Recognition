# Quran Surah Recognition App

A React Native mobile application that uses audio processing and machine learning to recognize and identify Quranic Surahs based on voice recitation.

![Quran Surah Recognition App](https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=200&auto=format&fit=crop)

## Overview

This application helps users practice their Quran recitation by analyzing their voice and identifying which Surah they are reciting. The app uses MFCC (Mel-frequency cepstral coefficients) feature extraction and a Support Vector Machine (SVM) model to classify the audio input.

## Features

- **Voice Recording**: Record your recitation of Quranic Surahs
- **Surah Recognition**: Identify which Surah is being recited
- **Confidence Score**: See how confident the model is in its prediction
- **Audio Playback**: Listen to professional recitations of each Surah
- **History Tracking**: View your past recitation attempts and results
- **Offline Support**: Works without internet connection
- **Cross-Platform**: Works on iOS, Android, and web

## Supported Surahs

The application currently recognizes six Surahs:

1. **Al-Fatiha** (الفاتحة) - The Opening
2. **Al-Nas** (الناس) - Mankind
3. **Al-Falaq** (الفلق) - The Daybreak
4. **Al-Ikhlas** (الإخلاص) - Sincerity
5. **Al-Kausar** (الكوثر) - Abundance
6. **Al-As'r** (العصر) - The Time/The Declining Day

## Technical Implementation

### Architecture

- **Frontend**: React Native with Expo
- **State Management**: Zustand with AsyncStorage persistence
- **Navigation**: Expo Router (file-based routing)
- **Audio Processing**: Expo AV for recording and playback
- **Machine Learning**: SVM model with MFCC feature extraction

### How the Recognition Works

1. **Audio Recording**: The app records the user's voice recitation
2. **Preprocessing**: The audio is normalized and filtered to remove noise
3. **Feature Extraction**: MFCC features are extracted from the audio
4. **Classification**: The SVM model analyzes the features and classifies the Surah
5. **Result Display**: The app shows the recognized Surah with a confidence score

### Project Structure

```
quran-surah-recognition/
├── app/                    # Main application screens
│   ├── (tabs)/             # Tab-based navigation screens
│   │   ├── index.tsx       # Recording screen
│   │   ├── surahs.tsx      # Surah list screen
│   │   └── settings.tsx    # Settings screen
│   ├── history.tsx         # History screen
│   └── about.tsx           # About screen
├── components/             # Reusable UI components
├── constants/              # App constants and data
├── hooks/                  # Custom React hooks
├── ml/                     # Machine learning logic
├── store/                  # Zustand state management
└── styles/                 # Shared styles
```

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- Expo CLI
- Yarn or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kuzamma/quran-surah-recognition.git
   cd quran-surah-recognition
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   yarn start
   # or
   npm start
   ```

4. Run on your device or emulator:
   - Scan the QR code with the Expo Go app
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator
   - Press 'w' for web browser

## Usage Guide

1. **Recording a Surah**:
   - Navigate to the Record tab
   - Tap the microphone button to start recording
   - Recite a Surah clearly
   - Tap the button again to stop recording and process

2. **Viewing Results**:
   - The app will display the recognized Surah with a confidence score
   - You can listen to the correct recitation by tapping "Listen to Surah"
   - Tap "Try Again" to record another recitation

3. **Exploring Surahs**:
   - Navigate to the Surahs tab to see all supported Surahs
   - Tap on a Surah to listen to its professional recitation

4. **Viewing History**:
   - Navigate to Settings > View History
   - See a list of your past recitation attempts and results

## Privacy

This application processes all audio locally on your device. Your recitations are not sent to any external servers, ensuring your privacy is maintained.

## Future Improvements

- Support for more Surahs
- Improved recognition accuracy
- Detailed feedback on recitation quality
- Arabic text display with word-by-word highlighting
- Community features for sharing progress

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Audio recitations from [MP3Quran](https://server8.mp3quran.net/)
- Machine learning implementation inspired by research in Quranic audio classification
