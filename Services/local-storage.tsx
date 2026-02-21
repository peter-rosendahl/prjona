import AsyncStorage from '@react-native-async-storage/async-storage';


export const setStorageAsync = async (key: StorageKey, value: Array<any> | Object | string | number) => {
  return await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const getStorageAsync = async (key: StorageKey) => {
  return await AsyncStorage.getItem(key);
}

export enum StorageKey {
  ProjectList = "ProjectList"
}