import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { FilterState, ProductType } from '../../pages/products';

interface Category {
  id: number;
  name: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

export const FilterSidebar = ({ filters, onFilterChange, onClearFilters }: FilterSidebarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    type: true,
    price: true,
    brand: true,
    stock: true,
    sort: true
  });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    setBrands(['Apple', 'Samsung', 'Microsoft', 'Sony', 'Dell', 'HP', 'Lenovo', 'Adobe', 'Autodesk']);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const productTypes: Array<{ value: ProductType; label: string }> = [
    { value: 'hardware', label: 'Hardware' },
    { value: 'software', label: 'Software' },
    { value: 'service', label: 'Services' }
  ];

  const stockStatuses = [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'on_backorder', label: 'On Backorder' }
  ];

  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'ASC' },
    { value: 'price-desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'DESC' },
    { value: 'name-asc', label: 'Name: A-Z', sortBy: 'name', sortOrder: 'ASC' },
    { value: 'name-desc', label: 'Name: Z-A', sortBy: 'name', sortOrder: 'DESC' },
    { value: 'newest', label: 'Newest First', sortBy: 'createdAt', sortOrder: 'DESC' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('type')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Product Type</h3>
            {expandedSections.type ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.type && (
            <div className="space-y-2">
              {productTypes.map(type => (
                <label key={type.value} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="productType"
                    value={type.value}
                    checked={filters.productType === type.value}
                    onChange={(e) => onFilterChange({ productType: e.target.value as ProductType })}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{type.label}</span>
                </label>
              ))}
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="productType"
                  value=""
                  checked={filters.productType === ''}
                  onChange={() => onFilterChange({ productType: '' })}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">All Types</span>
              </label>
            </div>
          )}
        </div>

        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Category</h3>
            {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.category && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ''}
                  onChange={() => onFilterChange({ category: '' })}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">All Categories</span>
              </label>
              {categories.map(category => (
                <label key={category.id} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={filters.category === String(category.id)}
                    onChange={(e) => onFilterChange({ category: e.target.value })}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Price Range</h3>
            {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.price && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10000"
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Brand</h3>
            {expandedSections.brand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.brand && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="brand"
                  value=""
                  checked={filters.brand === ''}
                  onChange={() => onFilterChange({ brand: '' })}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">All Brands</span>
              </label>
              {brands.map(brand => (
                <label key={brand} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="brand"
                    value={brand}
                    checked={filters.brand === brand}
                    onChange={(e) => onFilterChange({ brand: e.target.value })}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('stock')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Availability</h3>
            {expandedSections.stock ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.stock && (
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="stockStatus"
                  value=""
                  checked={filters.stockStatus === ''}
                  onChange={() => onFilterChange({ stockStatus: '' })}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">All</span>
              </label>
              {stockStatuses.map(status => (
                <label key={status.value} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="stockStatus"
                    value={status.value}
                    checked={filters.stockStatus === status.value}
                    onChange={(e) => onFilterChange({ stockStatus: e.target.value })}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{status.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleSection('sort')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Sort By</h3>
            {expandedSections.sort ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSections.sort && (
            <select
              value={`${filters.sortBy}-${filters.sortOrder.toLowerCase()}`}
              onChange={(e) => {
                const option = sortOptions.find(opt => opt.value === e.target.value);
                if (option) {
                  onFilterChange({
                    sortBy: option.sortBy as 'price' | 'name' | 'createdAt',
                    sortOrder: option.sortOrder as 'ASC' | 'DESC'
                  });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};