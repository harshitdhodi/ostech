import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Phone, ShoppingBag, Users, Info, Settings } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';

const iconComponents = {
  home: Home,
  phone: Phone,
  shopping: ShoppingBag,
  users: Users,
  info: Info,
  settings: Settings,
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [logos, setLogos] = useState({
    primary: { photo: '', alt: '' },
    secondary: { photo: '', alt: '' }
  });
  const location = useLocation();

  // Fetch menu items and logos from API
  useEffect(() => {
    // Fetch menu items
    const fetchMenuItems = axios.get('/api/menulisting/getAllMenulisting');
    // Fetch logos
    const fetchLogos = axios.get('/api/logo');

    Promise.all([fetchMenuItems, fetchLogos])
      .then(([menuResponse, logoResponse]) => {
        // Process menu items
        const itemsWithIcons = menuResponse.data.menuListings.map(item => ({
          ...item,
          icon: item.icon || mapPageNameToIcon(item.pagename)
        }));
        setMenuItems(itemsWithIcons);

        // Process logos
        const primaryLogo = logoResponse.data.find(logo => logo.type === 'headerColor');
        const secondaryLogo = logoResponse.data.find(logo => logo.type === 'headerWhite');
        
        setLogos({
          primary: {
            photo: primaryLogo?.photo || '',
            alt: primaryLogo?.alt || 'Primary Logo'
          },
          secondary: {
            photo: secondaryLogo?.photo || '',
            alt: secondaryLogo?.alt || 'Secondary Logo'
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / window.innerHeight) * 100;
      setIsFixed(scrollPercent >= 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mapPageNameToIcon = (pagename) => {
    const lowercaseName = pagename.toLowerCase();
    if (lowercaseName.includes('home')) return 'home';
    if (lowercaseName.includes('contact')) return 'phone';
    if (lowercaseName.includes('product')) return 'shopping';
    if (lowercaseName.includes('about')) return 'info';
    if (lowercaseName.includes('team')) return 'users';
    return 'settings';
  };

  const isHome = location.pathname === '/' || location.pathname === '/home';

  const navClasses = `w-full transition-all duration-300 ${isFixed ? 'fixed top-0 shadow-lg bg-white' : isHome ? 'absolute bg-transparent' : 'absolute bg-white'} z-50`;

  const linkClasses = `transition-colors duration-300 font-medium ${isFixed || !isHome ? 'text-black hover:text-gray-600' : 'sm:text-white hover:text-gray-200'}`;

  const activeLinkClasses = 'text-blue-400';

  const buttonClasses = `transition-colors duration-300 px-6 py-2 rounded-md ${isFixed || !isHome ? 'bg-[#1290ca] text-white hover:bg-[#0b2b59]' : 'bg-white text-black hover:bg-gray-100'}`;

  // Get the appropriate logo based on current state
  const getCurrentLogo = () => {
    const logo = isHome && isFixed ? logos.primary : isHome ? logos.secondary : logos.primary;
    return {
      src: `/api/logo/download/${logo.photo}`,
      alt: logo.alt
    };
  };

  const closeMenu = () => setIsMenuOpen(false);

  const renderMenuItem = (item, isMobile = false) => {
    const isActive = location.pathname === `/${item.pagename.toLowerCase().replace(/\s+/g, '-')}`;
    const IconComponent = iconComponents[item.icon];
    
    return (
      <Link
        key={item._id}
        to={`/${item.pagename.toLowerCase().replace(/\s+/g, '-')}`}
        className={`${linkClasses} ${isActive ? activeLinkClasses : ''} ${isMobile ? '' : 'lg:text-[15px] md:text-[13px] xl:text-md'} flex items-center gap-2`}
        onClick={isMobile ? closeMenu : undefined}
      >
     
        {item.pagename}
      </Link>
    );
  };

  const currentLogo = getCurrentLogo();

  return (
    <>
      <div className="w-full bg-[#128fc9] text-white text-center py-3 text-md font-medium">
        🚧 This website is currently under construction. Some features may not be available. 🚧
      </div>
      <nav className={navClasses}>
        <div className="max-w-8xl md:ml-4 mx-auto md:p-1 px-2 py-1 sm:p-5">
          <div className="flex justify-between items-center lg:gap-28 xl:justify-between md:justify-center w-full py-1 ">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/home" className="flex items-center">
                <img 
                  src={currentLogo.src}
                  alt={currentLogo.alt}
                  className="h-12 sm:h-14  md:hidden object-contain block xl:block transition-all"
                  style={{ position: 'relative', zIndex: 10 }}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center mr-5 space-x-6">
              {menuItems.map(item => renderMenuItem(item))}
              <Link to="/contact-us" className={buttonClasses}>Inquiry</Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`focus:outline-none ${isFixed ? 'text-black' : 'text-black'}`}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className={`h-6 w-6 ${isFixed ? 'text-black' : isHome ? 'text-white' : 'text-black'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-white flex flex-col justify-center z-40">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 text-black focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="w-full h-full flex flex-col items-center mt-20 space-y-4">
                {menuItems.map(item => renderMenuItem(item, true))}
                <Link to="/contact-us" className={buttonClasses} onClick={closeMenu}>
                  <p className='font-medium'>Inquiry</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;