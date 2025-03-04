import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewPartnerForm = () => {
  const [partnerName, setPartnerName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgTitles, setImgTitles] = useState([]); // New state for image titles
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("active");
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      toast.error("You can only upload up to 5 photos");
      return;
    }
    setPhotos([...photos, ...files]);

    const newPhotoAlts = Array.from({ length: files.length }, () => "");
    setPhotoAlts([...photoAlts, ...newPhotoAlts]);

    const newImgTitles = Array.from({ length: files.length }, () => ""); // Initialize titles
    setImgTitles([...imgTitles, ...newImgTitles]);
  };

  const handleDeleteImage = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoAlts((prevPhotoAlts) => prevPhotoAlts.filter((_, i) => i !== index));
    setImgTitles((prevImgTitles) => prevImgTitles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("partnerName", partnerName);
      photos.forEach((photo, index) => {
        formData.append(`photo`, photo);
        formData.append(`alt`, photoAlts[index]);
        formData.append(`imgTitle`, imgTitles[index]); // Add imgTitle to submission
      });
      formData.append("url", url);
      formData.append("status", status);

      const response = await axios.post(
        "/api/partner/insertPartners",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setPartnerName("");
      setPhotos([]);
      setUrl("");
      setStatus("active");
      setPhotoAlts([]);
      setImgTitles([]); // Reset image titles
      navigate("/clients");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">
        Add Client
      </h1>
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
      <div className="mt-12">
        <label htmlFor="photo" className="block font-semibold mb-2">
          Photos
        </label>
        <input
          type="file"
          name="photo"
          id="photo"
          multiple
          onChange={handlePhotoChange}
          className="border rounded focus:outline-none"
          accept="image/*"
        />
        {photos.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative w-56 group flex flex-col items-center">
                <div className="relative w-56">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Service ${index + 1}`}
                    className="h-32 w-56 object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 hover:bg-red-600 focus:outline-none"
                  >
                    X
                  </button>
                </div>
                <label className="block mt-2">
                  Alt Text:
                  <input
                    type="text"
                    value={photoAlts[index]}
                    onChange={(e) => {
                      const newPhotoAlts = [...photoAlts];
                      newPhotoAlts[index] = e.target.value;
                      setPhotoAlts(newPhotoAlts);
                    }}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <label className="block mt-2">
                  Image Title:
                  <input
                    type="text"
                    value={imgTitles[index]}
                    onChange={(e) => {
                      const newImgTitles = [...imgTitles];
                      newImgTitles[index] = e.target.value;
                      setImgTitles(newImgTitles);
                    }}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="block font-semibold mb-2">
          Status
        </label>
        <div className="flex items-center">
          <label className="mr-4 text-green-500">
            <input
              type="radio"
              value="active"
              checked={status === "active"}
              onChange={() => setStatus("active")}
              className="mr-2"
            />
            Active
          </label>
          <label className="text-red-500">
            <input
              type="radio"
              value="inactive"
              checked={status === "inactive"}
              onChange={() => setStatus("inactive")}
              className="mr-2"
            />
            Inactive
          </label>
        </div>
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Add Client
      </button>
    </form>
  );
};

export default NewPartnerForm;
