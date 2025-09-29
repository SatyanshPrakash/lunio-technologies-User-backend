import type { JSX } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";

export const NavbarSection = (): JSX.Element => {
  // Navigation items data for easy mapping
  const navItems = [
    { label: "Home", hasDropdown: false, link: "/" },
    { label: "Hardware", hasDropdown: false, link: "/" },
    { label: "Software", hasDropdown: false },
    { label: "Digital Products", hasDropdown: false },
    { label: "Services", hasDropdown: false },
    { label: "KYC Verification", hasDropdown: false },
    { label: "Order", hasDropdown: false, link: "/order-history" },
    { label: "Blog", hasDropdown: false, link: "/blogs" },
  ];

  return (
    <div className="w-full h-[50px] py-[13px] px-10 border-b border-[#0000001a] bg-[linear-gradient(135deg,rgba(0,194,255,1)_43%,rgba(138,43,226,1)_100%)] font-family-['Poppins']">
      <NavigationMenu className="max-w-none">
        <NavigationMenuList className="flex items-center gap-14">
          {navItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              {item.hasDropdown ? (
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent h-auto p-0 font-normal text-white text-base [font-family:'Poppins',Helvetica]">
                  {item.label}
                </NavigationMenuTrigger>
              ) : (
                <NavigationMenuLink
                  className="font-normal text-white text-base [font-family:'Poppins',Helvetica] p-0"
                  href={item.link || "#"}
                >
                  {item.label}
                </NavigationMenuLink>
              )}
              {item.hasDropdown && (
                <NavigationMenuContent>
                  {/* Placeholder for dropdown content */}
                  <div className="p-4 w-[200px]">
                    <div className="text-sm">
                      Dropdown content for {item.label}
                    </div>
                  </div>
                </NavigationMenuContent>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      
    </div>
  );
};
