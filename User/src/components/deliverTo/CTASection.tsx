import {
  ChevronDownIcon,
  MapPinIcon,
  ShoppingCartIcon,
  StoreIcon,
  Headset
} from "lucide-react";
import React, { type JSX } from "react";

export const CTASection = (): JSX.Element => {
  // Navigation items data for the right side
  const navItems = [
    {
      icon: <StoreIcon color="#ffffffff" className="w-5 h-5" />,
      text: "Store",
    },
    {
      icon: <Headset color="#ffffffff" className="w-5 h-5" />,
      text: "Contact us",
    },
    {
      icon: <ShoppingCartIcon color="#ffffffff" className="w-5 h-5" />,
      text: "Cart",
    },
  ];

  return (
    <header className="flex w-full min-h-[50px] items-center justify-between px-4 lg:px-10 py-2 lg:py-[13px] bg-[linear-gradient(135deg,rgba(0,194,255,1)_40%,rgba(138,43,226,1)_100%)]">
      {/* Left side - Location selector */}
      <div className="flex items-center gap-[4px]">
        <div className="relative w-6 h-6 lg:w-[30px] lg:h-[30px] flex items-center justify-center">
          <MapPinIcon className="w-4 h-5 lg:w-[18px] lg:h-[25px] text-white" />
        </div>

        <div className="flex items-center gap-[1px]">
          <div className="font-['Poppins',Helvetica] font-normal text-white text-xs lg:text-base">
            <span className="hidden sm:inline">Deliver to </span>202020
          </div>

          <div className="relative w-7 h-10 flex items-center justify-center">
            <ChevronDownIcon className=" text-white" />
          </div>
        </div>
      </div>

      {/* Right side - Navigation items */}
      <div className="flex items-center gap-2 lg:gap-6">
        {navItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && index < 3 && (
            //   <img
            //     className="w-px h-4 lg:h-6 object-cover hidden sm:block"
            //     alt="Divider"   
            //     src="/line-2.svg"
            //   />
            <div className="text-white">|</div>
            )}
            <div className={`flex items-center gap-1 lg:gap-[5px] ${index === 1 ? 'hidden sm:flex' : ''}`}>
              {item.text === 'Cart' && (
                  <span className="absolute bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center z-50 mb-4 ml-3">
                    1
                  </span>
              )}
              <div className="relative w-4 h-4 lg:w-6 lg:h-6 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="font-['Poppins',Helvetica] font-normal text-white text-xs lg:text-base hidden lg:block">
                {item.text}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </header>
  );
};
