// components/Login.js
import React, { useState } from "react";
import authService from "../services/auth.service";
import phongphuLogo from '../image/phongphu_logo.jpg';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        authService.login(username, password).then(
            (accessToken) => {
                if (accessToken) {
                    window.location.href = "/Home";
                } else {
                    setMessage("Đăng nhập không thành công. Vui lòng thử lại.");
                }
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
            }
        );
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <img src={phongphuLogo} className="login-logo" alt="Phong Phú Logo" />
                <p></p>
                <div className="input-group">
                    <label htmlFor="username">Tài Khoản:</label>
                    <input type="text" id="username" name="username" placeholder="Nhập tài khoản"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Mật Khẩu:</label>
                    <input type="password" id="password" name="password" placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="login-button">Đăng Nhập</button>
                {message && <div className="error-message">{message}</div>}
            </form>
        </div>
    );
};

export default Login;
