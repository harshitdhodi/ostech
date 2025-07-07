import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from './Card';
import InquiryForm from './InquiryForm';
import WhyChooseUs from './WhyChooseUs';
import { productCategories } from './ProductList';
import { IoIosContact } from "react-icons/io";
import axios from 'axios';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';
import { Button } from './Button';

const ProductDetail = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    axios.get('/api/footer/getAllFooter')
      .then((response) => {
        setFooterData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching footer data:', error);
      });
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/getSingleProduct?slugs=${slug}`);
        const data = await response.json();
        setCurrentProduct(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    axios.get('/api/product/getAllProducts')
      .then(response => {
        const products = response.data.data;

        const groupedCategories = products.reduce((acc, product) => {
          const category = product.categoryName || 'Uncategorized';
          if (!acc[category]) acc[category] = [];
          acc[category].push(product);
          return acc;
        }, {});

        setCategories(Object.entries(groupedCategories).map(([name, products]) => ({
          name,
          products,
        })));
      })
      .catch(error => {
        console.error('Error fetching product categories:', error);
      });
  }, []);

  const nextImage = () => {
    if (!currentProduct?.photo) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === currentProduct.photo.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!currentProduct?.photo) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? currentProduct.photo.length - 1 : prevIndex - 1
    );
  };

  const handleCatalogueClick = () => {
    if (currentProduct?.catalogue) {
      window.open(`/api/image/catalogue/view/${currentProduct.catalogue}`, '_blank');
    } else {
      alert('No Available');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!currentProduct) {
    return <div className="flex justify-center items-center min-h-screen">Product not found</div>;
  }

  const toggleCategory = (categoryId) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <div className="px-4 py-5 md:flex ">
      {showInquiryForm && (
        <InquiryForm
          productName={currentProduct.title}
          onClose={() => setShowInquiryForm(false)}
        />
      )}
      <aside className="w-full md:w-[30%] lg:w-[25%] rounded-lg xl:w-[20%] hidden bg-[#0d233f] md:pr-8 lg:px-7 mb-8 md:block">
        <div className="md:sticky min-h-screen md:top-24 overflow-auto">
          <h2 className="text-2xl text-[#ffffff] font-bold text-center md:text-2xl md:ml-2 py-7">
            Product Categories
          </h2>

          <div className="flex flex-col justify-center ml-6 lg:ml-0">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Collapsible key={category.name}>
                  <CollapsibleTrigger className="flex my-3 items-center justify-between w-full font-medium text-left text-gray-700 bg-white text-[16px] hover:bg-gray-100 rounded-md cursor-pointer shadow hover:shadow-lg hover:translate-y-[-3px] transform transition-all duration-300 
             shadow-[#0b0f14] hover:shadow-[#3a4b5f]">
                    {category.name}
                    <div>
                      <ChevronDown className="h-6 w-4" />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-2 space-y-2">
                    {category.products?.map((product) => (
                      <Link key={product._id} to={`/${product.slug}`} onClick={() => setSelectedProduct(product._id)}>
                        <Button
                          variant="ghost"
                          className={`w-full shadow hover:shadow-lg hover:translate-y-[-3px] transform transition-all duration-300 
             shadow-[#0b0f14] hover:shadow-[#3a4b5f] justify-start text-[13px] hover:bg-white bg-gray-200 m-1 pl-4 ${selectedProduct === product._id ? 'bg-white' : ''}`}
                          asChild
                        >
                          {product.title}
                        </Button>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>

          <div className="w-full md:w-full lg:w-full ml-5 mb-7 lg:ml-0 rounded mt-4 h-auto md:h-[25vh] border shadow hover:shadow-lg hover:translate-y-[-3px] transform transition-all duration-300 hover:shadow-[#3a4b5f] bg-[#ffffff]">
            <div className="flex justify-center items-center sm:mt-2">
              <IoIosContact className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] text-[#0d233f]" />
            </div>
            <div className="flex flex-col mt-1 justify-center items-center">
              {footerData ? (
                <>
                  <p className="text-sm sm:text-base md:text-lg lg:text-lg font-bold text-[#051852]">
                    {footerData.phone || '+91 99783 88388'}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg lg:text-lg font-bold text-[#051852]">
                    {footerData.email || 'rajneesh@ostech.in'}
                  </p>
                </>
              ) : (
                <p>Loading contact details...</p>
              )}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <Card className="border-none shadow-none rounded-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-4">
                <div className="relative md:h-[25rem] h-[20rem] w-full rounded-xlSkeletonLoader overflow-hidden bg-gray-100">
                  <img
                    src={`/api/image/download/${currentProduct.photo[currentImageIndex] || 'default-image.jpg'}`}
                    alt={currentProduct.title}
                    className="w-full h-full lg:object-cover object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-none w-8"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5 relative right-2" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-none w-8"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5 relative right-2" />
                  </Button>
                </div>

                <div className="flex space-x-4 overflow-x-auto">
                  {currentProduct.photo.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative sm:w-24 w-20 h-16 m-2 rounded-lg overflow-hidden ${index === currentImageIndex
                        ? 'ring-2 ring-blue-500 ring-offset-2'
                        : 'hover:opacity-75'
                        }`}
                    >
                      <img
                        src={`/api/image/download/${image}`}
                        alt={`${currentProduct.title} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-6">
                <div>
                  <h1 className="text-3xl text-[#052852] font-bold tracking-tight">
                    {currentProduct.title}
                  </h1>
                  <div
                    className="text-gray-600 text-justify"
                    dangerouslySetInnerHTML={{ __html: currentProduct.homeDetail }}
                  />
                  <h2 className="text-xl font-semibold mt-4 text-[#052852]">Description</h2>
                  <div
                    className="text-gray-600 mt-2 text-justify leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentProduct.details }}
                  />
                  <button
                    onClick={() => setShowInquiryForm(true)}
                    className="border bg-[#1290ca] p-2 px-7 rounded mt-5 text-white text-lg"
                  >
                    Inquiry Now
                  </button>
                  <button
                    onClick={handleCatalogueClick}
                    className="border bg-[#1290ca] p-2 px-7 rounded mt-5 text-white text-lg ml-2"
                  >
                    Catalogue
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
          <div className='mx-10 lg:mt-5'>
            <h2 className="text-xl text-[#052852] font-semibold">Key Features</h2>
            <ul className="w-full mt-3 lg:grid grid-cols-2 gap-y-4 gap-x-6">
              {currentProduct.keyFeature?.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-blue-500" />
                  <span className="ml-4 text-gray-600 text-justify">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='mt-5'>
            <WhyChooseUs />
          </div>
        </Card>
      </main>

      <aside className="w-full md:w-[20%] block md:hidden bg-[#1290ca]/20 md:pr-8 lg:px-7 mb-8 p-5">
        <div className="md:sticky md:top-24">
          <h2 className="text-2xl text-[#052852] font-bold mb-4 p-4">Product Categories</h2>

          {categories.length > 0 ? (
            categories.map((category) => (
              <Collapsible key={category.name}>
                <CollapsibleTrigger className="flex my-3 items-center justify-between w-full font-medium text-left text-gray-700 bg-white text-[16px] hover:bg-gray-100 rounded-md cursor-pointer">
                  {category.name}
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-2 space-y-2">
                  {category.products?.map((product) => (
                    <Link
                      key={product._id}
                      to={`/${product.slug}`}
                      onClick={() => {
                        setSelectedProduct(product._id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-[13px] hover:bg-white m-1 pl-4 ${selectedProduct === product._id ? 'bg-gray-100' : ''}`}
                        asChild
                      >
                        {product.title}
                      </Button>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))
          ) : (
            <p>No categories available</p>
          )}

          <div className="w-full md:w-[28vh] rounded mt-10 h-auto md:h-[30vh] border bg-[#052852]">
            <div className="flex justify-center items-center sm:mt-7 my-2">
              <IoIosContact className="text-[4rem] sm:text-[6rem] text-white" />
            </div>
            <div className="flex flex-col my-3 justify-center items-center">
              {footerData ? (
                <>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">
                    {footerData.phone || '+91 99783 88388'}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">
                    {footerData.email || 'rajneesh@ostech.in'}
                  </p>
                </>
              ) : (
                <p>Loading contact details...</p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ProductDetail;