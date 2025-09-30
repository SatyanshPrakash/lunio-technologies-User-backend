import { type JSX, useRef } from "react";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { Separator } from "./seprator";
import { Star } from "lucide-react";
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Button } from "../assets/button";
import SampleImage from "../assets/ba5309c6-39fa-4f0f-9c62-de5d63d00b3b.jpg";

export const FeaturedSection = (): JSX.Element => {
  // Product data for reuse
  const productData = {
    title: "Gaming Laptop RTX 4080",
    description: "High-performance gaming laptop with latest RTX graphics",
    price: "$2,499",
    label: "label",
    backgroundImage: `url(${SampleImage})`,
  };

  const reviewsScrollRef = useRef<HTMLDivElement>(null);

  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsScrollRef.current) {
      const scrollAmount = 320; // Width of card + gap
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

  // Game topup data
  const gameTopupData = [
    {
      backgroundImage: "url(..//image-12.png)",
      title: "Gaming Laptop RTX 4080",
    },
    {
      backgroundImage: "url(..//image-13.png)",
      title: "Gaming Laptop RTX 4080",
    },
    {
      backgroundImage: "url(..//image-14.png)",
      title: "Gaming Laptop RTX 4080",
    },
    {
      backgroundImage: "url(..//image-15.png)",
      title: "Gaming Laptop RTX 4080",
    },
  ];

  // Review data
  const reviewData = {
    username: "KaiB",
    date: "22 Jul",
    text: "KaiB was amazing with our cats!! 🌟🌟🌟 This was our first time using a pet-sitting service, so we were naturally quite anxious. We took a chance on Kai and completely lucked out!",
    avatar: "/avatar-4.png",
  };

  // Function to render product cards
  const renderProductCards = () => {
    return Array(4)
      .fill(null)
      .map((_, index) => (
        <Card
          key={`product-${index}`}
          className="w-full sm:w-72 lg:w-80 rounded-xl overflow-hidden shadow-[0px_0px_4px_#00000040] bg-backgroundsnow-white flex-shrink-0 "
        >
          <div
            className="relative w-full h-40 lg:h-[198px]"
            style={{ background: productData.backgroundImage }}
          >
            <Badge className="absolute top-3 lg:top-[18px] right-3 lg:right-5 bg-[#3c3c43] text-backgroundsnow-white rounded-[100px] border border-solid p-1 lg:p-2">
              <span className="[font-family:'Source_Code_Pro',Helvetica] text-xs text-white">
                {productData.label}
              </span>
            </Badge>
          </div>
          <CardContent className="flex flex-col items-start gap-2.5 p-4 lg:p-6">
            <div className="flex flex-col items-start gap-1.5 w-full">
              <h3 className="[font-family:'Poppins',Helvetica] font-normal text-black text-lg lg:text-xl">
                {productData.title}
              </h3>
              <p className="[font-family:'Poppins',Helvetica] font-normal text-[#666666] text-sm lg:text-[15px]">
                {productData.description}
              </p>
              <div className="flex items-start gap-1.5">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                    type="filled"
                    color="#FBBF24"
                      key={`star-${index}-${i}`}
                      className="w-4 h-4 lg:w-[19.02px] lg:h-[18.09px]"
                    />
                  ))}
              </div>
            </div>
            <p className="[font-family:'Poppins',Helvetica] font-normal text-black text-sm lg:text-[15px]">
              {productData.price}
            </p>
          </CardContent>
        </Card>
      ));
  };

  // Function to render game topup cards
  const renderGameTopupCards = () => {
    return gameTopupData.map((game, index) => (
      <Card
        key={`game-${index}`}
        className="w-full sm:w-72 lg:w-80 rounded-xl overflow-hidden shadow-[0px_0px_4px_#00000040] bg-colourprimary flex-shrink-0"
      >
        <div
          className="relative w-full h-48 lg:h-[307px]"
          style={{ background: game.backgroundImage }}
        >
          <Badge className="absolute top-3 lg:top-[18px] right-3 lg:right-5 bg-[#3c3c43] text-colourprimary rounded-[100px] border border-solid p-1 lg:p-2">
            <span className="[font-family:'Source_Code_Pro',Helvetica] text-xs">
              label
            </span>
          </Badge>
        </div>
        <CardContent className="flex flex-col items-start gap-2.5 p-4 lg:p-6">
          <div className="flex flex-col items-start gap-1.5 w-full">
            <h3 className="[font-family:'Poppins',Helvetica] font-normal text-black text-lg lg:text-xl">
              {game.title}
            </h3>
          </div>
        </CardContent>
      </Card>
    ));
  };

  // Function to render review cards
  const renderReviewCards = () => {
    return Array(5)
      .fill(null)
      .map((_, index) => (
        <Card
          key={`review-${index}`}
          className="flex-none p-4 lg:p-5 bg-white rounded-[13px] w-72 lg:w-auto"
        >
          <CardContent className="p-0 flex flex-col gap-2.5">
            <div className="flex flex-col w-full lg:w-[296.83px] gap-2.5">
              <div className="flex items-center gap-3.5">
                <Avatar className="w-10 h-10 lg:w-[54.17px] lg:h-[54.17px]">
                  <img
                    className="object-cover"
                    alt="Avatar"
                    src={reviewData.avatar}
                  />
                </Avatar>
                <span className="[font-family:'Heebo',Helvetica] font-medium text-[#323232] text-lg lg:text-[23.7px] lg:leading-[35.6px]">
                  {reviewData.username}
                </span>
                <div className="w-1 h-1 lg:w-[3.39px] lg:h-[3.39px] bg-[#323232] rounded-full" />
                <span className="[font-family:'Heebo',Helvetica] font-normal text-[#323232] text-lg lg:text-[23.7px] lg:leading-[35.6px]">
                  {" "}
                  {reviewData.date}
                </span>
              </div>
              <img className="flex-none" alt="Stars" src="/stars.svg" />
            </div>
            <div className="relative w-full lg:w-[296.83px] h-32">
              <p className="absolute w-full lg:w-[297px] h-[98px] -top-0.5 left-0 [font-family:'Heebo',Helvetica] font-normal text-[#323232] text-sm leading-[21px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:4] [-webkit-box-orient:vertical]">
                {reviewData.text}
              </p>
              <p className="absolute w-full lg:w-[297px] h-5 top-[106px] left-0 [font-family:'Heebo',Helvetica] font-medium text-[#72479c] text-sm lg:text-[15px] text-right leading-[22.5px]">
                Read More
              </p>
            </div>
          </CardContent>
        </Card>
      ));
  };

  // Function to render section header
  const renderSectionHeader = (title: string) => {
    return (
      <div className="flex flex-col w-full lg:w-[386px] items-start lg:items-end gap-[5px]">
        <h2
          className="self-stretch mt-[-1.00px] [font-family:'Jura'] font-semibold text-black text-2xl lg:text-[40px] tracking-[0] leading-[normal]"
        >
          {title}
        </h2>
        <Separator className="w-20 lg:w-40 h-0.5 bg-purple" />
      </div>
    );
  };

  // Function to render "See more" link
  const renderSeeMoreLink = () => {
    return (
      <div className="flex flex-col w-full lg:w-[386px] items-end gap-[5px]">
        <div className="inline-flex items-center justify-end gap-[5px] ml-[-23.00px]">
          <p className="w-full lg:w-[386px] mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-black text-sm lg:text-base text-right tracking-[0] leading-[normal]">
            See more
          </p>
          <div className="w-[18px] h-[18px] overflow-hidden rotate-90">
            <img
              className="absolute w-3 h-2.5 top-1 left-[3px] -rotate-90"
              alt="Vector"
              src="/vector.svg"
            />
          </div>
        </div>
        <Separator className="w-6 lg:w-10 h-0.5 bg-primaryhan-purple" />
      </div>
    );
  };

  return (
    <section className="flex flex-col w-full max-w-[1405px] gap-8 lg:gap-[30px] mx-auto px-4 lg:px-0 my-20">
      {/* Featured Hardware Section */}
      <div className="relative w-full">
        <div className="mb-4 lg:mb-8">
          {renderSectionHeader("Featured Hardware")}
        </div>
        <div className="flex gap-4 lg:gap-[30px] overflow-x-auto pb-4 mb-4">
          {renderProductCards()}
        </div>
        <div className="flex justify-end">
          {renderSeeMoreLink()}
        </div>
      </div>

      {/* Featured Software Section */}
      <div className="relative w-full">
        <div className="mb-4 lg:mb-8">
          {renderSectionHeader("Featured Software")}
        </div>
        <div className="flex gap-4 lg:gap-[30px] overflow-x-auto pb-4 mb-4">
          {renderProductCards()}
        </div>
        <div className="flex justify-end">
          {renderSeeMoreLink()}
        </div>
      </div>

      {/* Featured Services Section */}
      <div className="relative w-full">
        <div className="mb-4 lg:mb-8">
          {renderSectionHeader("Featured Services")}
        </div>
        <div className="flex gap-4 lg:gap-[30px] overflow-x-auto pb-4 mb-4">
          {renderProductCards()}
        </div>
        <div className="flex justify-end">
          {renderSeeMoreLink()}
        </div>
      </div>

      {/* Games Topup Section */}
      <div className="relative w-full">
        <div className="mb-4 lg:mb-8 flex flex-col items-start gap-[5px]">
          <div className="flex items-start justify-end gap-5">
            <h2 className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-semibold text-black text-2xl lg:text-[40px] tracking-[0] leading-[normal]">
              GAMES TOPUP SECTION
            </h2>
            <div className="relative w-6 h-8 lg:w-[30px] lg:h-[60px]">
              <img
                className="absolute w-4 h-6 lg:w-[18px] lg:h-8 top-1 lg:top-3.5 left-1 lg:left-1.5"
                alt="Vector"
                src="/vector-3.svg"
              />
            </div>
          </div>
          <Separator className="w-20 lg:w-40 h-0.5 bg-primaryhan-purple" />
        </div>
        <div className="flex gap-4 lg:gap-[30px] overflow-x-auto pb-4 mb-4">
          {renderGameTopupCards()}
        </div>
        <div className="flex justify-end">
          {renderSeeMoreLink()}
        </div>
      </div>

      {/* Reviews Section */}
       <div className="flex flex-col gap-6 lg:gap-10 w-full relative">
        <div className="flex flex-col items-start gap-[5px] bg-white">
          <div className="flex items-start justify-end gap-5">
            <h2 className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-semibold text-black text-2xl lg:text-[40px] tracking-[0] leading-[normal]">
              Reviews
            </h2>
            <div className="relative w-6 h-8 lg:w-[30px] lg:h-[60px]">
              <img
                className="absolute w-4 h-6 lg:w-[18px] lg:h-8 top-1 lg:top-3.5 left-1 lg:left-1.5"
                alt="Vector"
                src="/vector-3.svg"
              />
            </div>
          </div>
          <Separator className="w-20 lg:w-[130px] h-0.5 bg-primaryhan-purple" />
        </div>
        
        <div className="relative w-full">
          {/* Left Arrow Button */}
          <Button
            onClick={() => scrollReviews('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 p-0 hidden sm:flex items-center justify-center"
            variant="outline"
          >
            <ChevronLeftIcon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
          </Button>

          {/* Right Arrow Button */}
          <Button
            onClick={() => scrollReviews('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 p-0 hidden sm:flex items-center justify-center"
            variant="outline"
          >
            <ChevronRightIcon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
          </Button>

          {/* Reviews Container */}
          <div 
            ref={reviewsScrollRef}
            className="flex gap-4 lg:gap-[30px] w-full overflow-x-hidden pb-4 scrollbar-hide px-0 sm:px-8"
          >
            {renderReviewCards()}
          </div>
        </div>
      </div>
    </section>
  );
};

