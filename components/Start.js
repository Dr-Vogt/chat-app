import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";

const Start = ({ navigation, }) => {
    const auth = getAuth();
    const [username, setUsername] = useState('');
    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];
    const [background, setBackground] = useState(colors[0]);

    const signInUser = () => {
        signInAnonymously(auth)
          .then((result) => {
            navigation.navigate("Chat", {
              name: username,
              background: background,
              userID: result.user.uid,
            });
            Alert.alert("Signed in Successfully!");
          })
          .catch((error) => {
            Alert.alert("Unable to sign in, try later again.");
          });
      };

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <ImageBackground
                source={require("../assets/bgImage.png")}
                style={styles.imageBackground}
            >
                <Text style={styles.title}>Chat Master!</Text>
                <View style={styles.box}>
                    {/* user types name */}
                    <TextInput
                        style={styles.textInput}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Your name"
                    />
                    <Text style={styles.chooseBgColor}>Choose Background Color</Text>
                    {/* user selects background color */}
                    <View style={styles.colorButtonContainer}>
                        {colors.map((color, index) => (
                            <TouchableOpacity key={index}
                                style={[styles.colorButton, { backgroundColor: color }, background === color && styles.selectedColor]}
                                onPress={() => setBackground(color)}
                            />
                        ))}
                    </View>
                    {/* to start chat */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={signInUser}
                    >
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    imageBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    title: {
        flex: 1,
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
        margin: 25,
    },
    box: {
        backgroundColor: '#f2f2f2',
        width: '88%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 20,
        borderRadius: 10,
    },
    textInput: {
        width: '88%',
        borderColor: '#757083',
        borderRadius: 4,
        color: '#757083',
        fontSize: 16,
        fontWeight: '300',
        opacity: 50,
        padding: 15,
        borderWidth: 1,
        marginBottom: 10,
    },
    chooseBgColor: {
        color: '#757083',
        fontSize: 16,
        fontWeight: '300',
        opacity: 100,
    },
    colorButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    colorButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 5,
    },
    selectedColor: {
        borderColor: '#c0c0c0',
        borderWidth: 1,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#757083',
        borderRadius: 4,
        height: '20%',
        justifyContent: 'center',
        padding: 10,
        width: '88%',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    }
});

export default Start;
