const Product = require("../model/product")
const productCategory = require("../model/productCategory")
const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path')
const ImportedFile = require("../model/importedFiles")
const mongoose = require('mongoose');

const insertProduct = async (req, res) => {
  try {
    const { title, details, alt,keyFeature,imgtitle, slug,homeDetail, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta, benefits, categories, subcategories, subSubcategories, url, priority, changeFreq, status } = req.body;
    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const catalogue = req.files['catalogue'] ? req.files['catalogue'][0].filename : '';

    const product = new Product({
      title,
      details,
      homeDetail,
      alt,
      imgtitle,
      slug,
      keyFeature, 
      benefits,
      catalogue,
      metatitle,
      metadescription,
      metakeywords,
      metacanonical,
      metalanguage,
      metaschema,
      otherMeta,
      photo,
      url,
      changeFreq,
      priority,
      status,
      categories,
      subcategories,
      subSubcategories
    });
    await product.save();
    res.status(201).json({ message: 'Product inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inserting product' });
  }
}


const updateProduct = async (req, res) => {
    try {
        const { slugs } = req.query;
        const files = req.files;

        console.log('Incoming update data:', {
            body: req.body,
            files: files
        });

        // Fetch existing product
        const existingProduct = await Product.findOne({ slug: slugs });
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Prepare update payload
        const updateData = {
            ...req.body,
            alt: req.body.alt || [],
            imgtitle: req.body.imgtitle || [],
        };

        // Handle uploaded catalogue file
        if (files && files.catalogue && files.catalogue.length > 0) {
            updateData.catalogue = files.catalogue[0].filename; // Save filename only
        }

        // Handle uploaded photo(s) by appending to existing photos
        if (files && files.photo) {
            // Get existing photos or initialize as empty array
            const existingPhotos = existingProduct.photo || [];
            // Get new photo filenames
            const newPhotos = Array.isArray(files.photo)
                ? files.photo.map(file => file.filename)
                : [files.photo.filename];
            // Append new photos to existing photos
            updateData.photo = [...existingPhotos, ...newPhotos];
        }

        console.log('Final update data:', updateData);

        const updatedProduct = await Product.findOneAndUpdate(
            { slug: slugs },
            updateData,
            { new: true }
        );

        console.log('Updated product:', {
            photo: updatedProduct.photo,
            alt: updatedProduct.alt,
            imgtitle: updatedProduct.imgtitle,
            catalogue: updatedProduct.catalogue
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
  const { slugs } = req.query;

  try {
    const product = await Product.findOne({slug:slugs});

    product.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });

    const deletedProduct = await Product.findOneAndDelete({slug:slugs});
  

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
};

const deletePhotoAndAltText = async (req, res) => {
    const { slugs, imageFilename, index } = req.params;
    try {
        // Find the product by slug
        const product = await Product.findOne({ slug: slugs });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove the photo from the array
        const photoIndex = product.photo.indexOf(imageFilename);
        if (photoIndex > -1) {
            // Remove the photo and corresponding metadata
            product.photo.splice(photoIndex, 1);
            
            // Remove corresponding alt text and image title if they exist
            if (product.alt && product.alt.length > photoIndex) {
                product.alt.splice(photoIndex, 1);
            }
            if (product.imgtitle && product.imgtitle.length > photoIndex) {
                product.imgtitle.splice(photoIndex, 1);
            }

            // Delete the actual file from the server
            const filePath = path.join(__dirname, '..', 'images', imageFilename);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    console.error('Error deleting file:', err);
                    // Continue with the database update even if file deletion fails
                }
            }

            // Save the updated product
            await product.save();

            // Fetch the latest product data after saving
            const updatedProduct = await Product.findOne({ slug: slugs });

            return res.status(200).json({ 
                message: 'Photo and associated metadata deleted successfully',
                remainingPhotos: updatedProduct.photo,
                remainingAlts: updatedProduct.alt,
                remainingTitles: updatedProduct.imgtitle
            });
        } else {
            return res.status(404).json({ message: 'Photo not found in product' });
        }

    } catch (error) {
        console.error('Error deleting photo and metadata:', error);
        res.status(500).json({ 
            message: 'Server error while deleting photo', 
            error: error.message 
        });
    }
};

const getAllProducts = async (req, res) => {
  try {
    // const { page = 1 } = req.query;
    // const limit = 6;
    // const count = await Product.countDocuments();
    const products = await Product.find()
      // .skip((page - 1) * limit)
      // .limit(limit);


    const productsWithCategoryName = await Promise.all(products.map(async (product) => {
      const category = await productCategory.findOne({ '_id': product.categories });
      const categoryName = category ? category.category : 'Uncategorized';
      return {
        ...product.toJSON(),
        categoryName
      };
    }));
    res.status(200).json({
      data: productsWithCategoryName,
      // total: count,
      // currentPage: page,
      // hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage, error });
  }
};


const getSingleProduct = async (req, res) => {
  const { slugs } = req.query;

  try {
    const product = await Product.findOne({ slug: slugs })
      .populate('categories', 'category')
      .select('+imgtitle +alt')
      .lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add a categoryName field and ensure imgtitle and alt are properly included
    const productWithCategory = {
      ...product,
      categoryName: product.categories?.category || 'Uncategorized',
      imgtitle: Array.isArray(product.imgtitle) ? product.imgtitle : [],
      alt: Array.isArray(product.alt) ? product.alt : []
    };

    // Log both imgtitle and alt for debugging
    console.log('Product imgtitle:', productWithCategory.imgtitle);
    console.log('Product alt:', productWithCategory.alt);

    res.status(200).json(productWithCategory);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPopularProducts = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 8;
    const count = await Product.countDocuments({ status: 'popular' }); // Count only products with status 'popular'
    
    // Find products with status 'popular'
    const products = await Product.find({ status: 'popular' })
      .skip((page - 1) * limit)
      .limit(limit);

    // Fetch category names for products
    const productsWithCategoryName = await Promise.all(products.map(async (product) => {
      const category = await productCategory.findOne({ '_id': product.categories });
      const categoryName = category ? category.category : 'Uncategorized';
      return {
        ...product.toJSON(),
        categoryName
      };
    }));

    // Send the response with filtered data
    res.status(200).json({
      data: productsWithCategoryName,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving popular products:", error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage, error });
  }
};


const getCategoryProducts = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const products = await Product.find({ categories: categoryId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubcategoryProducts = async (req, res) => {
  const { subcategoryId } = req.query;

  try {
    const products = await Product.find({ subcategories: subcategoryId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this subcategory' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubSubcategoryProducts = async (req, res) => {
  const { subSubcategoryId } = req.query;

  try {
    const products = await Product.find({ subSubcategories: subSubcategoryId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this sub-subcategory' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const countProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting services' });
  }
};

const exportProductsToExcel = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Add headers
    worksheet.addRow(['ID', 'Title', 'Details', 'Photo', 'Alt', 'Status', 'Categories', 'Subcategories', 'Subsubcategories']);

    // Add data rows
    products.forEach(product => {
      worksheet.addRow([
        product._id.toString(),
        product.title,
        product.details,
        product.photo.join(', '),
        product.alt.join(', '),
        product.status,
        product.categories.join(', '), // Convert array to comma-separated string
        product.subcategories.join(', '), // Convert array to comma-separated string
        product.subSubcategories.join(', ') // Convert array to comma-separated string
      ]);
    });

    // Generate a unique filename
    const filename = `products_${Date.now()}.xlsx`;

    // Set headers to trigger file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Write the Excel file to the response stream
    await workbook.xlsx.write(res);

    res.status(200).end();
  } catch (error) {
    console.error('Error exporting products:', error);
    res.status(500).json({ message: 'Failed to export products' });
  }
};

const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File not provided' });
    }

    const fileName = req.fileName;


    const importedFile = new ImportedFile({ fileName });
    await importedFile.save();
    const filePath = path.join(__dirname, '../files', fileName); // Use file.originalname to get the original filename
    const fileContents = fs.readFileSync(filePath);

    const workbook = XLSX.read(fileContents, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const products = jsonData.map(item => ({
      title: item.Title,
      photo: item.Photo ? item.Photo.split(',').map(photo => photo.trim()) : [],
      alt: item.Alt ? item.Alt.split(',').map(alt => alt.trim()) : [],
      details: item.Details,
      status: item.Status,
      categories: item.Categories,
      subcategories: item.Subcategories,
      subSubcategories: item.SubSubcategories
    }));

    await Product.insertMany(products);

    res.status(200).json({ message: 'Data imported successfully' });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ message: 'Failed to import data' });
  }
};

const fetchUrlPriorityFreq = async (req, res) => {
  try {
    // Get productId from request parameters
    const product = await Product.find({}).select('_id url priority changeFreq lastmod');
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchUrlmeta = async (req, res) => {
  try {
    // Get productId from request parameters
    const product = await Product.find({}).select('_id url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta');
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

const editUrlPriorityFreq = async (req, res) => {
  try {
    const { id } = req.query; // Get productId from request parameters
    const { url, priority, changeFreq } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { url, priority, changeFreq, lastmod: Date.now() },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


const editUrlmeta = async (req, res) => {
  try {
    const { id } = req.query; // Get productId from request parameters
    const { url,metatitle,metadescription,metakeywords,metacanonical,metalanguage,metaschema,otherMeta} = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { url,metatitle,metadescription,metakeywords,metacanonical,metalanguage,metaschema,otherMeta },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
// const deleteUrlPriorityFreq = async (req, res) => {
//   try {
//     const { id } = req.query; // Get productId from request parameters

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { $unset: { url: "", priority: "", changeFreq: "" } },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     res.status(200).json({ message: "Url, priority, and freq deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

const fetchUrlPriorityFreqById = async (req, res) => {
  try {
    const { id } = req.query; // Extract id from query parameters

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Find the product by ID and select specific fields
    const product = await Product.findById(id).select('url priority changeFreq');

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchUrlmetaById = async (req, res) => {
  try {
    const { id } = req.query; // Extract id from query parameters

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Find the product by ID and select specific fields
    const product = await Product.findById(id).select('url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta');

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

downloadCatalogue = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../catalogues', filename);

  res.download(filePath, (err) => {
      if (err) {
          console.error(err);
          res.status(500).json({ message: 'File download failed' });
      }
  });
};

viewCatalogue = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'catalogues', filename);
  res.sendFile(filePath);
};


const getLatestProducts = async (req, res) => {
  try {
    const limit = 4;  // Fetch only the latest 4 products
    const products = await Product.find().sort({ createdAt: -1 }).limit(limit);  // Sort by creation date, most recent first

    // Map through the products to add the category name
    const productsWithCategoryName = await Promise.all(products.map(async (product) => {
      const category = await productCategory.findOne({ '_id': product.categories });
      const categoryName = category ? category.category : 'Uncategorized';
      return {
        ...product.toJSON(),
        categoryName
      };
    }));

    res.status(200).json({
      data: productsWithCategoryName,
      total: productsWithCategoryName.length,  // Total will be 4 since we limit the results
    });
  } catch (error) {
    console.error("Error retrieving latest products:", error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage, error });
  }
};

const getAllProductsByPriority
 = async (req, res) => {
  try {
    // Fetch products sorted by priority in ascending order (0 to 1)
    const products = await Product.find().sort({ priority: 1 }); // 1 for ascending order

    // Fetch category names for each product
    const productsWithCategoryName = await Promise.all(
      products.map(async (product) => {
        const category = await productCategory.findOne({ _id: product.categories });
        const categoryName = category ? category.category : 'Uncategorized';
        return {
          ...product.toJSON(),
          categoryName,
        };
      })
    );

    res.status(200).json({
      data: productsWithCategoryName,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage, error });
  }
}; 

const getProductsByCategories = async (req, res) => {
  try {
    let { categoryIds } = req.query;

    // Parse the categoryIds string into an array
    if (typeof categoryIds === 'string') {
      categoryIds = categoryIds.split(',');
    }

    // Validate if categoryIds exists and is valid
    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({
        message: 'Please provide valid category IDs'
      });
    }

    // Find products for the specified categories
    const products = await Product.find({
      categories: { $in: categoryIds }
    }).select('+isVisible').lean(); // Explicitly include isVisible field

    const productsWithCategoryName = await Promise.all(products.map(async (product) => {
      const category = await productCategory.findOne({ '_id': product.categories });
      const categoryName = category ? category.category : 'Uncategorized';
      
      return {
        ...product,
        categoryName
      };
    }));

    res.status(200).json({
      data: productsWithCategoryName
    });
  } catch (error) {
    console.error("Error retrieving products by categories:", error);
    res.status(500).json({ 
      message: error.name === 'CastError' ? 'Invalid query parameter format' : 'Server error', 
      error 
    });
  }
};  

const GetProductsforGrid = async (req, res) => {
  try {
    // Define the specific slugs we want to fetch
    const targetSlugs = ['combi','robotics-arm-for-pick-n-place','rotary-bagger' ,  'loading-conveyor'];
    
    // Find products matching these specific slugs and maintain the order
    const products = await Promise.all(
      targetSlugs.map(async (slug) => {
        const product = await Product.findOne({ slug });
        if (!product) return null;

        // Get category details - Add validation check
        let categoryName = 'Uncategorized';
        if (product.categories && mongoose.Types.ObjectId.isValid(product.categories)) {
          const category = await productCategory.findOne({ '_id': product.categories });
          if (category) categoryName = category.category;
        }

        // Get subcategory details if exists - Add validation check
        let subcategoryName = null;
        if (product.subcategories && 
            product.subcategories.length > 0 && 
            mongoose.Types.ObjectId.isValid(product.subcategories[0])) {
          const subcategoryDetails = await productCategory.findOne({ 
            '_id': product.subcategories[0] 
          });
          if (subcategoryDetails) subcategoryName = subcategoryDetails.category;
        }

        // Get subSubcategory details if exists - Add validation check
        let subSubcategoryName = null;
        if (product.subSubcategories && 
            product.subSubcategories.length > 0 && 
            mongoose.Types.ObjectId.isValid(product.subSubcategories[0])) {
          const subSubcategoryDetails = await productCategory.findOne({ 
            '_id': product.subSubcategories[0] 
          });
          if (subSubcategoryDetails) subSubcategoryName = subSubcategoryDetails.category;
        }

        return {
          ...product.toJSON(),
          categoryName,
          subcategoryName,
          subSubcategoryName
        };
      })
    );

    // Filter out any null values (slugs that weren't found)
    const validProducts = products.filter(product => product !== null);

    if (validProducts.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No products found for the specified slugs',
        requestedSlugs: targetSlugs
      });
    }

    res.status(200).json({
      success: true,
      count: validProducts.length,
      requestedSlugs: targetSlugs,
      data: validProducts
    });

  } catch (error) {
    console.error("Error retrieving products by slugs:", error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {downloadCatalogue,viewCatalogue,getAllProductsByPriority,
  getLatestProducts, insertProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct, getCategoryProducts, getSubcategoryProducts, getSubSubcategoryProducts, countProducts, deletePhotoAndAltText, exportProductsToExcel, importProducts, fetchUrlPriorityFreq, editUrlPriorityFreq, fetchUrlPriorityFreqById,fetchUrlmeta, editUrlmeta, fetchUrlmetaById ,getPopularProducts, getProductsByCategories , GetProductsforGrid } 
