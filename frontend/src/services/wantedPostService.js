import api from "../api/axios";

// Create a new wanted post
export const createWantedPost = (data) => {
  return api.post("/wanted-posts", data);
};

// Get all active wanted posts
export const getActiveWantedPosts = () => {
  return api.get("/wanted-posts");
};

// Get the currently logged-in user's wanted posts
export const getMyWantedPosts = () => {
  return api.get("/wanted-posts/mine");
};

// Get products matching one of the user's wanted posts
export const getWantedPostMatches = (id) => {
  return api.get(`/wanted-posts/${id}/matches`);
};
