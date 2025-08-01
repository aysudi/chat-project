import instance from "./instance";
import { enqueueSnackbar } from "notistack";

// Fetch all
async function getAll(endpoint: string) {
  try {
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users", error);
    throw error;
  }
}

// Fetch one by ID
async function getOne(endpoint: string, id: string = "") {
  try {
    const url = id ? `${endpoint}/${id}` : endpoint;
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}`, error);
    throw error;
  }
}

// Delete by ID
async function deleteOne(endpoint: string, id: string) {
  try {
    const response = await instance.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}`, error);
    throw error;
  }
}

// Update data by ID
async function update(endpoint: string, id: string = "", data: any) {
  try {
    const url = id ? `${endpoint}/${id}` : endpoint;
    const response = await instance.put(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}`, error);
    throw error;
  }
}

// Create a new data
async function post(endpoint: string, data: any, headers?: object) {
  try {
    const response = await instance.post(endpoint, data, headers);
    return response.data;
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    enqueueSnackbar(error.response?.data?.message || "An error occurred", {
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
      variant: "error",
    });
    throw error;
  }
}

const controller = {
  getAll,
  getOne,
  deleteOne,
  update,
  post,
};

export default controller;
