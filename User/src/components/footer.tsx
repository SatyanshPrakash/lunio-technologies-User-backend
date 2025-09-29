import { ArrowRightIcon } from "lucide-react";
import { Button } from "../assets/button";
import { Card, CardContent } from "../assets/card";
import { Input } from "../assets/input";
import type { JSX } from "react";

export const Footer = (): JSX.Element => {
  // Footer navigation links data
  const footerLinks = {
    product: [
      "Employee database",
      "Payroll",
      "Absences",
      "Time tracking",
      "Shift planner",
      "Recruiting",
    ],
    information: ["FAQ", "Blog", "Support"],
    company: ["About us", "Careers", "Contact us", "Lift Media"],
  };

  // Footer bottom links
  const legalLinks = ["Terms", "Privacy", "Cookies"];

  return (
    <footer className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-8 lg:py-16 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {/* Product Column */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-sm lg:text-base mb-2">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li
                  key={`product-${index}`}
                  className="opacity-75 font-normal text-sm lg:text-base"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Information Column */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-sm lg:text-base mb-2">Information</h3>
            <ul className="space-y-2">
              {footerLinks.information.map((link, index) => (
                <li
                  key={`info-${index}`}
                  className="opacity-75 font-normal text-sm lg:text-base"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-sm lg:text-base mb-2">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li
                  key={`company-${index}`}
                  className="opacity-75 font-normal text-sm lg:text-base"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe Card */}
          <Card className="w-full max-w-[340px] lg:w-[340px] rounded-[20px] bg-white md:col-span-2 lg:col-span-1 justify-self-center lg:justify-self-auto">
            <CardContent className="p-4 lg:p-6">
              <h3 className="font-bold text-sm lg:text-base text-[#2b2b2b] mb-4">
                Subscribe
              </h3>

              <div className="flex mb-4">
                <Input
                  placeholder="Email address"
                  className="rounded-l-md border-[1.5px] border-[#e7e8f2] text-[#7a7e92] text-sm"
                />
                <Button className="rounded-r-lg bg-[#0081fd] h-10 lg:h-[44.69px] w-10 lg:w-[50px] flex items-center justify-center p-0">
                  <ArrowRightIcon className="h-3 w-3 lg:h-4 lg:w-4 rotate-90 text-white" />
                </Button>
              </div>

              <p className="opacity-60 text-xs lg:text-xs text-[#2b2b2b]">
                Hello, we are Luniq. Our mission is to transform the way people
                experience technology — from cutting-edge hardware and powerful
                software to next-level gaming — by redefining how we connect
                with our customers and our team.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="h-[1px] bg-white opacity-20 my-6 lg:my-8 w-full"></div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0">
          {/* Logo */}
          <img
            className="w-20 h-8 lg:w-[127px] lg:h-[50px] object-cover"
            alt="Lunio logo"
            src="/lunio-mein-logo-ai-febicon-png-01-1.png"
          />

          {/* Legal Links */}
          <div className="flex gap-6 lg:gap-12">
            {legalLinks.map((link, index) => (
              <span key={`legal-${index}`} className="text-xs lg:text-sm font-medium">
                {link}
              </span>
            ))}
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4">
            <img 
              alt="Social media icons" 
              src="/frame-840.svg" 
              className="w-auto h-6 lg:h-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
