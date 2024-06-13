import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
  const { username, background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    const message = newMessages[0];
    // Ensure all fields are properly defined
    const messageData = {
      ...message,
      user: {
        _id: userID,
        name: username || "Unknown User",
      },
      createdAt: message.createdAt || new Date(),
    };
    addDoc(collection(db, "messages"), messageData)
      .then(() => console.log("Message sent"))
      .catch((error) => console.error("Error sending message: ", error));
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
      let newMessages = [];

      documentsSnapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      setMessages(newMessages);
    });

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  useEffect(() => {
    navigation.setOptions({ title: username });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        renderBubble={renderBubble}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: username,
        }}
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
