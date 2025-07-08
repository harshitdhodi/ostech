import React, { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

// Set the app element for the modal
Modal.setAppElement('#root');

function InquiryForm({ productName, onClose }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [clientIp, setClientIp] = useState('');
    const [utmParams, setUtmParams] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalType, setModalType] = useState('');

    useEffect(() => {
        const fetchClientIp = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setClientIp(response.data.ip);
            } catch (error) {
                console.error('Error fetching IP address', error);
            }
        };

        fetchClientIp();

        const params = new URLSearchParams(window.location.search);
        setUtmParams({
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            utm_id: params.get('utm_id') || '',
            gclid: params.get('gclid') || '',
            gcid_source: params.get('gcid_source') || '',
            utm_content: params.get('utm_content') || '',
            utm_term: params.get('utm_term') || '',
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaValue) {
            setErrorMessage('Please complete the reCAPTCHA.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            await axios.post('/api/productinquiry/createproductinquiries', {
                name,
                email,
                phone,
                subject,
                message,
                productName,
                ipaddress: clientIp,
                ...utmParams,
            });

            console.log('Submission successful, opening success modal');
            setName('');
            setEmail('');
            setPhone('');
            setSubject('');
            setMessage('');
            setCaptchaValue(null);

            setModalType('success');
            setModalIsOpen(true);
        } catch (error) {
            let errorMsg = 'An unexpected error occurred. Please try again.';
            if (error.response) {
                if (error.response.status === 400) {
                    errorMsg = error.response.data.error || 'Invalid input. Please check your form data.';
                } else if (error.response.status === 500) {
                    errorMsg = 'Server error. Please try again later.';
                }
            } else if (error.request) {
                errorMsg = 'Network error. Please check your internet connection.';
            }

            if (error.response?.status >= 500) {
                setModalType('error');
                setModalIsOpen(true);
                setErrorMessage(errorMsg);
            } else {
                setErrorMessage(errorMsg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalType('');
        if (modalType === 'success') {
            onClose();
        }
    };

    console.log('Modal State:', { modalIsOpen, modalType });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Inquiry for {productName}</h2>
                {errorMessage && !modalIsOpen && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg" role="alert">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            required="true"
                            aria-required="true"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            required="true"
                            aria-required="true"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Phone No</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            required="true"
                            maxLength="10"
                            aria-required="true"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            required="true"
                            aria-required="true"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            required="true"
                            aria-required="true"
                        />
                    </div>
                    <div className="mb-4">
                        <ReCAPTCHA
                            sitekey={import.meta.env.VITE_SITE_KEY}
                            onChange={(value) => setCaptchaValue(value)}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2"
                            onClick={onClose}
                            disabled={isSubmitting}
                            aria-label="Cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                            disabled={!captchaValue || isSubmitting}
                            aria-label={isSubmitting ? 'Submitting' : 'Submit'}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={modalType === 'success' ? 'Submission Successful' : 'Submission Error'}
                className="fixed inset-0 flex items-center justify-center z-[60] p-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[55]"
            >
                <div className={`p-6 rounded-lg shadow-lg w-full max-w-md relative ${modalType === 'success' ? 'bg-[#f5faf7]' : 'bg-[#fff3f3]'}`}>
                    {modalType === 'success' ? (
                        <>
                            <h2 className="text-2xl font-bold mb-4 text-green-700">Thank You!</h2>
                            <p className="mb-4">Your message has been successfully sent.</p>
                            <p className="mb-4">We will get back to you soon.</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-4 text-red-700">Error</h2>
                            <p className="mb-4">{errorMessage}</p>
                        </>
                    )}
                    <button
                        onClick={closeModal}
                        className="text-black px-4 py-2 absolute top-2 right-2"
                        aria-label="Close modal"
                    >
                        <FaTimes size={25} />
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default InquiryForm;