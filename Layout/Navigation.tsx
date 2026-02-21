import { useState } from 'react';
import {
    StyleSheet
} from 'react-native';
import { 
    Drawer, 
    useTheme,
    Portal, 
    Dialog, 
    Text, 
    Button, 
    TextInput
} from 'react-native-paper';
import { addProjectAsync } from '../Services/project.service';
import { CurrentProject, ICurrentProject, IProject } from '../Models/Project';


type NavigationProps = {
    items: ICurrentProject[],
    onNewProjectCreated: (list: ICurrentProject[]) => void,
    onProjectSelected: (name: string) => void
};


const Navigation: React.FC<NavigationProps> = ({items, onNewProjectCreated, onProjectSelected}) => {
    
    const theme = useTheme();

    const [isNewProjctDialogOpen, setIsNewProjectDialogOpen] = useState<boolean>(false);
    const [newProjectName, setNewProjectName] = useState<string>("");

    const initializeProjectCreation = () => {
        setIsNewProjectDialogOpen(true);
    }

    const closeProjectCreation = () => {
        setIsNewProjectDialogOpen(false);
    }

    const createNewProject = async() => {
        let newProject: ICurrentProject = new CurrentProject(newProjectName, 4, 1, "");
        const newList = await addProjectAsync(newProject);
        closeProjectCreation();
        setNewProjectName("");
        onNewProjectCreated(newList);
    }

    const selectProject = (item: ICurrentProject) => {
        onProjectSelected(item.name);
    }

    return (
        <>
            <Drawer.Section>
                {items && items.map(item => (
                    <Drawer.Item 
                        style={[item.isCurrent ? styles.active : styles.defaultItem]}
                        key={item?.name} 
                        label={item?.name}
                        onPress={() => selectProject(item)}></Drawer.Item>
                ))}
                <Drawer.Item  icon="plus" style={{backgroundColor: theme.colors.secondary}} label="Create new project" onPress={initializeProjectCreation} />
            </Drawer.Section>
            <Portal>
                <Dialog visible={isNewProjctDialogOpen} onDismiss={closeProjectCreation}>
                    <Dialog.Title>Create new project</Dialog.Title>
                    <Dialog.Content>
                        <Text style={[styles.text]}>Give your new project a name</Text>
                        <TextInput label="Name" onChangeText={text => setNewProjectName(text)} />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={createNewProject}>Create</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    text: {
        color: "#999"
    },
    defaultItem: {

    },
    active: {
        backgroundColor: "#525f7f"
    }
})

export default Navigation;