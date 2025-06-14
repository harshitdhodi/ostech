import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube, Mail, Clock, Phone, MapPin } from 'lucide-react';
import logo2 from "../../../assets/halfLogo.png";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const footerResponse = await axios.get('/api/footer/getAllFooter');
        setFooterData(footerResponse.data);

        const categoryResponse = await axios.get('/api/product/getAll');
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchFooterData();
  }, []);

  // Utility to detect if the device is mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Click handlers
  const handleEmailClick = (emailAddress) => {
    if (emailAddress) {
      window.location.href = `mailto:${emailAddress}`;
    }
  };

  const handlePhoneClick = (phoneNumber) => {
    if (!phoneNumber) return;

    if (isMobileDevice()) {
      // On mobile, trigger the phone dialer
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // On desktop, show an alert or do nothing
      alert('Phone calls are not supported on this device. Please use a mobile device to call.');
    }
  };

  const handleAddressClick = (address) => {
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps?q=${encodedAddress}`, '_blank');
    }
  };

  if (!footerData) {
    return <div>Loading...</div>;
  }

  const {
    newsletter,
    instagramLink,
    facebookLink,
    googleLink,
    location,
    phoneNo,
    phoneNo_2,
    email,
    email_2,
    address,
    officeTime,
  } = footerData;

  return (
    <footer className="w-full bg-[#052852] text-white py-12 relative">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info Section */}
        <div className="space-y-6">
          <div>
            <Link to="/">
              <img src={logo2} onClick={scrollToTop}
                alt="Logo" className='h-[10vh] mb-5' />
            </Link>
            <p className="text-gray-300 text-justify">{newsletter}</p>
          </div>
          <button
            className="border border-white mt-6 px-6 py-2 rounded hover:bg-white hover:text-slate-900 transition-colors"
            onClick={() => {
              if (window.location.pathname === '/contact-us') {
                scrollToTop();
              } else {
                navigate('/contact-us');
                setTimeout(() => scrollToTop(), 100);
              }
            }}
          >
            Inquiry
          </button>
        </div>

        {/* Products Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-blue-400 pb-2 mb-4">Our Products</h3>
          <ul className="space-y-3">
            {categories.map((category) => (
              <li
                key={category._id}
                className="hover:text-blue-400 cursor-pointer transition-colors"
                onClick={() => navigate(`/products`)}
              >
                {category.category}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-blue-400 pb-2 mb-4">Contact</h3>
          <div className="space-y-4">
            <div
              className="flex items-start space-x-2 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleAddressClick(address)}
            >
              <MapPin className="w-12 h-9 mt-1 text-blue-400" />
              <p className="text-gray-300 text-justify">{address}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <p className="text-gray-300">{officeTime}</p>
            </div>
            <div
              className="flex items-center space-x-2 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handlePhoneClick(phoneNo)}
            >
              <Phone className="w-5 h-5 text-blue-400" />
              <p className="text-gray-300">{phoneNo}</p>
            </div>
            {phoneNo_2 && (
              <div
                className="flex items-center space-x-2 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => handlePhoneClick(phoneNo_2)}
              >
                <Phone className="w-5 h-5 text-blue-400" />
                <p className="text-gray-300">{phoneNo_2}</p>
              </div>
            )}
            <div
              className="flex items-center space-x-2 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleEmailClick(email)}
            >
              <Mail className="w-5 h-5 text-blue-400" />
              <p className="text-gray-300">{email}</p>
            </div>
            {email_2 && (
              <div
                className="flex items-center space-x-2 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => handleEmailClick(email_2)}
              >
                <Mail className="w-5 h-5 text-blue-400" />
                <p className="text-gray-300">{email_2}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            Designed by <a href='https://www.rndtechnosoft.com/' target='_blank' className='text-yellow-400'>RnD Technosoft</a> {new Date().getFullYear()} © Ostech Machines Pvt Ltd. All rights reserved.
          </p>

          <div className="flex space-x-4">
            <Link to="/privacy-policy">
              <p className='text-gray-400 text-sm'>Privacy Policy</p>
            </Link>
            <Link to="/terms-and-conditions">
              <p className='text-gray-400 text-sm'>Terms and Conditions</p>
            </Link>
            <a href={googleLink} target="_blank" rel="noopener noreferrer">
              <FaYoutube className="w-5 h-5 text-red-800 cursor-pointer" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;