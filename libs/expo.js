import { Expo } from "expo-server-sdk";

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

export default expo;
