import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const AuthContext2 = createContext(null);

export const AuthProvider2 = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
        try {
            const response = await axios.get("/api/auth/getme",{
                withCredentials: true,
            });
            localStorage.setItem("chat-user", JSON.stringify(response.data));
            console.log("Thông tin người dùng", response.data);
            setUser(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng", error);
        } finally {
            setLoading(false);
        }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext2.Provider value={{ user, loading, setUser }}>
        {children}
        </AuthContext2.Provider>
    );
};

AuthProvider2.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext2);
