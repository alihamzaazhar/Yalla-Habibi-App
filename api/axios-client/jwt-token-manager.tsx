import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}
async function getStorageItemAsync(key: string) {
  if (Platform.OS === "web") {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
}
class JwtTokenManager {
  public async registerJwtAsync(token: string | null) {
    if (token === null)
      return await setStorageItemAsync("marketplaceJwt", null);
    await setStorageItemAsync("marketplaceJwt", token);
  }

  public async getJwtAsync() {
    return await getStorageItemAsync("marketplaceJwt");
  }
}

/**
 * Export singleton instance.
 */
export default new JwtTokenManager();
