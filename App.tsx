/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export enum EStorage {
  Text = "Text"
}

const App = () => {

  const [counter, setCounter] = useState(1);
  const [limit, setLimit] = useState(4);
  const [note, setNote] = useState('');

  useEffect(() => {
    console.log('getting storage');
    getStorage(EStorage.Text)
    .then(value => {
      if (typeof(value) === 'string') {
          console.log('Storage value', value);
          setNote(value);
        }
      });
    
      const backAction = () => {
        dismissKeyboard();
        Alert.alert("Exit Prjóna", "Want to exit Prjóna app?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();
  }, []);

  const subtractToLimit = () => {
    dismissKeyboard();
    let newLimit = limit;
    if (limit >= 2) {
      newLimit -= 1;
    }
    setLimit(newLimit);
  }

  const addToLimit = () => {
    dismissKeyboard();
    let newLimit = limit;
    newLimit += 1;
    setLimit(newLimit);
  }

  const addToCounter = () => {
    dismissKeyboard();
    let newCounter = counter;
    if (counter >= limit) {
      newCounter = 1;
    } else {
      newCounter += 1;
    }
    setCounter(newCounter);
  }

  const subtractToCounter = () => {
    dismissKeyboard();
    let newCounter = counter;
    if (counter === 1) {
      newCounter = limit;
    } else {
      newCounter -= 1;
    }
    setCounter(newCounter);
  }

  const saveText = (value: string) => {
    setNote(value);
    setStorage(EStorage.Text, value);
  }

  const setStorage = async (key: EStorage, value: string) => {
    return await AsyncStorage.setItem(key, value);
  }

  const getStorage = async (key: EStorage) => {
    return await AsyncStorage.getItem(key);
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }

  return (
    <SafeAreaView style={styles.wrapper}>
        <Text style={styles.title}>Prjóna</Text>
        <View style={styles.settings}>
          <Text>Limit</Text>
          <View style={styles.limitSection}>
            <View style={[styles.button]} onTouchEnd={subtractToLimit}><Text style={[styles.buttonText]}>-</Text></View>
            <Text style={styles.limit}>{limit}</Text>
            <View style={[styles.button]} onTouchEnd={addToLimit}><Text style={[styles.buttonText]}>+</Text></View>
          </View>
        </View>
        <View style={styles.main}>
          <TextInput style={styles.textArea} defaultValue="Add note here" placeholder="Add note here" multiline={true} value={note} numberOfLines={4} onChangeText={(value) => saveText(value)} />
          <View style={styles.controls}>
            <View style={[styles.button, styles.subtractControl]} onTouchEnd={subtractToCounter}><Text style={styles.buttonText}>-</Text></View>
          </View>
          <View style={styles.counterSection}>
            <Text style={styles.counter}>{counter}</Text>
          </View>
          <View style={styles.controls}>
            <View style={[styles.button, styles.addControl]} onTouchEnd={addToCounter}><Text style={styles.buttonText}>+</Text></View>
          </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexGrow: 1,
    // alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#FFFFFF"
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 24
  },
  settings: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  textArea: {
    color: "#000000",
    width: 300,
    display: "flex",
    alignSelf: "center",
    justifyContent: "flex-start",
    elevation: 3,
    backgroundColor: "#ffffff",
    textAlignVertical: "top"
  },
  limitSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  limit: {
    fontSize: 21,
    marginHorizontal: 24
  },
  main: {
    flexGrow: 2,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FFFFFF"
  },
  controls: {
    display: "flex",
    flexGrow: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    minWidth: 30,
    minHeight: 30,
    borderRadius: 8,
    backgroundColor: "#0099FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 24
  },
  addControl: {
    width: 120,
    height: 40,
  },
  subtractControl: {
    width: 60,
    height: 40
  },
  counterSection: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  counter: {
    textAlign: "center",
    fontSize: 56
  }
});

export default App;
