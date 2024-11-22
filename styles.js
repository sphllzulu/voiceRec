import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  
  // Inputs
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontFamily: "Outfit",
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  textarea: {
    height: 120,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: "Outfit",
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "top", // Ensures placeholder aligns to the top
    backgroundColor: "#fff",
  },

  // Buttons
  button: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonSecondary: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Outfit",
  },
  buttonTextSecondary: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Outfit",
  },

  // Typography
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Outfit",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    fontFamily: "Outfit",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "#444",
    fontFamily: "Outfit",
    lineHeight: 24,
  },
  linkText: {
    fontSize: 16,
    color: "#ff6b6b",
    fontFamily: "Outfit",
    textDecorationLine: "underline",
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Outfit",
    marginBottom: 5,
  },

  // Feedback Section
  feedbackContainer: {
    backgroundColor: "#fdfdfd",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Outfit",
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Outfit",
    lineHeight: 22,
  },

  // Cards
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Outfit",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: "#555",
    fontFamily: "Outfit",
    lineHeight: 22,
  },

  // Error Messages
  errorText: {
    fontSize: 14,
    color: "#ff6b6b",
    fontFamily: "Outfit",
    marginBottom: 5,
  },

  // Miscellaneous
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  badge: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Outfit",
  },
});
