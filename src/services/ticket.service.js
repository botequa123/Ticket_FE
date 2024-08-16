import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;

class TicketService {
    getTickets = (page = 1, limit = 10, priority, status) => {
        let query = `page=${page}&limit=${limit}`;
        if (priority) query += `&priority=${priority}`;
        if (status) query += `&status=${status}`;
        return axios.get(`${API_URL}tickets?${query}`, { headers: authHeader() });
    };

    createTicket = (ticket) => {
        return axios.post(`${API_URL}tickets`, ticket, { headers: authHeader() });
    };

    updateTicket = (id, ticket) => {
        return axios.put(`${API_URL}tickets/${id}`, ticket, { headers: authHeader() });
    };

    deleteTicket = (id) => {
        return axios.delete(`${API_URL}tickets/${id}`, { headers: authHeader() });
    };
    getTotalTickets = () => {
        return axios.get(`${API_URL}tickets/total`, { headers: authHeader() });
    };
}
const ticketService = new TicketService();
export default ticketService;