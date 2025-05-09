import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useViewProductQuery } from '../../../features/userAuth/userProductApislice';
import Breadcrumbs from '../../common/BreadCrumbs';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductFeatures from './ProductFeatures';
import ReviewForm from './ReviewForm';
import RelatedProducts from './RelatedProduct';
import { Loader2 } from 'lucide-react';

const ProductView = () => {
  const { id } = useParams();
  const { data, isLoading, error, refetch } = useViewProductQuery(id);
  const [selectedColor, setSelectedColor] = useState(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
  ]);

useEffect(() => {
  refetch(); 
  setSelectedColor(null); 
}, [id, refetch, setSelectedColor]);

  useEffect(() => {
    if (data?.product) {
      setBreadcrumbItems([
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/shop' },
        { label: data.product.name },
      ]);

      if (data.product.colors.length > 0 && !selectedColor) {
        setSelectedColor(data.product.colors[0].name);
      }
    }
  }, [data]); 


  if (isLoading) {
    return (
      <div className="py-16 md:py-12">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-ceramic-accent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 md:py-12">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold text-ceramic-red mb-4">Error Loading Product</h2>
          <p className="text-ceramic-dark mb-6">{error.message || 'There was an error loading the product.'}</p>
          <a href="/shop" className="text-ceramic-accent hover:underline">Return to Shop</a>
        </div>
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="py-16 md:py-12">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-center min-h-screen">
          <p className="text-ceramic-dark">Product not found.</p>
        </div>
      </div>
    );
  }

  const product = data.product;
  const relatedProductsRaw = data.relatedProducts || [];

  const relatedProducts = relatedProductsRaw.map(product => ({
    id: product._id,
    name: product.name,
    price: product.price,
    discount: product.discount,
    discountedPrice: product.discountedPrice,
    image: product.colors?.[0]?.images?.[0] || product.images?.[0],
    inStock: product.totalStock > 0,
    colors: product.colors.map(color => ({
      name: color.name,
      images: color.images || [],
      stock: color.stock || 0,
    })),
  }));

  const galleryImages = selectedColor
    ? product.colors.find(color => color.name === selectedColor)?.images || []
    : product.colors[0]?.images || [];

  return (
    <div className="py-16 md:py-12">
      <div className="container mx-auto px-4 md:px-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <ProductGallery 
            images={galleryImages}
            isNew={new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
            discount={product.discount}
          />
          <ProductInfo 
            product={product} 
            onColorSelect={setSelectedColor}
            selectedColor={selectedColor}
          />
        </div>
        <ProductFeatures />
        <ReviewForm productId={product._id} />
        {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
      </div>
    </div>
  );
};

export default ProductView;