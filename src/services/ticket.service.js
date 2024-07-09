import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://ticket-phongphu.onrender.com/api/tickets";

class TicketService {
    getTickets = (page = 1, limit = 10) => {
        return axios.get(`${API_URL}?page=${page}&limit=${limit}`, { headers: authHeader() });
    };

    createTicket = (ticket) => {
        return axios.post(API_URL, ticket, { headers: authHeader() });
    };

    updateTicket = (id, ticket) => {
        return axios.put(`${API_URL}/${id}`, ticket, { headers: authHeader() });
    };

    deleteTicket = (id) => {
        return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
    };
    getTotalTickets = () => {
        return axios.get(`${API_URL}/total`, { headers: authHeader() });
    };
}
const ticketService = new TicketService();
export default ticketService;
