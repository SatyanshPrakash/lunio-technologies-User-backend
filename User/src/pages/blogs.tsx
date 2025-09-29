import { Card, CardContent } from "../assets/blogCard";

const Blogs = () => {
  return (
     <div className="w-full max-w-[1332px] mx-auto flex gap-4 py-8">
    <Card className="w-full max-w-[441px] bg-[#f9f9f9] rounded-2xl shadow-[0px_0px_10px_#00000033]">
      <CardContent className="p-0">
        <div className="relative">
          <img
            className="w-full h-[360px] rounded-t-2xl object-cover"
            alt="Container"
            src="/container-2.png"
          />

          <div className="p-[25px] space-y-4">
            <div className="[font-family:'Roboto',Helvetica] font-medium text-[#999999] text-xs tracking-[0] leading-[18px]">
              11 March 2023
            </div>

            <h2 className="[font-family:'Raleway',Helvetica] font-bold text-[#333333] text-2xl tracking-[0] leading-[32.0px]">
              Next-Gen Power: The Future of Performance Starts Here
            </h2>

            <p className="[font-family:'Roboto',Helvetica] font-normal text-[#666666] text-base tracking-[0] leading-6">
              Engineered with cutting-edge architecture, our latest chip
              delivers lightning-fast processing, AI-optimized performance, and
              ultra-efficient power.
            </p>

            <a
              href="#"
              className="inline-block [font-family:'Roboto',Helvetica] font-bold text-[#00c2ff] text-lg tracking-[0] leading-[27px] underline"
            >
              Read More...
            </a>
          </div>
        </div>
      </CardContent>
    </Card>

    </div>
  )
}

export default Blogs