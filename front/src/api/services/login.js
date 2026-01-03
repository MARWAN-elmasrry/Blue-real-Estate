import api from "../axios";

export const adminLogin = async (identifier, password) => {
  try {
    const response = await api.post("/auth/login/", {
      admin:identifier,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};
