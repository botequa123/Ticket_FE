import axios from "axios";

const API_URL = "https://ticket-phongphu.onrender.com/api/";

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "auth/signin", { username, password })
            .then((response) => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                    window.location.href = "/Home";
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
        window.location.href = "/";
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                console.error("Error parsing user data:", e);
                return null;
            }
        }
        return null;
    }

    async getUsers() {
        return axios.get(API_URL + 'auth/users', {
            headers: {
                Authorization: `Bearer ${this.getCurrentUser().accessToken}`
            }
        });
    }

    async getRoles() {
        return axios.get(API_URL + 'auth/roles', {
            headers: {
                Authorization: `Bearer ${this.getCurrentUser().accessToken}`
            }
        });
    }

    async updateUserRoles(userId, roles) {
        return axios.put(`${API_URL}auth/users/${userId}/roles`, { roles: roles }, {
            headers: {
                Authorization: `Bearer ${this.getCurrentUser().accessToken}`
            }
        });
    }
}

const authService = new AuthService();

export default authService;
