import { BiHome, BiCopyAlt } from "react-icons/bi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { HiOutlineWallet } from "react-icons/hi2";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SellerSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { to: "/", label: "Trang chủ", icon: <BiHome /> },
        { to: "/election-list", label: "Đợt bầu cử", icon: <BiCopyAlt /> },
        { to: "/election-unit-list", label: "Đơn vị bầu cử", icon: <IoChatboxEllipsesOutline /> },
        { to: "/candidate-list", label: "Ứng cử viên", icon: <HiOutlineWallet /> },
        { to: "/voter-list", label: "Cử tri", icon: <AiOutlineProduct /> },
        { to: "/result-list", label: "Kết quả", icon: <AiOutlineProduct /> },
        { to: "/dx", label: "Đăng xuất", icon: <MdOutlineLogout /> },
    ];

    return (
        <div className='sidebar bg-blue-950 text-white min-h-screen max-h-full min-w-fit'>
            <div className='logo h-40'></div>

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
            </ul>
        </div>
    );
}

export default SellerSidebar;
