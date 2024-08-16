import axios from "axios";

export default axios.create({
    baseURL: "https://192.168.47.3/api",
    headers: {
        "Content-type": "application/json"
    }
});