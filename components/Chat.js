import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, Text, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
    const { name, background } = route.params;
    const [ messages, setMessages ] = useState([]);
    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
      }

      const renderBubble = (props) => {
        return <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: "#000"
            },
            left: {
              backgroundColor: "#FFF"
            }
          }}
        />
      }
      

    useEffect(() => {
        navigation.setOptions({ title: name });
        setMessages([
            {
              _id: 1,
              text: "Hello developer",
              createdAt: new Date(),
              user: {
                _id: 2,
                name: "React Native",
                avatar: "https://placeimg.com/140/140/any",
              },
            },
            {
              _id: 2,
              text: "You've entered the chat room",
              createdAt: new Date(),
              system: true,
            },
          ]);
         }, []);

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <GiftedChat
      messages={messages}
      renderBubble={renderBubble}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1
      }}
    />
    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1
    }
  });

export default Chat;
