import React, { useState, useEffect, useCallback } from "react";
import userService from "../services/user.service";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTicketAlt, faTachometerAlt, faAngleLeft, faDoorOpen, faAngleDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import "../styles/UserManagement.css";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [currentUser, setCurrentUser] = useState({ username: "", email: "", password: "", roles: "user" });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const [selectedRoleFilter, setSelectedRoleFilter] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const navigate = useNavigate();

    const fetchUsers = useCallback(async (page, roleFilter = '') => {
        try {
            const response = await userService.getUsers(page, itemsPerPage, roleFilter);
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error("Tải lại danh sách người dùng thất bại!", error);
        }
    }, [itemsPerPage]);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await authService.getRoles();
            setRoles(response.data);
        } catch (error) {
            console.error("Tải lại danh sách vai trò thất bại!", error);
        }
    }, []);
    const fetchTotalUsers = useCallback(async () => {
        try {
            const response = await userService.getTotalUsers();
            setTotalUsers(response.data.totalUsers);
        } catch (error) {
            console.error("Không thể tải tổng số người dùng!", error);
        }
    }, []);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setLoggedInUser(currentUser);
            const roles = currentUser.roles.map(role => (typeof role === 'string' ? role : role.name));
            setUserRoles(roles);
            if (!roles.includes("admin")) {
                navigate("/Home");
            } else {
                fetchUsers(currentPage, selectedRoleFilter);
                fetchRoles();
                fetchTotalUsers();
            }
        } else {
            navigate("/");
        }
    }, [navigate, currentPage, selectedRoleFilter, fetchUsers, fetchRoles, fetchTotalUsers]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    const handleRoleChange = (e) => {
        setCurrentUser({ ...currentUser, roles: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                const updatedUser = { ...currentUser };

                if (!updatedUser.password) {
                    delete updatedUser.password;
                }
                if (!updatedUser.username) {
                    delete updatedUser.username;
                }
                if (!updatedUser.email) {
                    delete updatedUser.email;
                }

                await userService.updateUser(updatedUser._id, updatedUser);
                Swal.fire('Đã cập nhật người dùng!', '', 'success');
            } else {
                if (!currentUser.password) {
                    Swal.fire('Lỗi!', 'Mật khẩu là bắt buộc cho người dùng mới.', 'error');
                    return;
                }

                await userService.createUser(currentUser);
                Swal.fire('Đã tạo người dùng!', '', 'success');
            }

            fetchUsers(currentPage);
            fetchTotalUsers();
            setCurrentUser({ username: "", email: "", password: "", roles: "" });
            setIsEditing(false);
            setIsModalVisible(false);
        } catch (error) {
            console.error("Failed to save user:", error.response ? error.response.data.message : error.message);
            if (error.response && error.response.data.message.includes("Tên người dùng hoặc email đã tồn tại")) {
                Swal.fire('Lỗi!', 'Tên người dùng hoặc email đã tồn tại.', 'error');
            }
        }
    };

    const handleEdit = (user) => {
        const roleName = user.roles && user.roles.length > 0 ? user.roles[0].name : "";
        setCurrentUser({ ...user, password: "", roles: roleName });
        setIsEditing(true);
        setIsModalVisible(true);
    };

    const handleDelete = (userId) => {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa người dùng?',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy bỏ',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await userService.deleteUser(userId);
                    fetchUsers(currentPage);
                    fetchTotalUsers();
                    Swal.fire('Đã xóa!', '', 'success');
                } catch (error) {
                    console.error("Failed to delete user:", error.response ? error.response.data.message : error.message);
                    Swal.fire('Lỗi!', 'Không thể xóa người dùng.', 'error');
                }
            }
        });
    };

    const handleAddNewUser = () => {
        setCurrentUser({ username: "", email: "", password: "", roles: "user" });
        setIsEditing(false);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleRowClick = (userId) => {
        setSelectedUserId(userId);
    };

    const handleLogout = () => {
        authService.logout();
        navigate("/");
    };
    const handleFilterChange = (e) => {
        const role = e.target.value;
        setSelectedRoleFilter(role);
        fetchUsers(1, role);
        setCurrentPage(1);
    };
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const SidebarMenu = () => {
        const [isMenuOpen, setIsMenuOpen] = useState(true);

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
                                <h1 className="m-6">Quản Lý Người Dùng</h1>
                            </div>{/* /.col */}
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <div className="breadcrumb-item"><a href="home">Home</a></div>
                                    <div className="breadcrumb-item active">Quản Lý Người Dùng</div>
                                </ol>
                            </div>{/* /.col */}
                        </div>{/* /.row */}
                    </div>{/* /.container-fluid */}
                </div>
                {/* /.content-header */}
                {/* Main content */}
                <section className="content">
                    <div className="container-fluid">
                        <div className="header-buttons">
                            <button className="btn btn-primary mb-3" onClick={handleAddNewUser}>Thêm người dùng</button>
                            <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="filter-button">
                                <FontAwesomeIcon icon={faFilter} />
                            </button>
                            {isFilterVisible && (
                                <div className="filter-container">
                                    <label htmlFor="roleFilter">Chọn Vai Trò:</label>
                                    <select id="roleFilter" className="form-control" value={selectedRoleFilter} onChange={handleFilterChange}>
                                        <option value="">Tất Cả</option>
                                        {roles.map(role => (
                                            <option key={role._id} value={role.name}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        {totalUsers && (
                            <strong>Tổng số người dùng: {totalUsers}</strong>
                        )}
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tài khoản</th>
                                    <th>Email</th>
                                    <th className="role-column">Vai trò</th>
                                    <th className="actions-column">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        onClick={() => handleRowClick(user._id)}
                                        className={selectedUserId === user._id ? 'selected-row' : ''}
                                    >
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.roles.map((role) => role.name).join(", ")}</td>
                                        <td className="actions-column">
                                            <button className="btn btn-warning" onClick={(e) => handleEdit(user, e)}>Sửa</button>
                                            <button className="btn btn-danger" onClick={(e) => handleDelete(user._id, e)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="card-footer clearfix">
                        <ul className="pagination pagination-sm m-0 float-right">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>«</button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>»</button>
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
                <div className="user-modal">
                    <div className="user-modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <form className="user-management-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Tài khoản</label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={currentUser.username || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={currentUser.email || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Mật khẩu</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={currentUser.password || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="roles">Vai trò</label>
                                <select
                                    name="roles"
                                    id="roles"
                                    value={currentUser.roles || ""}
                                    onChange={handleRoleChange}
                                    required
                                >
                                    {roles.map((role) => (
                                        <option key={role._id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="form-button">{isEditing ? "Cập nhật" : "Tạo mới"}</button>
                        </form>
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
export default UserManagement;