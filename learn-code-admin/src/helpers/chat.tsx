/**
 * @function removeAsteriks
 * Removes asterisks from a message string.
 */
export const removeAsteriks = (message: string) => {
  return message && message?.replace(/\*/g, "");
};

/**
 * @function generateRandomRoomId
 * generates a random room id
 */
export const generateRandomRoomId = () => {
  return Math.random().toString(36).substring(2, 15);
};
