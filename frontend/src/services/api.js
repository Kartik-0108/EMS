import axios from "axios";

const API = axios.create({
  baseURL: "https://ems-lp6w.onrender.com/api",
});

export default API;