import React from 'react';
import type { JSX } from 'react';
import heroBackgroundImage from "../assets/HeroBackgroundImage.jpeg";
import LogoImage from "../../assets/favicons/lunio mein logo ai febicon png-01.png";

// Utility function for class names
function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'link';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4",
    link: "underline-offset-4 hover:underline text-primary h-auto p-0"
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// Card components
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = '', children }) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
    {children}
  </div>
);

const CardContent: React.FC<CardProps> = ({ className = '', children }) => (
  <div className={cn("p-6 pt-0", className)}>
    {children}
  </div>
);

// Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
);

// Label component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ className = '', children, ...props }) => (
  <label
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  >
    {children}
  </label>
);

// Main Login Page Component
export const LoginPage = (): JSX.Element => {
  const decorativeCircles = [
    {
      className: "w-[420px] h-[420px] top-[66px] left-[260px] rounded-[210px]",
    },
    {
      className: "w-[360px] h-[360px] top-[460px] left-[-72px] rounded-[180px]",
    },
    {
      className: "w-[360px] h-[360px] top-[636px] left-[337px] rounded-[180px]",
    },
  ];

  return (
    <main className="bg-white grid justify-items-center [align-items:start] w-screen">
      <div className="bg-white w-[1440px] h-[1024px] relative">
        <img
          className="absolute w-[722px] top-5 left-5 object-cover h-[984px] rounded-[20px]"
          alt="Rectangle"
          src={heroBackgroundImage}
        />

        <section className="flex flex-col w-[658px] h-[984px] items-end absolute top-5 left-[762px] overflow-hidden">
          <div className="relative self-stretch w-full bg-white h-[984px] rounded-[20px]" />

          {decorativeCircles.map((circle, index) => (
            <div
              key={`circle-${index}`}
              className={`${circle.className} absolute shadow-[inset_0px_0px_44px_10px_#ffffff80,0px_0px_4px_#000000a6] bg-[linear-gradient(90deg,rgba(0,194,255,1)_0%,rgba(138,43,226,1)_100%)]`}
            />
          ))}

          <Card className="flex w-[520px] h-[774px] items-center gap-2.5 p-[50px] absolute top-[115px] left-[81px] bg-[#cfcfcf33] rounded-[20px] border-[none] backdrop-blur-[17.5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(17.5px)_brightness(100%)] before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-[20px] before:[background:linear-gradient(193deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.5)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
            <CardContent className="relative w-[420px] h-[674px] p-0">
              <div className="flex flex-col w-[420px] items-start gap-[43px] absolute top-0 left-0">
                <img
                  className="relative w-[229px] h-[90px] object-cover"
                  alt="Lunio Technologies Pvt Ltd"
                  src={LogoImage}
                />

                <div className="flex flex-col items-center justify-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="inline-flex flex-col items-start gap-8 relative flex-[0_0_auto]">
                    <header className="inline-flex flex-col items-start justify-center gap-[3px] relative flex-[0_0_auto]">
                      <h1 className="relative w-fit mt-[-1.00px] [font-family:'Nunito_Sans',Helvetica] font-bold text-black text-4xl tracking-[0] leading-[normal]">
                        Login to your Account
                      </h1>

                      <p className="relative w-fit [font-family:'Nunito_Sans',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal]">
                        See what is going on with your business
                      </p>
                    </header>

                    <Button className="flex w-[420px] items-center justify-center gap-[13px] p-2.5 relative flex-[0_0_auto] rounded-[5px] border-2 text-[#373232] hover:bg-transparent">
                      <span className="relative w-fit [font-family:'Nunito_Sans',Helvetica] font-bold text-[#373232] text-sm tracking-[0] leading-[normal]">
                        Continue with Google
                      </span>
                    </Button>
                  </div>

                  <div className="relative w-fit [font-family:'Nunito_Sans',Helvetica] font-semibold text-transparent text-xs tracking-[0] leading-[normal]">
                    <span className="text-[#767676]">-------------</span>

                    <span className="text-black"> or Sign in with Email </span>

                    <span className="text-[#767676]">------------- </span>
                  </div>

                  <form className="inline-flex flex-col items-start gap-8 relative flex-[0_0_auto]">
                    <div className="inline-flex flex-col items-start gap-6 relative flex-[0_0_auto]">
                      <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                        <Label className="relative w-fit mt-[-1.00px] [font-family:'Nunito_Sans',Helvetica] font-semibold text-black text-sm tracking-[0] leading-[normal]">
                          Email
                        </Label>

                        <Input
                          defaultValue="mail@abc.com"
                          className="flex w-[20px] items-center gap-[13px] px-2.5 py-[13px] relative flex-[0_0_auto] rounded-[5px] border border-solid border-black [font-family:'Nunito_Sans',Helvetica] font-normal text-black text-sm tracking-[0] leading-[normal]"
                        />
                      </div>

                      <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
                        <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                          <Label className="relative w-fit mt-[-1.00px] [font-family:'Nunito_Sans',Helvetica] font-semibold text-black text-sm tracking-[0] leading-[normal]">
                            Password
                          </Label>

                          <Input
                            type="password"
                            defaultValue="*****************"
                            className="flex w-[420px] items-center gap-[13px] pt-[18px] pb-[13px] px-2.5 relative flex-[0_0_auto] rounded-[5px] border border-solid border-black [font-family:'Nunito_Sans',Helvetica] font-normal text-black text-[10px] tracking-[0] leading-[normal]"
                          />
                        </div>

                        <div className="inline-flex items-start gap-[222px] relative flex-[0_0_auto]">
                          <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto]">
                            <div className="relative w-3 h-3 rounded-sm border-[none] bg-[linear-gradient(90deg,rgba(0,194,255,1)_0%,rgba(138,43,226,1)_100%)] before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-sm before:[background:linear-gradient(90deg,rgba(0,194,255,1)_0%,rgba(138,43,226,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
                              <div className="relative w-2.5 h-2.5 -top-px -left-px">
                                <img
                                  className="absolute w-2 h-2 top-px left-px"
                                  alt="Icons navigation"
                                  src="/icons---navigation-others-10-check.svg"
                                />
                              </div>
                            </div>

                            <Label className="relative w-fit mt-[-1.00px] [font-family:'Nunito_Sans',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal]">
                              Remember Me
                            </Label>
                          </div>

                          <Button
                            variant="link"
                            className="relative w-fit mt-[-1.00px] [font-family:'Nunito_Sans',Helvetica] font-semibold text-white text-xs tracking-[0] leading-[normal] p-0 h-auto"
                          >
                            Forgot Password?
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button className="flex w-[420px] items-center justify-center gap-[13px] pt-[13px] pb-3 px-2.5 relative flex-[0_0_auto] rounded-md bg-[linear-gradient(270deg,rgba(0,194,255,1)_0%,rgba(138,43,226,1)_100%)] h-auto hover:bg-[linear-gradient(270deg,rgba(0,194,255,0.9)_0%,rgba(138,43,226,0.9)_100%)]">
                      <span className="relative w-fit mt-[-1.00px] [font-family:'Nunito_Sans',Helvetica] font-extrabold text-white text-lg tracking-[0] leading-[normal]">
                        Login
                      </span>
                    </Button>
                  </form>
                </div>
              </div>

              <div className="inline-flex items-center justify-center gap-2.5 absolute top-[649px] left-[52px]">
                <span className="relative w-fit mt-[-1.00px] [font-family:'Nunito_Sans',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal]">
                  Not Registered Yet?
                </span>

                <Button
                  variant="link"
                  className="relative w-fit mt-[-1.00px] [font-family:'Nunito_Sans',Helvetica] font-semibold text-white text-lg tracking-[0] leading-[normal] p-0 h-auto"
                >
                  Create an account
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};