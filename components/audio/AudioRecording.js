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

export default function AudioRecording() {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

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

  async function loadFonts() {
    await Font.loadAsync({
      Outfit: require("../../assets/fonts/Outfit-VariableFont_wght.ttf"),
    });
    setFontsLoaded(true);
  }

  async function loadRecordings() {
    try {
      const savedRecordings = await AsyncStorage.getItem("recordings");
      if (savedRecordings !== null) {
        setRecordings(JSON.parse(savedRecordings));
      }
    } catch (error) {
      console.error("Failed to load recordings:", error);
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

  //delete recording by index
  function deleteRecording(index) {
    Alert.alert(
      "Delete Recording",
      "Are you sure you want to delete this recording?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {
            const updatedRecordings = [...recordings];
            updatedRecordings.splice(index, 1);
            await saveRecordings(updatedRecordings);
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

  //search functionality
  function getFilteredRecordings() {
    return recordings.filter((recording, index) => {
      if (!searchTerm) return true;

      const searchString = searchTerm.toLowerCase();
      const recordingNumber = `${index + 1}`;

      return recordingNumber.includes(searchString);
    });
  }
  //stop recording
  async function stopRecording() {
    try {
      setRecording(undefined);
      setIsPaused(false);
      await recording.stopAndUnloadAsync();

      const { sound, status } = await recording.createNewLoadedSoundAsync();
      const newRecording = {
        sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        isPlaying: false,
      };

      const updatedRecordings = [...recordings, newRecording];
      saveRecordings(updatedRecordings);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  }

  //display the recordings
  function getRecordingLines() {
    const filteredRecordings = getFilteredRecordings();
    return filteredRecordings.map((recordingLine, index) => {
      const originalIndex = recordings.indexOf(recordingLine);
      return (
        <View key={originalIndex} style={styles.recordingRow}>
          {" "}
          <Text style={styles.recordingText}>
            {" "}
            {`Recording #${originalIndex + 1} | ${recordingLine.duration}`}{" "}
          </Text>{" "}
          <Text
            style={styles.dateText}
          >{`${recordingLine.date} at ${recordingLine.time}`}</Text>{" "}
          <View style={styles.buttonContainer}>
            {" "}
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => {
                if (recordingLine.isPlaying) {
                  recordingLine.sound.pauseAsync();
                } else {
                  recordingLine.sound.replayAsync();
                }
                recordingLine.isPlaying = !recordingLine.isPlaying;
                setRecordings([...recordings]);
              }}
            >
              {" "}
              <MaterialIcons
                name={recordingLine.isPlaying ? "pause" : "play-arrow"}
                size={24}
                color="#fff"
              />{" "}
            </TouchableOpacity>{" "}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteRecording(originalIndex)}
            >
              {" "}
              <MaterialIcons name="delete" size={24} color="#fff" />{" "}
            </TouchableOpacity>{" "}
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => shareRecording(recordingLine.file)}
            >
              {" "}
              <MaterialIcons name="share" size={24} color="#fff" />{" "}
            </TouchableOpacity>{" "}
          </View>{" "}
        </View>
      );
    });
  }

  //feedback and support section
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

  //share recording
  async function shareRecording(uri) {
    try {
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Failed to share recording:", error);
    }
  }

  if (!fontsLoaded) return null;

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>MicMagic</Text>

        <TextInput
          style={styles.searchBar}
          placeholder="Search recordings number by date or time..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {getRecordingLines()}
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
            name={
              !recording ? "mic" : isPaused ? "fiber-manual-record" : "stop"
            }
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

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#fff",
    fontFamily: "Outfit",
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily: "Outfit",
    backgroundColor: "#f5f5f5",
  },
  recordingRow: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Outfit",
  },
  dateText: {
    fontSize: 14,
    color: "#aaa",
    fontFamily: "Outfit",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  playButton: {
    backgroundColor: "#4caf50",
    padding: 8,
    borderRadius: 20,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 20,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  recordButton: {
    backgroundColor: "#4caf50",
    width: 50,
    height: 50,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  recordingActive: {
    backgroundColor: "#f44336",
  },
  pauseButton: {
    backgroundColor: "#2196f3",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
  },
  feedbackButton: {
    backgroundColor: "#9c27b0",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 20,
  },
  shareButton: {
    marginLeft: 10,
    backgroundColor: "#4285F4",
    padding: 10,
    borderRadius: '50%',
  },
  feedbackContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Outfit",
  },
  closeButton: {
    padding: 5,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontFamily: "Outfit",
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#9c27b0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Outfit",
    fontWeight: "bold",
  },
  supportText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Outfit",
    marginTop: 15,
    textAlign: "center",
  },
});
