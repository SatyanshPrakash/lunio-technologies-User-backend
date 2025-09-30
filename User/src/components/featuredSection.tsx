import { type JSX, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProductsByType } from "../store/slices/productsSlice";
import { fetchFeaturedReviews } from "../store/slices/reviewsSlice";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { Separator } from "./seprator";
import { Star } from "lucide-react";
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, ShoppingCart } from "lucide-react";
import { Button } from "../assets/button";
import { addToCart, openCart } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";

export const FeaturedSection = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const reviewsScrollRef = useRef<HTMLDivElement>(null);

  const { hardwareProducts, softwareProducts, serviceProducts, loading: productsLoading } = useAppSelector((state) => state.products);
  const { featuredReviews, loading: reviewsLoading } = useAppSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchProductsByType({ productType: 'hardware', limit: 4 }));
    dispatch(fetchProductsByType({ productType: 'software', limit: 4 }));
    dispatch(fetchProductsByType({ productType: 'service', limit: 4 }));
    dispatch(fetchFeaturedReviews());
  }, [dispatch]);

  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsScrollRef.current) {
      const scrollAmount = 320;
      const currentScroll = reviewsScrollRef.current.scrollLeft;
      const targetScroll = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

      reviewsScrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || undefined,
      image: product.primaryImage || product.images?.[0]?.imageUrl || 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=600',
      productType: product.productType,
      stockStatus: product.stockStatus,
      maxQuantity: product.stockQuantity,
    }));
    dispatch(openCart());
  };

  const renderProductCards = (products: any[], title: string) => {
    if (productsLoading && products.length === 0) {
      return Array(4).fill(null).map((_, index) => (
        <Card
          key={`skeleton-${index}`}
          className="w-full sm:w-72 lg:w-80 rounded-xl overflow-hidden shadow-[0px_0px_4px_#00000040] bg-backgroundsnow-white flex-shrink-0 animate-pulse"
        >
          <div className="w-full h-40 lg:h-[198px] bg-gray-200" />
          <CardContent className="flex flex-col items-start gap-2.5 p-4 lg:p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </CardContent>
        </Card>
      ));
    }

    if (products.length === 0) {
      return (
        <div className="w-full text-center py-8 text-gray-500">
          No {title.toLowerCase()} products available
        </div>
      );
    }

    return products.map((product) => {
      const displayPrice = product.salePrice || product.price;
      const avgRating = 4.5;

      return (
        <Card
          key={product.id}
          className="w-full sm:w-72 lg:w-80 rounded-xl overflow-hidden shadow-[0px_0px_4px_#00000040] bg-backgroundsnow-white flex-shrink-0 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <div
            className="relative w-full h-40 lg:h-[198px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${product.primaryImage || product.images?.[0]?.imageUrl || 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=600'})`
            }}
          >
            {product.featured && (
              <Badge className="absolute top-3 lg:top-[18px] right-3 lg:right-5 bg-[#3c3c43] text-backgroundsnow-white rounded-[100px] border border-solid p-1 lg:p-2">
                <span className="[font-family:'Source_Code_Pro',Helvetica] text-xs text-white">
                  Featured
                </span>
              </Badge>
            )}
          </div>
          <CardContent className="flex flex-col items-start gap-2.5 p-4 lg:p-6">
            <div className="flex flex-col items-start gap-1.5 w-full">
              <h3 className="[font-family:'Poppins',Helvetica] font-normal text-black text-lg lg:text-xl line-clamp-1">
                {product.name}
              </h3>
              <p className="[font-family:'Poppins',Helvetica] font-normal text-[#666666] text-sm lg:text-[15px] line-clamp-2">
                {product.shortDescription || product.description}
              </p>
              <div className="flex items-start gap-1.5">
                {Array(5).fill(null).map((_, i) => (
                  <Star
                    key={`star-${product.id}-${i}`}
                    className="w-4 h-4 lg:w-[19.02px] lg:h-[18.09px]"
                    fill={i < Math.floor(avgRating) ? "#FBBF24" : "none"}
                    color="#FBBF24"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="[font-family:'Poppins',Helvetica] font-semibold text-black text-lg lg:text-xl">
                ${displayPrice.toFixed(2)}
                {product.salePrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                disabled={product.stockStatus === 'out_of_stock'}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </CardContent>
        </Card>
      );
    });
  };

  const renderReviewCards = () => {
    if (reviewsLoading && featuredReviews.length === 0) {
      return Array(3).fill(null).map((_, index) => (
        <Card
          key={`skeleton-review-${index}`}
          className="flex-none p-4 lg:p-5 bg-white rounded-[13px] w-72 lg:w-auto animate-pulse"
        >
          <CardContent className="p-0 flex flex-col gap-2.5">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 lg:w-[54.17px] lg:h-[54.17px] bg-gray-200 rounded-full" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </CardContent>
        </Card>
      ));
    }

    if (featuredReviews.length === 0) {
      return (
        <div className="w-full text-center py-8 text-gray-500">
          No reviews available
        </div>
      );
    }

    return featuredReviews.map((review) => (
      <Card
        key={review.id}
        className="flex-none p-4 lg:p-5 bg-white rounded-[13px] w-72 lg:w-auto"
      >
        <CardContent className="p-0 flex flex-col gap-2.5">
          <div className="flex flex-col w-full lg:w-[296.83px] gap-2.5">
            <div className="flex items-center gap-3.5">
              <Avatar className="w-10 h-10 lg:w-[54.17px] lg:h-[54.17px]">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
                  {review.userName?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Avatar>
              <span className="[font-family:'Heebo',Helvetica] font-medium text-[#323232] text-lg lg:text-[23.7px] lg:leading-[35.6px]">
                {review.userName}
              </span>
              <div className="w-1 h-1 lg:w-[3.39px] lg:h-[3.39px] bg-[#323232] rounded-full" />
              <span className="[font-family:'Heebo',Helvetica] font-normal text-[#323232] text-sm lg:text-[18px]">
                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {Array(5).fill(null).map((_, i) => (
                <Star
                  key={`review-star-${review.id}-${i}`}
                  className="w-4 h-4"
                  fill={i < review.rating ? "#FBBF24" : "none"}
                  color="#FBBF24"
                />
              ))}
            </div>
          </div>
          <div className="relative w-full lg:w-[296.83px]">
            {review.title && (
              <p className="[font-family:'Heebo',Helvetica] font-semibold text-[#323232] text-base mb-2">
                {review.title}
              </p>
            )}
            <p className="[font-family:'Heebo',Helvetica] font-normal text-[#323232] text-sm leading-[21px] line-clamp-4">
              {review.comment}
            </p>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderSectionHeader = (title: string) => {
    return (
      <div className="flex flex-col w-full lg:w-[386px] items-start lg:items-end gap-[5px]">
        <h2 className="self-stretch mt-[-1.00px] [font-family:'Jura'] font-semibold text-black text-2xl lg:text-[40px] tracking-[0] leading-[normal]">
          {title}
        </h2>
        <Separator className="w-20 lg:w-40 h-0.5 bg-purple" />
      </div>
    );
  };

  const renderSeeMore = (route: string) => {
    return (
      <button
        onClick={() => navigate(route)}
        className="[font-family:'Poppins',Helvetica] font-normal text-black text-base underline hover:text-blue-600 transition-colors"
      >
        See more
      </button>
    );
  };

  return (
    <div className="flex flex-col w-full items-center px-4 lg:px-0 gap-16 lg:gap-28 py-12 lg:py-[100px] bg-white">
      {/* Hardware Section */}
      <div className="flex flex-col items-center gap-8 lg:gap-[49px] w-full max-w-[1350px]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-4">
          {renderSectionHeader("Featured Hardware")}
          {renderSeeMore("/products?type=hardware")}
        </div>
        <div className="flex gap-4 lg:gap-10 w-full overflow-x-auto pb-4 scrollbar-hide">
          {renderProductCards(hardwareProducts, "Hardware")}
        </div>
      </div>

      {/* Software Section */}
      <div className="flex flex-col items-center gap-8 lg:gap-[49px] w-full max-w-[1350px]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-4">
          {renderSectionHeader("Featured Software")}
          {renderSeeMore("/products?type=software")}
        </div>
        <div className="flex gap-4 lg:gap-10 w-full overflow-x-auto pb-4 scrollbar-hide">
          {renderProductCards(softwareProducts, "Software")}
        </div>
      </div>

      {/* Services Section */}
      <div className="flex flex-col items-center gap-8 lg:gap-[49px] w-full max-w-[1350px]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-4">
          {renderSectionHeader("Featured Services")}
          {renderSeeMore("/products?type=service")}
        </div>
        <div className="flex gap-4 lg:gap-10 w-full overflow-x-auto pb-4 scrollbar-hide">
          {renderProductCards(serviceProducts, "Services")}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="flex flex-col items-center gap-8 lg:gap-[49px] w-full max-w-[1350px]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-4">
          {renderSectionHeader("What Our Customers Say")}
          <div className="flex gap-2">
            <Button
              onClick={() => scrollReviews('left')}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => scrollReviews('right')}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div
          ref={reviewsScrollRef}
          className="flex gap-4 lg:gap-5 w-full overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {renderReviewCards()}
        </div>
      </div>
    </div>
  );
};