import axios from "axios";

export default axios.create({
    baseURL: "https://ticket-phongphu.onrender.com/api",
    headers: {
        "Content-type": "application/json"
    }
});