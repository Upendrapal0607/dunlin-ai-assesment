import axios from "axios";

// import OpenAI from "openai";
export const getCookie = (name) => {
  if (typeof document === "undefined") {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};
export const CostomiseString = (str) => {
  // console.log({str});
  if (str) {
    let strArray = str.trim().split(" ");
    let n = strArray.length;
    if (n == 1) {
      return strArray[0] + "...";
    }
    if (n == 2) {
      return strArray[0] + " " + strArray[1] + "...";
    }
    return strArray[0] + " " + strArray[1] + " " + strArray[2] + "....";
  } else {
    return "";
  }
};

export const UniqueId = () => Math.random().toFixed(6) * 1000000;

// export const CostomiseString =  (str) => {
//   let strArray = str.trim().split(" ");
// return strArray[0]+" " + strArray[1]+" " + strArray[2]+"...."

// };

const baseUrl = "https://dunlin-ai-backend.vercel.app/chat/";

export const FetchAllHistory = async (userName) => {
  const response = await axios.get(`${baseUrl}Allhistory/${userName}`);
  return response.data;
};

export const FetchSingleHistory = async (id) => {
  const response = await axios.get(`${baseUrl}history/${id}`);
  return response.data;
};

export const SendHestory = async (data, chatId) => {
  const response = await axios.post(`${baseUrl}history`, { data, chatId });
  console.log({ response });
  return response.data;
};
export const DeleteHestory = async (id) => {
  const response = await axios.delete(`${baseUrl}delete/${id}`);
  return response.data;
};

// src/lib/utils.js
