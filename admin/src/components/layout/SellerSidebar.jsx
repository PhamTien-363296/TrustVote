import { BiHome, BiCopyAlt } from "react-icons/bi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { HiOutlineWallet } from "react-icons/hi2";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { FaUsers } from "react-icons/fa"; 
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SellerSidebar() {
    const { authUser, setAuthUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();


const handleLogout = async () => {
    try {
        await axios.post("/api/auth/logout", {}, { withCredentials: true });

        setAuthUser(null); 
        localStorage.removeItem("authUser"); 
        navigate("/login"); 

    } catch (error) {
        console.error("Lỗi đăng xuất:", error);
        alert("Đăng xuất thất bại! Thử lại sau.");
    }
};


    const menuItems = [
        { to: "/", label: "Trang chủ", icon: <BiHome /> },
        { to: "/election-list", label: "Đợt bầu cử", icon: <BiCopyAlt /> },
        { to: "/election-unit-list", label: "Đơn vị bầu cử", icon: <IoChatboxEllipsesOutline /> },
        { to: "/candidate-list", label: "Ứng cử viên", icon: <HiOutlineWallet /> },
        { to: "/voter-list", label: "Cử tri", icon: <AiOutlineProduct /> },
        { to: "/result-list", label: "Kết quả", icon: <AiOutlineProduct /> },
    ];

    if (authUser?.roleND === "ADMIN") {
        menuItems.push({ to: "/user-list", label: "Người dùng", icon: <FaUsers /> });
    }

    return (
        <div className='sidebar bg-blue-950 text-white min-h-screen max-h-full min-w-fit'>
            <div className='logo h-40'>
                {authUser ? (
                    <>
                        <p>Chào, {authUser.username}!</p>
                        <p>Chào, {authUser.roleND}!</p>
                    </>
                ) : (
                    <p>Bạn chưa đăng nhập.</p>
                )}
            </div>

            <ul>
                {menuItems.map((item) => (
                    <li
                        key={item.to}
                        className={`flex items-center w-47 gap-2 text-medium !px-7 !py-4 my-3 cursor-pointer 
                        ${location.pathname === item.to ? "text-blue-900 font-bold bg-slate-100" : "hover:bg-slate-100 hover:text-blue-900 hover:font-bold"}`}
                        onClick={() => navigate(item.to)}
                    >
                        {item.icon} {item.label}
                    </li>
                ))}

            
                <li
                    className="flex items-center w-47 gap-2 text-medium !px-7 !py-4 my-3 cursor-pointer hover:bg-red-600 hover:text-white font-bold"
                    onClick={handleLogout}
                >
                    <MdOutlineLogout /> Đăng xuất
                </li>
            </ul>
        </div>
    );
}

export default SellerSidebar;
