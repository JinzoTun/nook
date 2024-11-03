// sessionUtils.ts
export const clearSessionVotes = () => {
  for (const key in sessionStorage) {
    if (key.startsWith("vote_")) sessionStorage.removeItem(key);
  }
};
