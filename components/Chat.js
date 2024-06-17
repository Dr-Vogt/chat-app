import { useEffect, useState } from "react";
import { StyleSheet, View, Platform, Text, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, getDocs, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import {AsyncStorage} from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { username, background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    const message = newMessages[0];
    
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

  let unsubMessages;
    useEffect(() => {
      if (isConnected === true){
      
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
        navigation.setOptions({ title: username });
        
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
       
        unsubMessages = onSnapshot(q, (docs) => {
          let newMessages = [];
          
          docs.forEach(doc => {
            newMessages.push({ id: doc.id, ...doc.data(),  createdAt: new Date(doc.data().createdAt.toMillis()), })
          });
          cacheMessages(newMessages);
          setMessages(newMessages);
        });
      } else loadCachedMessages();
        
        return () => {
          if (unsubMessages) unsubMessages();
        }
      }, [isConnected]); 
      const cacheMessages = async (messagesToCache) => {
        try {
          await AsyncStorage.setItem(
            "messages",
            JSON.stringify(messagesToCache)
          );
        } catch (error) {
          console.log(error.message);
        }
      };
      
      const loadCachedMessages = async () => {
        
        const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
        setMessages(JSON.parse(cachedMessages));
      };
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

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
   }

  useEffect(() => {
    navigation.setOptions({ title: username });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
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
