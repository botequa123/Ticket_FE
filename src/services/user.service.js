import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;

class UserService {
    getUsers(page = 1, limit = 10, role = '') {
        let url = `${API_URL}auth/users?page=${page}&limit=${limit}`;
        if (role) {
            url += `&role=${role}`;
        }
        return axios.get(url, { headers: authHeader() });
    }

    getRoles() {
        return axios.get(API_URL + 'auth/roles', { headers: authHeader() });
    }

    createUser(user) {
        return axios.post(API_URL + 'auth/users', user, { headers: authHeader() });
    }

    updateUser(userId, user) {
        return axios.put(API_URL + `auth/users/${userId}`, user, { headers: authHeader() });
    }

    deleteUser(userId) {
        return axios.delete(API_URL + `auth/users/${userId}`, { headers: authHeader() });
    }
    getTotalUsers = () => {
        return axios.get(API_URL + "users/total", { headers: authHeader() });
    };
}

const userService = new UserService();
export default userService;