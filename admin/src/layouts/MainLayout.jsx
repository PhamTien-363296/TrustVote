import PropTypes from 'prop-types';
import SellerSidebar from '../components/layout/SellerSidebar';

const MainLayout = ({ children }) => {
    return (
        <div className='main-seller-layout flex bg-slate-100 overflow-x-auto h-full'>
            <SellerSidebar/>
            <div className='seller-content flex flex-col flex-1 overflow-x-auto'>
                <div className='bg-blue-950 h-3 w-full'></div>
                {children}
                <div className='bg-blue-950 h-3 w-full'></div>
            </div>
            <div className='bg-blue-950 min-h-screen max-h-full w-3'></div>
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;