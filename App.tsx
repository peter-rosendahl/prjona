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
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
  Alert,
} from 'react-native';

import { 
  Appbar, 
  Dialog, 
  Menu, 
  Portal,
  TextInput } from 'react-native-paper';
import { IProject, ICurrentProject, CurrentProject } from './Models/Project';
import Navigation from './Layout/Navigation';
import { StorageKey, getStorageAsync, setStorageAsync } from './Services/local-storage';
import { fetchProjectListAsync, updateProjectAsync, addProjectAsync, renameProjectAsync } from './Services/project.service';

const App = () => {

  const [note, setNote] = useState('');
  const [currentProject, setCurrentProject] = useState<ICurrentProject | null>(null);
  const [projectList, setProjectList] = useState<ICurrentProject[]>([]);
  const [isNavigationOpen, setIsNavigationOpen] = useState<boolean>(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState<boolean>(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState<boolean>(false);
  const [projectRenameText, setProjectRenameText] = useState<string>("");

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
    const fetchedProjectList = await fetchProjectListAsync();
    console.log('projectList', fetchedProjectList);
    let parsedProjectList: ICurrentProject[];
    if (typeof(fetchedProjectList) == 'string') {
      console.log('projects are stringified');
      parsedProjectList = JSON.parse(fetchedProjectList);
    } else {
      parsedProjectList = fetchedProjectList;
    }
    console.log(typeof(parsedProjectList));

    if (parsedProjectList != null) {
      console.log('App.fetch, setting project list', parsedProjectList);
      setProjectList(parsedProjectList);
      if (parsedProjectList.length > 0) {
        console.log('App.fetch, projectList is more than zero', parsedProjectList.length);
        const activeProject = parsedProjectList[0];
        setCurrentProject(activeProject);
        setNote(activeProject.note);
      } else {
        const project: ICurrentProject = new CurrentProject("Project 1", 4, 1, ""); 
        await addProjectAsync(project);
        setCurrentProject(project);
        setNote(project.note); 
      }
    } else {
      const project: ICurrentProject = new CurrentProject("Project 1", 4, 1, ""); 
      await addProjectAsync(project);
      setCurrentProject(project);
      setNote(project.note); 
    }
  }

  const toggleNavigation = (isOpen: boolean) => {
    setIsNavigationOpen(isOpen);
  }


  const openProjectMenu = () => {
    setIsProjectMenuOpen(true);
  }

  const closeProjectMenu = () => {
    setIsProjectMenuOpen(false);
  }

  const addToLimit = (count: number) => {
    dismissKeyboard();
    let newLimitOrDefault = currentProject?.limit ?? 4;
    if ((count < 0 && newLimitOrDefault > 1) || count > 0) {
      newLimitOrDefault += count;
    } else {
      return;
    }
    
    const project: ICurrentProject = {
      name: currentProject?.name ?? "test",
      limit: newLimitOrDefault,
      note: currentProject?.note ?? "",
      counter: currentProject?.counter ?? 1
    };
    setCurrentProject(project);
  }

  const addToCounter = (count: number) => {
    dismissKeyboard();
    let newCounter = currentProject?.counter ?? 1,
    limit = currentProject?.limit ?? 4;
    console.log('addToCounter', count, newCounter, limit);
    if ((count < 0 && newCounter > 1) || count > 0) {
      newCounter += count;
    } else {
      return;
    }
    if (newCounter > limit) {
      newCounter = 1;
    }
    const project: ICurrentProject = {
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
    const project: ICurrentProject = {
      name: currentProject?.name ?? "test",
      limit: currentProject?.limit ?? 4,
      note: currentProject?.note ?? "",
      counter: newCounter
    };
    setCurrentProject(project);
  }

  const saveText = (value: string) => {
    setNote(value);
    const project: CurrentProject = {
      name: currentProject?.name ?? "test",
      limit: currentProject?.limit ?? 4,
      note: value,
      counter: currentProject?.counter ?? 1
    };
    setCurrentProject(project);
  }

  // const saveCurrentProject = (project: ICurrentProject, timeout: number = 0) => {
  //   clearTimeout(noteTimeout);
  //   setTimeout(() => {
  //     const projectList: IProject[] = [];
  //     projectList.push(project);
  //     setStorageAsync(StorageKey.ProjectList, JSON.stringify(projectList));
  //   }, timeout);
  // }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }

  const toggleRenameDialog = (isVisible: boolean) => {
    setProjectRenameText(currentProject!.name);
    setIsRenameDialogOpen(isVisible);
  }

  const executeRename = async() => {
    const indexOfCurrentProject = projectList.indexOf(currentProject!);
    console.log(indexOfCurrentProject);
    const newList = await renameProjectAsync(currentProject!, projectRenameText);
    toggleRenameDialog(false);
    closeProjectMenu();
    setProjectList(newList);
    setCurrentProject(newList[indexOfCurrentProject]);
  }

  const onNewProjectCreated = (newList: ICurrentProject[]) => {
    setProjectList(newList);
  }

  const onProjectSelected = (projectName: string) => {
    const selectedProject = projectList.find(x => x.name == projectName);
    if (selectedProject != null) {
      let updatedList = projectList.map(item => {
        return {
          ...item,
          isCurrent: item.name == projectName
        }
      });
      setProjectList(updatedList);
      setCurrentProject(selectedProject);
    }
  }

  useEffect(() => {
    // saveCurrentProject(currentProject!, 0);
    updateProjectAsync(currentProject!).then(result => {
      console.log("update project result", result);
    });
  }, [currentProject])

  return (
    <SafeAreaView style={styles.wrapper}>
      <Appbar.Header elevated={true}>
        <Appbar.Action icon="menu" onPress={() => toggleNavigation(!isNavigationOpen)} />
        <Appbar.Content title={currentProject?.name ?? 'Prjona'} />
        <Menu
          visible={isProjectMenuOpen}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openProjectMenu} />}
          onDismiss={closeProjectMenu}>
            <Menu.Item onPress={() => toggleRenameDialog(true)} title="Rename project" />
        </Menu>
      </Appbar.Header>
      {isNavigationOpen && 
        <Navigation 
          items={projectList} 
          onNewProjectCreated={onNewProjectCreated} 
          onProjectSelected={onProjectSelected}
          />
      }
      {isRenameDialogOpen &&
        <Portal>
          <Dialog
            visible={true}
            onDismiss={() => toggleRenameDialog(false)}>
              <Dialog.Title>Rename project</Dialog.Title>
              <Dialog.Content>
                <TextInput label="Name" value={projectRenameText} onChangeText={(value) => setProjectRenameText(value)} />
              </Dialog.Content>
              <Dialog.Actions>
                  <Button title="Confirm" onPress={executeRename}></Button>
              </Dialog.Actions>
          </Dialog>
        </Portal>
      }
      <View style={styles.settings}>
        <Text style={[styles.text]}>Limit</Text>
        
        <View style={styles.limitSection}>
          <View style={[styles.button]} onTouchEnd={() => addToLimit(-1)}>
            <Text style={[styles.buttonText]}>-</Text>
          </View>

          <Text style={[styles.limit, styles.text]}>{currentProject?.limit}</Text>

          <View style={[styles.button]} onTouchEnd={() => addToLimit(1)}>
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
            onTouchEnd={(e) => addToCounter(1)}>
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
    color: "#000",
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
