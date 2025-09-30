import { useState, useEffect } from 'react';
import { FilterSidebar } from '../components/products/FilterSidebar';
import { ProductCard } from '../components/products/ProductCard';
import { X, SlidersHorizontal } from 'lucide-react';

export type ProductType = 'hardware' | 'software' | 'service';

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  shortDescription: string;
  categoryId: number;
  categoryName: string;
  productType: ProductType;
  brand: string;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  stockStatus: 'in_stock' | 'out_of_stock' | 'on_backorder';
  status: string;
  featured: boolean;
  primaryImage: string;
  images: Array<{
    id: number;
    imageUrl: string;
    altText: string;
  }>;
  attributes: Array<{
    name: string;
    value: string;
  }>;
}

export interface FilterState {
  productType: ProductType | '';
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  stockStatus: string;
  sortBy: 'price' | 'name' | 'createdAt';
  sortOrder: 'ASC' | 'DESC';
}

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    productType: '',
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 10000,
    stockStatus: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(filters.productType && { productType: filters.productType }),
        ...(filters.category && { category: filters.category }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.minPrice > 0 && { minPrice: filters.minPrice.toString() }),
        ...(filters.maxPrice < 10000 && { maxPrice: filters.maxPrice.toString() }),
        ...(filters.stockStatus && { stockStatus: filters.stockStatus }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        status: 'active'
      });

      const response = await fetch(`http://localhost:5000/api/products?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        throw new Error(data.message || 'Failed to load products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      productType: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 10000,
      stockStatus: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {filters.productType ? `${filters.productType.charAt(0).toUpperCase() + filters.productType.slice(1)} Products` : 'All Products'}
          </h1>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          <div
            className={`
              fixed lg:sticky top-0 left-0 z-40 h-screen lg:h-auto lg:top-8
              w-80 lg:w-72 bg-white lg:bg-transparent
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              overflow-y-auto lg:overflow-visible
            `}
          >
            <div className="lg:hidden flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="w-full h-64 bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-medium mb-2">Error Loading Products</p>
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">No products found</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>

                    <span className="px-4 py-2 text-gray-700">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};