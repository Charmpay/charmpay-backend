import expo from "../libs/expo.js";

/**
 * Send Push Notifications
 * @param {import("expo-server-sdk").ExpoPushMessage[]} messages
 */
const pushNotifications = (messages) => {
  let chunks = expo.chunkPushNotifications(messages);
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

export default pushNotifications;
