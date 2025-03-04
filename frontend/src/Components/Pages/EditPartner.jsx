import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditPartnerForm = () => {
    const [partnerName, setPartnerName] = useState("");
    const [photo, setPhoto] = useState([]);
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("active");
    const { id } = useParams();
    const [initialPhotos, setInitialPhotos] = useState([]);
    const [photoAlts, setPhotoAlts] = useState([]);
    const [initialPhotoAlts, setInitialPhotoAlts] = useState([]);
    const [initialImgtitle, setInitialImgtitle] = useState([]);
    const [imgtitle, setImgtitle] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        fetchPartner();
    }, []);

    const fetchPartner = async () => {
        try {
            const response = await axios.get(`/api/partner/singlePartner?id=${id}`, { withCredentials: true });
            const { partnerName, photo, url, alt, imgtitle, status } = response.data; // Ensure `imgtitle` is included here
            setPartnerName(partnerName);
            setInitialPhotos(photo);
            setUrl(url);
            setStatus(status);
            setInitialPhotoAlts(alt);
            setInitialImgtitle(imgtitle); // Correctly set the imgtitle field
        } catch (error) {
            console.error(error);
        }
    };


    const handleDeleteInitialPhoto = (e, photoFilename, index) => {
        e.preventDefault();
        axios
            .delete(`/api/partner/${id}/image/${photoFilename}/${index}`, { withCredentials: true })
            .then(() => {
                const updatedPhotos = initialPhotos.filter((_, i) => i !== index);
                setInitialPhotos(updatedPhotos);

                const updatedPhotoAlts = [...initialPhotoAlts];
                updatedPhotoAlts.splice(index, 1);
                setInitialPhotoAlts(updatedPhotoAlts);

                const updatedPhotoTitles = [...initialImgtitle];
                updatedPhotoTitles.splice(index, 1);
                setInitialImgtitle(updatedPhotoTitles);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleFileChange = (e) => {
        const newPhotos = Array.from(e.target.files);
        setPhoto([...photo, ...newPhotos]);
    };

    const handleInitialAltTextChange = (e, index) => {
        const newPhotoAlts = [...initialPhotoAlts];
        newPhotoAlts[index] = e.target.value;
        setInitialPhotoAlts(newPhotoAlts);
    };

    const handleNewImgtitleChange = (e, index) => {
        const newImgtitles = [...imgtitle];
        newImgtitles[index] = e.target.value;

        setImgtitle(newImgtitles);
    };

    const handleNewAltTextChange = (e, index) => {
        const newPhotoAlts = [...photoAlts];
        newPhotoAlts[index] = e.target.value;
        setPhotoAlts(newPhotoAlts);
    };

    const handleInitialImgtitleChange = (e, index) => {
        const newImgtitles = [...initialImgtitle];
        newImgtitles[index] = e.target.value;

        setInitialImgtitle(newImgtitles);
    };

    const handleDeleteNewPhoto = (e, index) => {
        e.preventDefault();
        const updatedPhotos = [...photo];
        updatedPhotos.splice(index, 1);
        setPhoto(updatedPhotos);

        const updatedPhotoAlts = [...photoAlts];
        updatedPhotoAlts.splice(index, 1);
        setPhotoAlts(updatedPhotoAlts);

        const updatedPhotoTitles = [...photoTitles];
        updatedPhotoTitles.splice(index, 1);
        setPhotoTitles(updatedPhotoTitles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("partnerName", partnerName);
    
            const combinedAlts = [...initialPhotoAlts, ...photoAlts];
            const combinedImgtitle = [...initialImgtitle, ...imgtitle]; // Combine initial and new titles
    
            photo.forEach((p) => formData.append("photo", p));
            combinedAlts.forEach((a) => formData.append("alt", a));
            combinedImgtitle.forEach((t) => formData.append("imgtitle", t)); // Append imgtitle
    
            formData.append("url", url);
            formData.append("status", status);
    
            await axios.put(`/api/partner/updatePartner?id=${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
    
            navigate("/clients");
        } catch (error) {
            console.error(error);
        } 
    };
     

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Client</h1>
            <div className="mb-4">
                <label htmlFor="partnerName" className="block font-semibold mb-2">
                    Client Name
                </label>
                <input
                    type="text"
                    id="partnerName"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block font-semibold mb-2">Current Photos</label>
                <div className="flex flex-wrap gap-4">
                    {initialPhotos.map((photo, index) => (
                        <div key={index} className="relative w-56">
                            <img
                                src={`/api/image/download/${photo}`}
                                alt={initialPhotoAlts[index] || `Photo ${index + 1}`}
                                className="w-56 h-32 object-cover"
                            />
                            <label htmlFor={`alt-${index}`} className="block mt-2">
                                Alternative Text:
                                <input
                                    type="text"
                                    id={`alt-${index}`}
                                    value={initialPhotoAlts[index] || ""}
                                    onChange={(e) => handleInitialAltTextChange(e, index)}
                                    className="w-56 p-2 border rounded focus:outline-none"
                                />
                            </label>
                            <label htmlFor={`imgtitle-${index}`} className="block mt-2">
                                Title Text:
                                <input
                                    type="text"
                                    id={`imgtitle-${index}`}
                                    value={initialImgtitle[index] || ""}
                                    onChange={(e) => handleInitialImgtitleChange(e, index)}
                                    className="w-56 p-2 border rounded focus:outline-none"
                                />
                            </label>
                            <button
                                onClick={(e) => handleDeleteInitialPhoto(e, photo, index)}
                                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
                            >
                                <span className="text-xs">X</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-2">Add New Photos</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="p-2 border rounded"
                />
                <div className="flex flex-wrap gap-4 mt-4">
                    {photo.map((file, index) => (
                        <div key={index} className="relative w-56">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`New Photo ${index + 1}`}
                                className="w-56 h-32 object-cover"
                            />

                            <label htmlFor={`alt-new-${index}`} className="block mt-2">
                                Alternative Text:
                                <input
                                    type="text"
                                    id={`alt-new-${index}`}
                                    value={photoAlts[index] || ""}
                                    onChange={(e) => handleNewAltTextChange(e, index)}
                                    className="w-full p-2 border rounded focus:outline-none"
                                />
                            </label>
                            <label htmlFor={`imgtitle-new-${index}`} className="block mt-2">
                                Title Text:
                                <input
                                    type="text"
                                    id={`imgtitle-new-${index}`}
                                    value={imgtitle[index] || ""}
                                    onChange={(e) => handleNewImgtitleChange(e, index)}
                                    className="w-full p-2 border rounded focus:outline-none"
                                />
                            </label>
                            <button
                                onClick={(e) => handleDeleteNewPhoto(e, index)}
                                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex
                justify-center items-center"
                            >
                                <span className="text-xs">X</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="url" className="block font-semibold mb-2">
                    URL
                </label>
                <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"

                />
            </div>
            <div className="mb-4">
                <label htmlFor="status" className="block font-semibold mb-2">
                    Status
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Update Partner
            </button>
        </form>
    );
};

export default EditPartnerForm;
