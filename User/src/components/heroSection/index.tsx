import { ArrowRightIcon } from "lucide-react";
import { Button } from "../../assets/button";
import type { JSX } from "react";
import heroBackgroundImage from "../../assets/HeroBackgroundImage.jpeg";

export const HeroSection = (): JSX.Element => {
  return (
    <section className="relative w-full py-10 lg:py-50 px-4 overflow-hidden">
      <img
        src={heroBackgroundImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(0,194,255,1) 43%, rgba(138,43,226,1) 100%)",
          opacity: 0.8,
        }}
      />

      <div className="container flex flex-col items-center gap-5 max-w-4xl mx-auto text-center relative z-20">
        <div className="flex flex-col items-center gap-2.5 w-full">
          <h1 className="font-['Poppins',Helvetica] font-normal text-white text-2xl sm:text-3xl lg:text-5xl text-center">
            Welcome to Lunio
          </h1>
          <p className="font-['Poppins',Helvetica] font-normal text-white text-lg sm:text-xl lg:text-[32px] text-center max-w-3xl">
            Your Ultimate Destination for Technology, Gaming &amp; Digital
            Services
          </p>
        </div>

        <Button
          variant="default"
          className="bg-white text-black hover:bg-white/90 shadow-[0px_0px_4px_#151c74] rounded-[10px] px-4 lg:px-6 py-2 lg:py-2.5"
        >
          <span className="font-['Poppins',Helvetica] font-normal text-sm lg:text-base">
            Shop now
          </span>
          <ArrowRightIcon className="ml-2 h-4 w-4 lg:h-5 lg:w-5 rotate-[45deg]" />
        </Button>
      </div>
    </section>
  );
};
