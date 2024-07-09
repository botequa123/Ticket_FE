import React, { useState, useEffect, useCallback } from "react";
import ticketService from "../services/ticket.service";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTicketAlt, faTachometerAlt, faAngleLeft, faDoorOpen, faAngleDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import "../styles/TicketManagement.css";

const TicketManagement = () => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [currentTicket, setCurrentTicket] = useState({ title: "", description: "", department: "IT", priority: "Low", status: "Chưa xử lý", createdDate: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const [handlingData, setHandlingData] = useState({});
    const [handlingContent, setHandlingContent] = useState('');
    const [totalTickets, setTotalTickets] = useState(0);
    const [handler, setHandler] = useState('');


    const navigate = useNavigate();

    useEffect(() => {
        const ticketId = currentTicket.id;
        if (ticketId && handlingData[ticketId]) {
            setHandlingContent(handlingData[ticketId].handlingContent);
            setHandler(handlingData[ticketId].handler);
        } else {
            setHandlingContent('');
            setHandler('');
        }
    }, [currentTicket.id, handlingData]);


    useEffect(() => {
        if (currentTicket) {
            setHandlingContent(currentTicket.handlingContent || '');
            setHandler(currentTicket.handler || '');
        }
    }, [currentTicket]);
    const fetchTickets = async (page) => {
        try {
            const response = await ticketService.getTickets(page, itemsPerPage);
            setTickets(response.data.tickets);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        }
    };
    const fetchTotalTickets = useCallback(async () => {
        try {
            const response = await ticketService.getTotalTickets();
            setTotalTickets(response.data.totalTickets);
        } catch (error) {
            console.error("Không thể tải tổng số ticket!", error);
        }
    }, []);
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setLoggedInUser(currentUser);
            const roles = currentUser.roles.map(role => (typeof role === 'string' ? role : role.name));
            setUserRoles(roles);
            fetchTickets(currentPage);
            fetchTotalTickets();
        } else {
            navigate("/");
        }
    }, [navigate, currentPage, fetchTotalTickets]);
    const applyFilters = useCallback(() => {
        let filtered = tickets;

        if (selectedStatus) {
            filtered = filtered.filter(ticket => ticket.status === selectedStatus);
        }

        if (selectedPriority) {
            filtered = filtered.filter(ticket => ticket.priority === selectedPriority);
        }

        setFilteredTickets(filtered);
    }, [tickets, selectedStatus, selectedPriority]);
    useEffect(() => {
        applyFilters();
    }, [tickets, selectedStatus, selectedPriority, applyFilters]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentTicket({ ...currentTicket, [name]: value });

        if (name === 'status' && value !== 'Đã xử lý') {
            setHandlingContent('');
            setHandler('');
        }

        if (name === 'status' || name === 'handlingContent' || name === 'handler') {
            if (name === 'handlingContent') {
                setHandlingContent(value);
            }

            if (name === 'handler') {
                setHandler(value);
            }

            const isHandled = currentTicket.status === 'Đã xử lý' && handlingContent && handler;
            setCurrentTicket((prevTicket) => ({
                ...prevTicket,
                isHandled
            }));
        }
    };

    const createTicket = async () => {
        try {
            await ticketService.createTicket(currentTicket);
            Swal.fire('Tạo thành công ticket!', '', 'success');
            fetchTickets(currentPage);
            resetForm();
        } catch (error) {
            Swal.fire('Error!', 'Không thể tạo ticket', 'error');
        }
    };
    const updateTicket = async () => {
        try {
            const ticketToUpdate = { ...currentTicket };
            if (ticketToUpdate.status === 'Đã xử lý') {
                ticketToUpdate.handlingContent = handlingContent;
                ticketToUpdate.handler = handler;
            } else {
                delete ticketToUpdate.title;
                delete ticketToUpdate.description;
            }
            await ticketService.updateTicket(currentTicket._id, ticketToUpdate);
            Swal.fire('Cập nhật ticket thành công !', '', 'success');
            fetchTickets(currentPage);
            resetForm();
        } catch (error) {
            Swal.fire('Error!', 'Không thể cập nhật ticket', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateTicket();
            } else {
                await createTicket();
            }
            const ticketId = currentTicket.id;
            setHandlingData(prevData => ({
                ...prevData,
                [ticketId]: {
                    handlingContent,
                    handler
                }
            }));
            resetForm();

            setIsModalVisible(false);
            fetchTickets(currentPage);
            fetchTotalTickets();
        } catch (error) {
            Swal.fire('Error!', 'Có lỗi xảy ra', 'error');
        }
    };

    const handleEdit = (ticket) => {
        if (userRoles.includes('admin') || userRoles.includes('IT')) {
            setCurrentTicket(ticket);
            setIsEditing(true);
            setIsModalVisible(true);
        } else {
            Swal.fire('Bạn không có quyền sửa ticket!', '', 'error');
        }
    };

    const handleDelete = (ticketId) => {
        if (userRoles.includes('admin') || userRoles.includes('IT')) {
            Swal.fire({
                title: 'Bạn có chắc muốn xóa ticket không?',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy bỏ',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await ticketService.deleteTicket(ticketId);
                        Swal.fire('Đã xóa !', '', 'success');
                        fetchTickets(currentPage);
                        fetchTotalTickets();
                    } catch (error) {
                        console.error("Lỗi ! Xóa ticket thất bại", error);
                        Swal.fire('Error!', 'Không thể xóa ticket', 'error');
                    }
                }
            });
        } else {
            Swal.fire('Bạn không có quyền xóa ticket!', '', 'error');
        }
    };

    const handleAddNewTicket = () => {
        resetForm();
        setIsEditing(false);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };
    const handleCloseViewModal = () => {
        setIsViewModalVisible(false);
    };
    const handleView = (ticket) => {
        setCurrentTicket(ticket);
        setIsViewModalVisible(true);
    };

    const handleRowClick = (ticketId) => {
        setSelectedTicketId(ticketId);
    };
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High':
                return 'priority-high';
            case 'Medium':
                return 'priority-medium';
            case 'Low':
                return 'priority-low';
            default:
                return '';
        }
    };
    const getStatusClass = (status) => {
        switch (status) {
            case 'Chưa xử lý':
                return 'status-chua-xu-ly';
            case 'Đang xử lý':
                return 'status-dang-xu-ly';
            case 'Đã xử lý':
                return 'status-da-xu-ly';
            default:
                return '';
        }
    };
    const resetForm = () => {
        setCurrentTicket({ title: "", description: "", department: "IT", priority: "Low", status: "Chưa xử lý", createdDate: "", handler: "", handlingContent: "" });
        setIsEditing(false);
        setIsModalVisible(false);
    };
    const handleLogout = () => {
        authService.logout();
        navigate("/");
    };
    const toggleFilterVisibility = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    const SidebarMenu = () => {
        const [isMenuOpen, setIsMenuOpen] = useState(false);

        const toggleMenu = () => {
            setIsMenuOpen(!isMenuOpen);
        };

        return (
            <nav className="mt-2">
                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <div className="nav-item" role="menuitem">
                        <button
                            className={`nav-link ${isMenuOpen ? 'active' : ''}`}
                            onClick={toggleMenu}
                            style={{ background: 'none', border: 'none', color: 'white', textAlign: 'left' }}
                        >
                            <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                            <p>
                                Danh mục
                                <FontAwesomeIcon icon={isMenuOpen ? faAngleDown : faAngleLeft} className="right" />
                            </p>
                        </button>
                        <ul className="nav nav-treeview" style={{ display: isMenuOpen ? 'block' : 'none' }} role="menu">
                            <div className="nav-item" role="none">
                                <a href="/TicketManagement" className='nav-link' role="menuitem">
                                    <FontAwesomeIcon icon={faTicketAlt} className="nav-icon" />
                                    <p> Quản lý Ticket</p>
                                </a>
                            </div>
                            {userRoles.includes("admin") && (
                                <div className="nav-item" role="none">
                                    <a href="/UserManagement" className='nav-link' role="menuitem">
                                        <FontAwesomeIcon icon={faUser} className="nav-icon" />
                                        <p> Quản lý người dùng</p>
                                    </a>
                                </div>
                            )}
                        </ul>
                    </div>
                </ul>
            </nav>
        );
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                {/* Left navbar links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button className="nav-link" data-widget="pushmenu" style={{ background: 'none', border: 'none' }}>
                            <i className="fas fa-bars" />
                        </button>
                    </li>
                    <div className="nav-item d-none d-sm-inline-block">
                        <a href="/home" className="nav-link">Home</a>
                    </div>
                    <div className="nav-item d-none d-sm-inline-block">
                        <a href="http://www.phongphucorp.com/contact.html" className="nav-link">Liên Hệ</a>
                    </div>
                </ul>
                {/* Right navbar links */}
                <ul className="navbar-nav ml-auto">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User" />
                        </div>
                        <div className="info">
                            <p className="d-block">{loggedInUser && <span>{loggedInUser.username}</span>}</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <button className="nav-link" data-widget="fullscreen" style={{ background: 'none', border: 'none' }}>
                            <i className="fas fa-expand-arrows-alt" />
                        </button>
                    </div>
                    <div className="nav-item">
                        <button className="btn btn-navbar" onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit' }}>
                            <FontAwesomeIcon icon={faDoorOpen} /> Đăng Xuất
                        </button>
                    </div>
                </ul>
            </nav>
            {/* /.navbar */}
            <div>
                {/* Main Sidebar Container */}
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    {/* Brand Logo */}
                    <a href="/home" className="brand-link">
                        <img src="dist/img/phongphu_logo.jpg" alt="Phong Phu logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                        <span className="brand-text font-weight-light">Phong Phu</span>
                    </a>
                    {/* Sidebar */}
                    <div className="sidebar">
                        {/* Sidebar Menu */}
                        <SidebarMenu />
                        {/* /.sidebar-menu */}
                    </div>
                    {/* /.sidebar */}
                </aside>
            </div>
            {/* Content Wrapper. Contains page content */}
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Quản lý ticket</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <div className="breadcrumb-item"><a href="home">Home</a></div>
                                    <div className="breadcrumb-item active">Quản Lý Ticket</div>
                                </ol>
                            </div>{/* /.col */}
                        </div>{/* /.row */}
                    </div>{/* /.container-fluid */}
                </div>
                {/* /.content-header */}
                {/* Main content */}
                <section className="content">
                    <div className="container-fluid">
                        <button className="btn btn-primary mb-3" onClick={handleAddNewTicket}>Thêm Ticket</button>
                        <button onClick={toggleFilterVisibility} className="filter-button">
                            <FontAwesomeIcon icon={faFilter} />
                        </button>
                        <div>
                            {totalTickets && (
                                <strong>Tổng số Ticket: {totalTickets}</strong>
                            )}
                        </div>
                        {isFilterVisible && (
                            <div className="filter-container">
                                <div className="form-group">
                                    <label htmlFor="filter-status">Lọc theo trạng thái:</label>
                                    <select
                                        id="filter-status"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="Chưa xử lý">Chưa xử lý</option>
                                        <option value="Đang xử lý">Đang xử lý</option>
                                        <option value="Đã xử lý">Đã xử lý</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="filter-priority">Lọc theo ưu tiên:</label>
                                    <select
                                        id="filter-priority"
                                        value={selectedPriority}
                                        onChange={(e) => setSelectedPriority(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Trạng thái</th>
                                    <th>ID</th>
                                    <th>Ưu tiên</th>
                                    <th>Ngày yêu cầu</th>
                                    <th>Tiêu đề</th>
                                    <th>Mô tả</th>
                                    <th>Bộ phận xử lý</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket, index) => (
                                    <tr
                                        key={ticket._id}
                                        onClick={() => handleRowClick(ticket._id)}
                                        className={selectedTicketId === ticket._id ? 'selected-row' : ''}
                                    >
                                        <td className={getStatusClass(ticket.status)}>{ticket.status}</td>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className={getPriorityClass(ticket.priority)}>{ticket.priority}</td>
                                        <td>{new Date(ticket.createdDate).toLocaleString()}</td>
                                        <td>{ticket.title}</td>
                                        <td>{ticket.description}</td>
                                        <td>{ticket.department}</td>
                                        <td className="actions-column">
                                            <button className="btn btn-info" onClick={() => handleView(ticket)}>Xem</button>
                                            <button className="btn btn-warning" onClick={() => handleEdit(ticket)}>Sửa</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(ticket._id)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                    <div className="card-footer clearfix">
                        <ul className="pagination pagination-sm m-0 float-right">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>«</button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>»</button>
                            </li>
                        </ul>
                    </div>
                </section>
                {/* /.content */}
            </div>
            {/* /.content-wrapper */}
            {/* Control Sidebar */}
            <aside className="control-sidebar control-sidebar-dark">
                {/* Control sidebar content goes here */}
            </aside>
            {/* /.control-sidebar */}

            {isModalVisible && (
                <div className="edit-modal">
                    <div className="edit-modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <form className="ticket-management-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="title">Tiêu đề:
                                    <input
                                        type="text"
                                        name="title"
                                        value={currentTicket.title || ""}
                                        onChange={handleInputChange}
                                        disabled={isEditing}
                                        required
                                    />
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Mô tả:
                                    <input
                                        type="text"
                                        name="description"
                                        value={currentTicket.description || ""}
                                        onChange={handleInputChange}
                                        disabled={isEditing}
                                        required
                                    />
                                </label>
                            </div>
                            {!userRoles.includes('user') && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="department">Bộ phận xử lý:
                                            <input
                                                type="text"
                                                name="department"
                                                value={currentTicket.department || ""}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="priority">Ưu tiên:
                                            <select
                                                name="priority"
                                                placeholder="Ưu tiên"
                                                value={currentTicket.priority || ""}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">Trạng thái:
                                            <select
                                                name="status"
                                                placeholder="Trạng thái"
                                                value={currentTicket.status || ""}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Chưa xử lý">Chưa xử lý</option>
                                                <option value="Đang xử lý">Đang xử lý</option>
                                                <option value="Đã xử lý">Đã xử lý</option>
                                            </select>
                                        </label>
                                    </div>
                                    {currentTicket.status === 'Đã xử lý' && (
                                        <>
                                            <div className="form-group">
                                                <label htmlFor="handlingContent">Nội dung xử lý:
                                                    <input
                                                        type="text"
                                                        name="handlingContent"
                                                        placeholder="Nội dung xử lý"
                                                        value={handlingContent || ""}
                                                        onChange={handleInputChange}
                                                    />
                                                </label>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="handler">Người xử lý:
                                                    <input
                                                        type="text"
                                                        name="handler"
                                                        placeholder="Người xử lý"
                                                        value={handler || ""}
                                                        onChange={handleInputChange}
                                                    />
                                                </label>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                            <button type="submit" className="form-button">{isEditing ? "Cập nhật" : "Tạo mới"}</button>
                        </form>
                    </div>
                </div>
            )}

            {isViewModalVisible && (
                <div className="view-modal">
                    <div className="view-modal-content">
                        <h2>Chi tiết Ticket</h2>
                        <div className="view-modal-section">
                            <label>Tiêu đề:</label>
                            <p>{currentTicket.title}</p>
                        </div>
                        <div className="view-modal-section">
                            <label>Mô tả:</label>
                            <p>{currentTicket.description}</p>
                        </div>
                        <div className="view-modal-section">
                            <label>Phòng ban:</label>
                            <p>{currentTicket.department}</p>
                        </div>
                        <div className="view-modal-section">
                            <label>Độ ưu tiên:</label>
                            <p>{currentTicket.priority}</p>
                        </div>
                        <div className="view-modal-section">
                            <label>Trạng thái:</label>
                            <p>{currentTicket.status}</p>
                        </div>
                        {currentTicket.status === 'Đã xử lý' && (
                            <>
                                <div className="view-modal-section">
                                    <label>Nội dung xử lý:</label>
                                    <p>{handlingContent}</p>
                                </div>
                                <div className="view-modal-section">
                                    <label>Người xử lý:</label>
                                    <p>{handler}</p>
                                </div>
                            </>
                        )}
                        <div className="view-modal-actions">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseViewModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="main-footer">
                <div className="float-right d-none d-sm-block">
                    <strong>Copyright © 2014-2021 <a href="http://www.phongphucorp.com/">Phong Phu Corp</a>.</strong> All rights reserved.
                </div>
                <p className="cp-footer">TỔNG CÔNG TY CỔ PHẦN PHONG PHÚ</p>
                <p className="info-footer">48 Tăng Nhơn Phú, KP3, P. Tăng Nhơn Phú B, TP. Thủ Đức, TP. HCM, Việt Nam</p>
                <p className="info-footer">Điện Thoại: 028 6684 7979 - Fax: 028 3728 1893</p>
                <p className="info-footer">E-mail:  <a className="mailto" href="mailto:info@phongphucorp.com">info@phongphucorp.com</a></p>
            </footer>
        </div>
    );
};

export default TicketManagement;
