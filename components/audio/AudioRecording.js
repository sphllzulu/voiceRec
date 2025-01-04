import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import * as Sharing from "expo-sharing";
import { MaterialIcons } from "@expo/vector-icons";
import { addDoc, collection,updateDoc,doc, query, where, getDocs, deleteDoc } from "firebase/firestore";
// import { query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";


export default function AudioRecording() {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  // const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  useEffect(() => {
    loadRecordings();
    loadFonts();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showFeedback ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showFeedback]);

  useEffect(() => {
    if (!recordings) return;
    
    const filtered = recordings.filter((recording) => {
      const searchString = searchTerm.toLowerCase();
      return (
        recording.name?.toLowerCase().includes(searchString) ||
        recording.date?.toLowerCase().includes(searchString) ||
        recording.time?.toLowerCase().includes(searchString)
      );
    });
    
    setFilteredRecordings(filtered);
  }, [searchTerm, recordings]);

  async function loadFonts() {
    await Font.loadAsync({
      Outfit: require("../../assets/fonts/Outfit-VariableFont_wght.ttf"),
    });
    setFontsLoaded(true);
  }

  async function loadRecordings() {
    try {
      const q = query(
        collection(db, "recordings"),
        where("uid", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
  
      const userRecordings = [];
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        const sound = new Audio.Sound();
  
        try {
          await sound.loadAsync({ uri: data.sound });
          
          userRecordings.push({
            ...data,
            docId: docSnapshot.id, // Store Firestore document ID
            sound,
            isPlaying: false,
          });
        } catch (error) {
          console.error("Failed to load sound:", error);
          // Continue with next recording if one fails to load
          continue;
        }
      }
  
      setRecordings(userRecordings);
    } catch (error) {
      console.error("Failed to load recordings:", error);
      Alert.alert("Error", "Failed to load recordings. Please try again.");
    }
  }


  async function saveRecordings(updatedRecordings) {
    try {
      await AsyncStorage.setItem(
        "recordings",
        JSON.stringify(updatedRecordings)
      );
      setRecordings(updatedRecordings);
    } catch (error) {
      console.error("Failed to save recordings:", error);
    }
  }

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        setIsPaused(false);
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function pauseRecording() {
    try {
      if (!isPaused) {
        await recording.pauseAsync();
      } else {
        await recording.startAsync();
      }
      setIsPaused(!isPaused);
    } catch (err) {
      console.error("Failed to pause/resume recording", err);
    }
  }

  async function deleteRecording(index) {
    Alert.alert(
      "Delete Recording",
      "Are you sure you want to delete this recording?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const recordingToDelete = recordings[index];
              if (!recordingToDelete || !recordingToDelete.docId) {
                throw new Error("Invalid recording or missing document ID");
              }

              // Delete from Firestore
              await deleteDoc(doc(db, "recordings", recordingToDelete.docId));

              // Update local state
              const updatedRecordings = recordings.filter((_, i) => i !== index);
              setRecordings(updatedRecordings);
            } catch (error) {
              console.error("Failed to delete recording:", error);
              Alert.alert("Error", "Failed to delete recording. Please try again.");
            }
          },
        },
      ]
    );
  }

  function getDurationFormatted(milliseconds) {
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.round((milliseconds / 1000) % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // function getFilteredRecordings() {
  //   return recordings.filter((recording) => {
  //     if (!searchTerm) return true;
  //     const searchString = searchTerm.toLowerCase();
  //     return recording.name.toLowerCase().includes(searchString);
  //   });
  // }

  async function stopRecording() {
    try {
      setRecording(undefined);
      setIsPaused(false);
      await recording.stopAndUnloadAsync();
  
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      const uri = recording.getURI();
      
      const recordingData = {
        sound: uri,
        duration: getDurationFormatted(status.durationMillis),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        uid: auth.currentUser.uid,
        name: `Recording ${recordings.length + 1}`,
        uri: uri, // Ensure URI is set
      };
  
      // Add to Firestore first to get the document ID
      const docRef = await addDoc(collection(db, "recordings"), recordingData);
      
      const newRecording = {
        ...recordingData,
        docId: docRef.id,
        sound,
        isPlaying: false,
      };
  
      setRecordings(prevRecordings => [...prevRecordings, newRecording]);
    } catch (err) {
      console.error("Failed to stop recording", err);
      Alert.alert("Error", "Failed to save recording. Please try again.");
    }
  }
  
  async function updateRecordingName(index, newName) {
    try {
      if (!recordings || !recordings[index]) {
        console.error("Recording not found at index:", index);
        return;
      }

      const recording = recordings[index];
      if (!recording.docId) {
        console.error("Recording document ID not found");
        return;
      }

      // Update Firestore first
      const recordingRef = doc(db, "recordings", recording.docId);
      await updateDoc(recordingRef, {
        name: newName
      });

      // If Firestore update succeeds, update local state
      const updatedRecordings = recordings.map((rec, i) => 
        i === index ? { ...rec, name: newName } : rec
      );
      setRecordings(updatedRecordings);
    } catch (error) {
      console.error("Failed to update recording name:", error);
      Alert.alert("Error", "Failed to update recording name. Please try again.");
    }
  }

  function getRecordingLines() {
    if (!recordings) return [];

    // Use filteredRecordings instead of filtering inline
    return filteredRecordings.map((recordingLine, index) => {
      // Find the original index in the recordings array for correct updating
      const originalIndex = recordings.findIndex(r => r.docId === recordingLine.docId);
      
      return (
        <View key={recordingLine.docId || index} style={styles.recordingRow}>
          <View style={styles.recordingText}>
            <TextInput
              style={styles.nameInput}
              value={recordingLine.name || ""}
              onChangeText={(text) => updateRecordingName(originalIndex, text)}
            />
            <Text style={styles.durationText}>{recordingLine.duration}</Text>
          </View>
          <Text style={styles.dateText}>
            {`${recordingLine.date} at ${recordingLine.time}`}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => {
                if (recordingLine.isPlaying) {
                  recordingLine.sound?.pauseAsync();
                } else {
                  recordingLine.sound?.replayAsync();
                }
                const updatedRecordings = recordings.map((rec, i) => 
                  i === originalIndex ? { ...rec, isPlaying: !rec.isPlaying } : rec
                );
                setRecordings(updatedRecordings);
              }}
            >
              <MaterialIcons
                name={recordingLine.isPlaying ? "pause" : "play-arrow"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteRecording(originalIndex)}
            >
              <MaterialIcons name="delete" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => recordingLine.uri && shareRecording(recordingLine.uri)}
            >
              <MaterialIcons name="share" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  }


  function submitFeedback() {
    if (!feedback.trim()) {
      Alert.alert("Error", "Please enter your feedback before submitting.");
      return;
    }
    Alert.alert(
      "Confirm Submission",
      "Are you sure you want to submit this feedback?",
      [
        { text: "Cancel" },
        {
          text: "Submit",
          onPress: () => {
            Alert.alert(
              "Thank You!",
              "Your feedback has been submitted successfully. We appreciate your input!"
            );
            setFeedback("");
            setShowFeedback(false);
          },
        },
      ]
    );
  }
  async function shareRecording(uri) {
    try {
      if (!uri) {
        Alert.alert("Error", "No recording URI found.");
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Failed to share recording:", error);
      Alert.alert("Error", "Failed to share recording. Please try again.");
    }
  }

  if (!fontsLoaded) return null;

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        
      <TextInput
          style={styles.searchBar}
          placeholder="Search by recording name, date, or time..."
          placeholderTextColor={COLORS.text.muted}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {getRecordingLines()}
        {filteredRecordings.length === 0 && searchTerm !== "" && (
          <Text style={styles.noResultsText}>
            No recordings found matching "{searchTerm}"
          </Text>
        )}
      </ScrollView>

      <Animated.View
        style={[
          styles.feedbackContainer,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.feedbackHeader}>
          <Text style={styles.feedbackTitle}>Feedback & Support</Text>
          <TouchableOpacity
            onPress={() => setShowFeedback(false)}
            style={styles.closeButton}
          >
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Share your thoughts with us..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
        <Text style={styles.supportText}>
          Need help? Contact us at support@micmagic.com
        </Text>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => setShowFeedback(true)}
        >
          <MaterialIcons name="feedback" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.recordButton, recording && styles.recordingActive]}
          onPress={() => {
            if (!recording) {
              startRecording();
            } else if (isPaused) {
              pauseRecording();
            } else if (recording) {
              stopRecording();
            }
          }}
        >
          <MaterialIcons
            name={!recording ? "mic" : isPaused ? "fiber-manual-record" : "stop"}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>

        {recording && (
          <TouchableOpacity style={styles.pauseButton} onPress={pauseRecording}>
            <MaterialIcons
              name={isPaused ? "play-arrow" : "pause"}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}


const COLORS = {
  primary: '#8B5CF6', // Main purple
  primaryDark: '#7C3AED', // Darker purple for hover/active states
  primaryLight: '#A78BFA', // Lighter purple for accents
  secondary: '#4C1D95', // Deep purple for contrast
  background: '#1E1B4B', // Dark navy background
  surface: '#2D2A4A', // Slightly lighter surface color
  error: '#EF4444', // Red for delete/errors
  success: '#10B981', // Green for success states
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E7EB',
    muted: '#9CA3AF',
  },
  overlay: 'rgba(17, 24, 39, 0.7)', // Dark overlay for bottom bar
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 24,
    color: COLORS.text.primary,
    fontFamily: 'Outfit',
    letterSpacing: 1,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    fontFamily: 'Outfit',
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
  },
  searchBar: {
    height: 48,
    backgroundColor: 'grey',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontFamily: 'Outfit',
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.primaryLight + '40',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordingRow: {
    backgroundColor: COLORS.surface,
    padding: 16,
    marginVertical: 8,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recordingText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    fontFamily: 'Outfit',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.text.muted,
    fontFamily: 'Outfit',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 12,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    padding: 10,
    borderRadius: 12,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButton: {
    backgroundColor: COLORS.primaryLight,
    padding: 10,
    borderRadius: 12,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: COLORS.overlay,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLight + '20',
    backdropFilter: 'blur(12px)',
  },
  recordButton: {
    backgroundColor: COLORS.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  recordingActive: {
    backgroundColor: COLORS.error,
  },
  pauseButton: {
    backgroundColor: COLORS.primaryLight,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  feedbackButton: {
    backgroundColor: COLORS.secondary,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Outfit',
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: COLORS.primaryLight + '40',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontFamily: 'Outfit',
    height: 120,
    textAlignVertical: 'top',
    backgroundColor: COLORS.background,
    color: COLORS.text.primary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontFamily: 'Outfit',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  supportText: {
    fontSize: 14,
    color: COLORS.text.muted,
    fontFamily: 'Outfit',
    marginTop: 20,
    textAlign: 'center',
  },
});