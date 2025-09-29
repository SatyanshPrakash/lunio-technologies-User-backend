import { SearchIcon, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "../../assets/button"
import { Input } from "../../assets/input";
import type { JSX } from "react";
import LogoImage from "../../../assets/favicons/lunio mein logo ai febicon png-2-01.png";
import ThemeToggle from "../../assets/ThemeToggle";

export const Topbar = (): JSX.Element => {
 const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="w-full flex items-center justify-between px-10 py-[15px] bg-[linear-gradient(135deg,rgba(0,194,255,1)_45%,rgba(138,43,226,1)_100%)]">
      <div className="flex items-center justify-between w-full gap-[113px]">
        <div className="flex items-center gap-[125px]">
          <img
            className="w-[130px] h-[55px]"
            alt="Lunio main logo"
            src={LogoImage}
          />

          <div className="flex items-center w-[468px] h-[52px] bg-white rounded-[30px] border-2 border-solid border-[#4682b4] shadow-[0px_4px_4px_#0000004c]">
            <div className="flex items-center pl-5">
              <SearchIcon className="w-[22px] h-[22px] text-[#4682b4]" />
            </div>
            <Input
              className="border-0 shadow-none h-full font-['Poppins',Helvetica] text-[#4682b4] text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="SearchIcon for products"
            />
          </div>
        </div>

      <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />

        <div className="flex items-center justify-center gap-5">
          <div className="w-[45px] h-[45px] bg-[url(/vector-18.svg)] bg-[100%_100%]" />

          <Button
            variant="outline"
            className="h-[52px] px-[30px] py-0 bg-white rounded-[10px] border-2 border-solid border-[#7f5af0] shadow-[0px_4px_4px_#0000004c] font-['Poppins',Helvetica] font-normal text-[#4682b4] text-base"
          >
            Sign in
          </Button>

          <Button className="h-[52px] px-[22px] py-0 bg-coloursecondary rounded-[10px] border-2 border-solid border-white shadow-[0px_4px_4px_#0000004c] font-['Poppins',Helvetica] font-normal text-white text-base">
            <div className="relative w-6 h-6 mr-2.5">
              <div className="relative w-[18px] h-[18px] top-[3px] left-[3px]">
                  <Globe/>
              </div>
            </div>
            EN
          </Button>
        </div>
      </div>
    </header>
  );
};
