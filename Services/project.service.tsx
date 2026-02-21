import { ICurrentProject, IProject } from "../Models/Project";
import { StorageKey, getStorageAsync, setStorageAsync } from "./local-storage";

export const fetchProjectListAsync = async(): Promise<ICurrentProject[]> => {
    const projectStorageString = await getStorageAsync(StorageKey.ProjectList);
    console.log('ProjectService.fetch, result from storage', projectStorageString);
    if (projectStorageString == null) return [];

    const projectList = JSON.parse(projectStorageString);
    console.log('returning thing', typeof(projectList), projectList);
    return projectList;
} 

export const addProjectAsync = async(newProject: IProject): Promise<ICurrentProject[]> => {
    const existingProjectList = await fetchProjectListAsync();
    const project: ICurrentProject = {...newProject};
    const completeProjectList: ICurrentProject[] = [project];
    existingProjectList.forEach(item => {
        if ("isCurrent" in item) {
            item.isCurrent = false;
        }
        completeProjectList.push(item);
    });
    console.log('addProjectAsync.completeProjectList', completeProjectList);
    await setStorageAsync(StorageKey.ProjectList, JSON.stringify(completeProjectList));
    return completeProjectList;
}

export const renameProjectAsync = async(project: ICurrentProject, name: string) => {
    let existingProjectList: ICurrentProject[] = await fetchProjectListAsync();
    if (IsArrayNullOrEmpty(existingProjectList)) return [];
    if (typeof(existingProjectList) == 'string') {
        existingProjectList = JSON.parse(existingProjectList);
    }
    const currentProject = existingProjectList!.find(x => x.name == project.name);
    if (currentProject == null) {
        console.log("could not find project by name", project.name);
        return existingProjectList;
    }
    const index = existingProjectList.indexOf(currentProject);
    existingProjectList[index] = {...currentProject, name: name};
    await setStorageAsync(StorageKey.ProjectList, existingProjectList);
    return existingProjectList;
}

export const updateProjectAsync = async(project: ICurrentProject) => {
    let existingProjectList: IProject[] = await fetchProjectListAsync();
    console.log('updating project', project, existingProjectList);
    if (IsArrayNullOrEmpty(existingProjectList)) return;
    if (typeof(existingProjectList) == 'string') {
        existingProjectList = JSON.parse(existingProjectList);
    }
    console.log('ProjectService.update, existingProject list is not empty', existingProjectList);
    const currentProject = existingProjectList!.find(x => x.name == project.name);
    if (currentProject == null) {
        console.log("could not find project by name", project.name);
        return existingProjectList;
    }
    const index = existingProjectList.indexOf(currentProject);
    existingProjectList[index] = {...project};
    console.log('final project list to store', existingProjectList);
    await setStorageAsync(StorageKey.ProjectList, existingProjectList);
    return existingProjectList;
}

export const deleteProjectAsync = async(project: ICurrentProject) => {
    const existingProjectList = await fetchProjectListAsync();
    if (IsArrayNullOrEmpty(existingProjectList)) return;
    const currentProject = existingProjectList!.find(x => x.name == project.name);
    if (currentProject == null) {
        console.log("could not find project by name", project.name);
        return existingProjectList;
    }
    const index = existingProjectList.indexOf(currentProject);
    existingProjectList.splice(index, 1);
    await setStorageAsync(StorageKey.ProjectList, existingProjectList);
    return existingProjectList;
}

const IsArrayNullOrEmpty = (list: any): boolean => {
    console.log('type of list', typeof(list));
    return list == null || list.length == 0;
}