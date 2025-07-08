import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from './Input';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from "./Button";
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';
import { IoIosContact } from "react-icons/io";
import axios from 'axios';

const Skeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-full w-full bg-gray-200 rounded"></div>
    </div>
  );
};

export default function ProductGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 6;

  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/product/getAllProducts');
      const products = response.data.data;

      const groupedCategories = products.reduce((acc, product) => {
        const category = product.categoryName || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = {
            id: product.categories[0],
            products: []
          };
        }
        acc[category].products.push(product);
        return acc;
      }, {});

      const categoryArray = Object.entries(groupedCategories).map(([name, data]) => ({
        name,
        id: data.id,
        products: data.products
      }));

      // Sort categories to put "Case packer" first
      const sortedCategories = categoryArray.sort((a, b) => {
        if (a.name.toLowerCase() === 'case packer') return -1;
        if (b.name.toLowerCase() === 'case packer') return 1;
        return a.name.localeCompare(b.name);
      });

      setCategories(sortedCategories);
    } catch (error) {
      console.error('Error fetching product categories:', error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedCategory === 'All'
        ? '/api/product/getAllProductsByPriority'
        : `/api/product/getProductsByCategories?categoryIds=${selectedCategory}`;

      const response = await fetch(url);
      const responseData = await response.json();
      const flattenedProducts = Array.isArray(responseData)
        ? responseData
        : responseData.data
          ? responseData.data
          : [];

      setProducts(flattenedProducts);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch =
        selectedCategory === 'All' ||
        product.categoryId === selectedCategory ||
        (Array.isArray(product.categories));

      const searchMatch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase());

      const visibilityMatch = product.isVisible !== false;

      return categoryMatch && searchMatch && visibilityMatch;
    });
  }, [products, selectedCategory, searchTerm]);

  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleReadMore = useCallback((categoryName, productName) => {
    navigate(`/${productName}`);
  }, [navigate]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategorySelect = useCallback((id) => {
    setSelectedCategory(id);
  }, []);

  const handleProductSelect = useCallback((id) => {
    setSelectedProduct(id);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Categories */}
      <div className="flex flex-col gap-2 overflow-x-auto md:hidden bg-[#1290ca]/20 p-4 rounded-lg">
        <Button
          onClick={() => handleCategorySelect('All')}
          variant={selectedCategory === 'All' ? 'default' : 'outline'}
          className="flex-shrink-0 bg-white"
        >
          All
        </Button>
        {categories.map(category => (
          <Button
            key={category._id || category.name}
            onClick={() => handleCategorySelect(category._id)}
            variant={selectedCategory === category._id ? 'default' : 'outline'}
            className="flex-shrink-0 bg-white text-black"
          >
            {category.category || category.name}
          </Button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="hidden scrollbar-hide overflow-auto md:block xl:w-[20%] w-full md:w-1/4 bg-[#0d233f] p-5 rounded-none sticky top-[10%] h-screen">
          <h2 className="text-2xl font-bold text-[#ffffff] text-center mb-4">Product Categories</h2>
          <div className="space-y-3 mt-10">
            <div className="flex flex-col justify-center">
              {/* Add All button here */}
              <Button
                onClick={() => handleCategorySelect('All')}
                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                className="flex-shrink-0 bg-white mb-2 text-left"
              >
                All Categories
              </Button>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="my-3">
                    <Skeleton className="h-12 w-full bg-gray-200" />
                  </div>
                ))
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <Collapsible key={category._id || category.name}>
                    <CollapsibleTrigger className="flex my-3 items-center justify-between w-full font-medium text-left text-gray-700 bg-white text-[16px] hover:bg-gray-100 rounded-md cursor-pointer shadow hover:shadow-lg hover:translate-y-[-3px] transform transition-all duration-300 shadow-[#0b0f14] hover:shadow-[#3a4b5f]">
                      <div
                        className="flex-grow cursor-pointer"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        {category.category || category.name}
                      </div>
                      <div className="">
                        <ChevronDown className="h-6 w-4 mr-2" />
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-2 space-y-2">
                      {(category.products || []).map((product) => (
                        <Link
                          key={product._id}
                          to={`/${product.slug}`}
                          onClick={() => handleProductSelect(product._id)}
                        >
                          <Button
                            variant="ghost"
                            className={`w-full shadow hover:shadow-lg hover:translate-y-[-3px] transform transition-all duration-300 
                  shadow-[#0b0f14] hover:shadow-[#3a4b5f] justify-start text-[13px] hover:bg-white bg-gray-200 m-1 pl-4 
                  ${selectedProduct === product._id ? 'bg-white' : ''}`}
                          >
                            {product.title}
                          </Button>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))
              ) : (
                <p className="text-white text-center">No categories available</p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 xl:m-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="mx-4">
                  <CardHeader className="p-0">
                    <Skeleton className="aspect-[4/3] w-full" />
                  </CardHeader>
                  <CardContent className="px-4 py-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              currentProducts.map(product => (
                <Card key={product._id} className="mx-4 flex flex-col transition-shadow duration-300 hover:shadow-lg hover:shadow-[#1290ca] shadow-[#1290ca]/20">
                  <CardHeader className="p-0">
                    <div
                      onClick={() => handleReadMore(categories.find(cat => cat._id === product.categories[0])?.category, product.slug)}
                      className="cursor-pointer aspect-[4/3] relative overflow-hidden"
                    >
                      <img
                        src={`/api/image/download/${product.photo[0] || 'default-image.jpg'}`}
                        alt={product.title}
                        className="w-full h-full object-fill hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent
                    onClick={() => handleReadMore(categories.find(cat => cat._id === product.categories[0])?.category, product.slug)}
                    className="flex-1 p-4 py-6 cursor-pointer"
                  >
                    <CardTitle className="text-lg sm:text-xl mb-2 line-clamp-2 hover:text-[#1290ca]">
                      {product.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mb-3">
                      {categories.find(cat => cat._id === product.categories[0])?.category}
                    </p>
                    <div className="text-gray-600 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: product.homeDetail }} />
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {!loading && filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 mt-8" role="alert">
              No products found. Try a different search term or category.
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 my-3 py-2 rounded-md text-sm transition-colors duration-300 ${currentPage === index + 1
                      ? 'bg-[#1d84b4] text-black border border-[#0f3242]'
                      : 'bg-black text-[#0f3242] hover:bg-[#f0f4f8] hover:text-[#1290ca] border border-[#d1d5db]'
                    }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}