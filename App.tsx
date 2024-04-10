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
import { Project } from './Models/Project';

export enum EStorage {
  Text = "Text",
  Counter = "Counter",
  Limit = "Limit",
  Project = "ProjectList"
}

const App = () => {

  const [note, setNote] = useState('');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  let noteTimeout: NodeJS.Timeout;

  useEffect(() => {
    
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

    fetchProjects();

    return () => backHandler.remove();
  }, []);

  const fetchProjects = async() => {
    const projectStorageString = await getStorageAsync(EStorage.Project),
      projectList = projectStorageString != null ? JSON.parse(projectStorageString) : null;
    console.log('projectList', typeof(projectList), projectList);
    if (projectList != null && typeof(projectList) == 'object') {
      setCurrentProject(projectList[0]);
      setNote(projectList[0]?.note ?? "");
    } else {
      setCurrentProject(new Project("Project 1", 4, 1, ""));
      setNote("");
    }
  }

  const subtractToLimit = () => {
    dismissKeyboard();
    let newLimit = currentProject?.limit ?? 4;
    if (newLimit >= 2) {
      newLimit -= 1;
    }
    
    const project: Project = {
      name: currentProject?.name ?? "test",
      limit: newLimit,
      note: currentProject?.note ?? "",
      counter: currentProject?.counter ?? 1
    };
    setCurrentProject(project);
  }

  const addToLimit = () => {
    dismissKeyboard();
    let newLimit = currentProject?.limit ?? 4;
    newLimit += 1;
    
    const project: Project = {
      name: currentProject?.name ?? "test",
      limit: newLimit,
      note: currentProject?.note ?? "",
      counter: currentProject?.counter ?? 1
    };
    setCurrentProject(project);
  }

  const addToCounter = () => {
    dismissKeyboard();
    let newCounter = currentProject?.counter ?? 1,
      limit = currentProject?.limit ?? 4;
    if (newCounter >= limit) {
      newCounter = 1;
    } else {
      newCounter += 1;
    }
    const project: Project = {
      name: currentProject?.name ?? "test",
      limit: currentProject?.limit ?? 4,
      note: currentProject?.note ?? "",
      counter: newCounter
    };
    setCurrentProject(project);
  }

  const subtractToCounter = () => {
    dismissKeyboard();
    let newCounter = currentProject?.counter ?? 1;
    if (newCounter == 1) {
      newCounter = 1;
    } else {
      newCounter -= 1;
    }
    const project: Project = {
      name: currentProject?.name ?? "test",
      limit: currentProject?.limit ?? 4,
      note: currentProject?.note ?? "",
      counter: newCounter
    };
    setCurrentProject(project);
  }

  const saveText = (value: string) => {
    setNote(value);
    const project: Project = {
      name: currentProject?.name ?? "test",
      limit: currentProject?.limit ?? 4,
      note: value,
      counter: currentProject?.counter ?? 1
    };
    setCurrentProject(project);
  }

  const saveCurrentProject = (project: Project, timeout: number = 0) => {
    clearTimeout(noteTimeout);
    setTimeout(() => {
      const projectList: Project[] = [];
      projectList.push(project);
      setStorageAsync(EStorage.Project, JSON.stringify(projectList));
    }, timeout);
  }

  const setStorageAsync = async (key: EStorage, value: string) => {
    return await AsyncStorage.setItem(key, value);
  }

  const getStorageAsync = async (key: EStorage) => {
    return await AsyncStorage.getItem(key);
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }

  useEffect(() => {
    saveCurrentProject(currentProject!, 0);
  }, [currentProject])

  return (
    <SafeAreaView style={styles.wrapper}>
        <Text style={[styles.title, styles.text]}>Prjóna</Text>
        <View style={styles.settings}>
          <Text>Limit</Text>
          
          <View style={styles.limitSection}>
            <View style={[styles.button]} onTouchEnd={subtractToLimit}>
              <Text style={[styles.buttonText]}>-</Text>
            </View>

            <Text style={[styles.limit, styles.text]}>{currentProject?.limit}</Text>

            <View style={[styles.button]} onTouchEnd={addToLimit}>
              <Text style={[styles.buttonText]}>+</Text>
            </View>
          </View>

        </View>

        <View style={styles.main}>
          <TextInput 
            style={styles.textArea} 
            defaultValue="Add note here" 
            placeholder="Add note here" 
            multiline={true} 
            value={note} 
            numberOfLines={4} 
            onChangeText={(value) => saveText(value)} />

          <View style={styles.controls}>
            <View style={[styles.button, styles.subtractControl]} onTouchEnd={subtractToCounter}>
              <Text style={styles.buttonText}>-</Text>
            </View>
          </View>

          <View style={styles.counterSection}>
            <Text style={[styles.counter, styles.text]}>
              {currentProject?.counter}
            </Text>
          </View>

          <View style={styles.controls}>
            <View 
              style={[styles.button, styles.addControl]} 
              onTouchEnd={addToCounter}>
              <Text style={styles.buttonText}>+</Text>
            </View>
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
  text: {
    color: "#999",
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
