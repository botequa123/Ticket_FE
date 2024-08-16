import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTicketAlt, faTachometerAlt, faAngleLeft, faDoorOpen, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import "../styles/Home.css";

const Home = () => {
    const [user, setUser] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            const roles = currentUser.roles.map(role => (typeof role === 'string' ? role : role.name));
            setUserRoles(roles);
        } else {
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate("/");
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
                    <li className="nav-item d-none d-sm-inline-block">
                        <a href="/home" className="nav-link">Home</a>
                    </li>
                    <li className="nav-item d-none d-sm-inline-block">
                        <a href="http://www.phongphucorp.com/contact.html" className="nav-link">Liên Hệ</a>
                    </li>
                </ul>
                {/* Right navbar links */}
                <ul className="navbar-nav ml-auto">
                    {/* Info */}
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User" />
                        </div>
                        <div className="info">
                            <p className="d-block">{user && <span>{user.username}</span>}</p>
                        </div>
                    </div>
                    <li className="nav-item">
                        <button className="nav-link" data-widget="fullscreen" style={{ background: 'none', border: 'none' }}>
                            <i className="fas fa-expand-arrows-alt" />
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="btn btn-navbar" onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit' }}>
                            <FontAwesomeIcon icon={faDoorOpen} /> Đăng Xuất
                        </button>
                    </li>
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
                {/* Main Content */}
                <div className="content-wrapper">
                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="wapper-main">
                                    <div className="in-main-wrapper">
                                        <div className="ct-left ct-product-left">
                                            <div className="ct-left-content ct-product-left-content">
                                                <span className="b-intro">Giới thiệu </span>
                                                <div>
                                                    <div style={{ textAlign: 'justify' }}>
                                                        Tổng Công ty CP Phong Phú trải qua hơn 54 năm hình thành và phát triển. Suốt chặng đường dài ấy, Phong Phú không ngừng lớn mạnh về mọi mặt. Tổng công ty vinh dự được Đảng và Nhà nước trao tặng danh hiệu Anh hùng Lao động và là doanh nghiệp hoàn thiện chuỗi sản xuất khép kín hàng đầu Tập đoàn Dệt May Việt Nam.</div>
                                                    <div style={{ textAlign: 'justify' }}>
                                                        &nbsp;</div>
                                                    <div style={{ textAlign: 'justify' }}>
                                                        Tiền thân của Tổng Công ty CP Phong Phú là Khu Kỹ nghệ Sicovina - Phong Phú trực thuộc Công ty kỹ nghệ Bông vải Việt Nam. Nhà máy đặt viên đá đầu tiên xây dựng ngày 14/10/1964 và chính thức đi vào hoạt động năm 1966, do chính quyền Sài Gòn cũ trực tiếp quản lý.</div>
                                                </div>
                                                <div>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <img alt="true" src="dist/img/vien-da-dau-tien.jpg" style={{ width: 640, height: 461 }} /></div>
                                                <div style={{ textAlign: 'center' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <em>Viên đá đầu tiên</em></div>
                                                <div style={{ textAlign: 'center' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    Tại thời điểm đó, Sicovina - Phong Phú là một nhà máy có quy mô nhỏ gồm 3 xưởng sản xuất (Sợi - Dệt - Nhuộm), với tổng số CB.CNV hơn 1.050 người. Sản phẩm chủ yếu là sợi và một số mặt hàng vải như Satin, Batist, Crèstone, Khaki, vải xiêm, vải ú đen… cung cấp phần lớn cho quân đội và một ít bán về các vùng nông thôn.</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    Nhà máy ban đầu với 40.000m<sup>2</sup> cơ xưởng trên một thửa đất rộng 17 mẫu tại làng Tăng Nhơn Phú thuộc quận Thủ Đức bên cạnh Xa Lộ - nay là Phường Tăng Nhơn Phú B, quận 9, TP. Hồ Chí Minh.</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    Sau giải phóng (ngày 30/04/1975), nhà máy được đổi tên thành Nhà máy Dệt Phong Phú. Nhà nước giao cho CB.CNV nhà máy tiếp quản và duy trì sản xuất. Trong những năm 1980, sản phẩm của nhà máy chủ yếu là vải bảo hộ lao động và calicot giao cho Liên Xô theo kế hoạch của Nhà nước. Sau đó, nhà máy sản xuất vải jeans, sợi polyester và sợi Peco. Suốt chặng đường từ năm 1976 - 1985, Nhà máy Dệt Phong Phú là một trong những đơn vị liên tục hoàn thành và hoàn thành vượt mức các chỉ tiêu kế hoạch Nhà nước giao, bình quân mỗi năm vượt mức kế hoạch từ 10 - 15%.</div>
                                                <div style={{ textAlign: 'center' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <img alt="true" src="dist/img/LS_02.jpg" style={{ width: 640, height: 446 }} /></div>
                                                <div style={{ textAlign: 'center' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <em>Phong Phú xưa</em></div>
                                                <div style={{ textAlign: 'center' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    Từ năm 1986 đến năm 2002, thực hiện chính sách đổi mới của Đảng và Nhà nước, CB.CNV Phong Phú đã chung sức, chung lòng đưa công ty từng bước phát triển đi lên vững chắc, luôn là đơn vị dẫn đầu ngành dệt may Việt Nam. Sản phẩm trong giai đoạn này ngoài vải, sợi, Phong Phú còn phát triển mặt hàng khăn bông, vải katé sọc, vải jeans, liên doanh với Tập đoàn Coats của Vương quốc Anh sản xuất chỉ may.</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    Từ năm 2003 đến nay, Phong Phú đã có những bước phát triển vượt bậc về mọi mặt - doanh thu, tốc độ tăng trưởng, lợi nhuận, nộp ngân sách, chăm lo đời sống vật chất tinh thần CB.CNV… Dệt may là lĩnh vực cốt lõi, Phong Phú liên kết với các đơn vị trong và ngoài ngành dệt may trên khắp cả nước phát triển thêm nhiều sản phẩm, dịch vụ chất lượng cao...</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    Đầu năm 2006, được sự chấp thuận của lãnh đạo Tập đoàn Dệt May Việt Nam và Bộ Công Nghiệp (nay là Bộ Công Thương), Phong Phú đã mạnh dạn xây dựng đề án chuyển đổi cơ cấu tổ chức thành Tổng công ty hoạt động theo mô hình Công ty mẹ - Công ty con. Căn cứ yêu cầu phát triển, quy mô và tình hình thực tế hoạt động của Phong Phú, Thủ tướng Chính phủ đã phê duyệt và cho triển khai thực hiện đề án chuyển đổi cơ cấu tổ chức thành Tổng Công ty. Ngày 11/01/2007, Bộ trưởng Bộ Công Nghiệp đã ra quyết định số 06/2007/QĐ-BCN thành lập Tổng Công ty Phong Phú. Việc cải tiến chuyển đổi cơ cấu tổ chức quản lý Tổng Công ty hoạt động theo mô hình Công ty mẹ - Công ty con tạo nên sự liên kết bền chặt, xác định rõ quyền lợi, trách nhiệm về vốn và lợi ích kinh tế giữa công ty mẹ Phong Phú với các công ty con. Qua đó, tăng cường năng lực sản xuất, tiếp thị, cung ứng, nghiên cứu, đào tạo… tạo điều kiện để Phong Phú phát triển thành đơn vị kinh tế mạnh đủ sức cạnh tranh và hội nhập với nền kinh tế trong khu vực và thế giới.</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <img alt="true" src="dist/img/LS_03.jpg" style={{ width: 640, height: 438 }} /></div>
                                                <div style={{ textAlign: 'center' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <em>Phong Phú hôm nay</em></div>
                                                <div style={{ textAlign: 'center' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    Trong năm 2007 - 2008, Tổng Công ty đã cổ phần hóa và chuyển đổi xong các hệ thống sản xuất. Tiếp theo lộ trình, với mục tiêu tự chủ hơn về nguồn vốn quản lý, tìm kiếm cơ hội để đa dạng hóa sản xuất kinh doanh, Phong Phú đã triển khai cổ phần hóa Tổng công ty mẹ và tổ chức thành công đại hội đồng cổ đông lần đầu ngày 15/01/2009. Có thể nói, đây là một bước ngoặt lớn trong quá trình phát triển của Phong Phú.</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    &nbsp;</div>
                                                <div style={{ textAlign: 'justify' }}>
                                                    <div>
                                                        Năm 2014, Tổng công ty tái cấu trúc, hoàn thiện chuỗi cung ứng khép kín từ sợi - dệt - nhuộm - may, đón đầu các hiệp định thương mại tự do, gia tăng nội lực doanh nghiệp và tăng tốc đầu tư.</div>
                                                    <div>
                                                        &nbsp;</div>
                                                    <div>
                                                        Phong Phú nghiên cứu đầu tư và phát triển dây chuyền khép kín sản xuất vải denim dệt kim và liên tục nghiên cứu những sản phẩm đặc biệt, mang tính khác biệt cao tại Nha Trang, nhà máy đi vào hoạt động vào quý 1 năm 2017.</div>
                                                    <div>
                                                        &nbsp;</div>
                                                    <div>
                                                        Hiện nay, Phong Phú không ngừng đổi mới, phát triển lớn mạnh, tùy theo từng giai đoạn phát triển mà Tổng công ty có những định hướng chiến lược riêng, linh hoạt, tận dụng những ưu thế của thị trường và nguồn lực, liên tục giữ vững vị thế hàng đầu Tập đoàn Dệt May Việt Nam.</div>
                                                </div>
                                                <div>
                                                    &nbsp;</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                </div>
                {/* /.content-wrapper */}
                {/* footer */}
                <footer className="main-footer">
                    <div className="float-right d-none d-sm-block">
                        <strong>Copyright © 2014-2021 <a href="http://www.phongphucorp.com/">Phong Phu Corp</a>.</strong> All rights reserved.
                    </div>
                    <p className="cp-footer">TỔNG CÔNG TY CỔ PHẦN PHONG PHÚ</p>
                    <p className="info-footer">48 Tăng Nhơn Phú, KP3, P. Tăng Nhơn Phú B, TP. Thủ Đức, TP. HCM, Việt Nam</p>
                    <p className="info-footer">Điện Thoại: 028 6684 7979 - Fax: 028 3728 1893</p>
                    <p className="info-footer">E-mail: <a className="mailto" href="mailto:info@phongphucorp.com">info@phongphucorp.com</a></p>
                </footer>
            </div>
        </div>
    );
};
export default Home;