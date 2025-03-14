import { useEffect } from "react";
import PropTypes from 'prop-types';

const ThongBao = ({ mess, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!mess) return null;

    return (
        <div className="fixed top-5 right-5 bg-green-500 text-white p-3 rounded-lg shadow-lg flex items-center gap-3">
            <span>{mess}</span>
            <button onClick={onClose} className="ml-2 text-white font-bold">
                ✖
            </button>
        </div>
    );
};
ThongBao.propTypes = {
    mess: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};
export default ThongBao;
