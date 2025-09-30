import { ShoppingCart, Star, Package, Download, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { addToCart, openCart } from '../../store/slices/cartSlice';
import type { Product } from '../../pages/products';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || undefined,
      image: product.primaryImage || product.images[0]?.imageUrl || 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=600',
      productType: product.productType,
      stockStatus: product.stockStatus,
      maxQuantity: product.stockQuantity,
    }));

    dispatch(openCart());
  };

  const getProductIcon = () => {
    switch (product.productType) {
      case 'hardware':
        return <Package className="w-4 h-4" />;
      case 'software':
        return <Download className="w-4 h-4" />;
      case 'service':
        return <Settings className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStockBadge = () => {
    switch (product.stockStatus) {
      case 'in_stock':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">In Stock</span>;
      case 'out_of_stock':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Out of Stock</span>;
      case 'on_backorder':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Backorder</span>;
      default:
        return null;
    }
  };

  const getProductTypeSpecifics = () => {
    switch (product.productType) {
      case 'hardware':
        return (
          <div className="space-y-1">
            {product.brand && (
              <p className="text-xs text-gray-500">Brand: <span className="font-medium text-gray-700">{product.brand}</span></p>
            )}
            {product.attributes.find(attr => attr.name === 'Model') && (
              <p className="text-xs text-gray-500">
                Model: <span className="font-medium text-gray-700">{product.attributes.find(attr => attr.name === 'Model')?.value}</span>
              </p>
            )}
          </div>
        );
      case 'software':
        return (
          <div className="space-y-1">
            {product.attributes.find(attr => attr.name === 'Version') && (
              <p className="text-xs text-gray-500">
                Version: <span className="font-medium text-gray-700">{product.attributes.find(attr => attr.name === 'Version')?.value}</span>
              </p>
            )}
            {product.attributes.find(attr => attr.name === 'License Type') && (
              <p className="text-xs text-gray-500">
                License: <span className="font-medium text-gray-700">{product.attributes.find(attr => attr.name === 'License Type')?.value}</span>
              </p>
            )}
          </div>
        );
      case 'service':
        return (
          <div className="space-y-1">
            {product.attributes.find(attr => attr.name === 'Duration') && (
              <p className="text-xs text-gray-500">
                Duration: <span className="font-medium text-gray-700">{product.attributes.find(attr => attr.name === 'Duration')?.value}</span>
              </p>
            )}
            {product.attributes.find(attr => attr.name === 'Service Type') && (
              <p className="text-xs text-gray-500">
                Type: <span className="font-medium text-gray-700">{product.attributes.find(attr => attr.name === 'Service Type')?.value}</span>
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-gray-100">
          <img
            src={product.primaryImage || product.images[0]?.imageUrl || 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=600'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=600';
            }}
          />

          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              {discountPercent}% OFF
            </div>
          )}

          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            {getProductIcon()}
            <span className="text-xs font-medium text-gray-700 capitalize">{product.productType}</span>
          </div>

          {product.featured && (
            <div className="absolute bottom-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 font-medium">{product.categoryName}</span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription || product.description}
        </p>

        {getProductTypeSpecifics()}

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {getStockBadge()}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stockStatus === 'out_of_stock'}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {product.stockStatus === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};