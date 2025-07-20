import Navbar from '../components/Navbar';
import { Link, Outlet  } from 'react-router-dom';

const DashboardPage = () => {

  const handleClick = () => {
    const htmlElementBg = document.querySelector('.bg_das');
    const htmlElement = document.querySelector('#layout-menu_dashboard');

    if (htmlElement && htmlElementBg) {
      htmlElement.classList.toggle('layout-menu_dashboard_active');
      htmlElementBg.classList.toggle('layout__pagina_dashboard_active');
    }
  };

  return (
    <div>
        <div className='dashboard_layout'>
            <aside id="layout-menu_dashboard" className="layout-menu_dashboard">
                <div className="dashboard_menu_logo">
                    <Link to="/dashboard"><img src="../../public/images/logo.webp" alt="Logo" /></Link>
                </div>
                <Navbar />
            </aside>
            <div className="layout__pagina_dashboard">
                <Outlet />
            </div>
        </div>
        
        <div className='bg_das' onClick={handleClick}></div>
    </div>
  );
};

export default DashboardPage;
