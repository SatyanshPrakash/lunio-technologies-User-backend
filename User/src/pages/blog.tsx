import Container from "../assets/Container.png";
import { Footer } from "../components/footer";
import { Card, CardContent } from "../assets/blogCard";

const Blog = () => {
    return (
        <>
            <div className="w-full py-8">
                <h1 className="text-5xl font-extrabold mx-auto py-8 w-full max-w-[1032px]">
                    How to make a Game look more attractive with New VR &amp; AI
                    Technology
                </h1>
                <div className="w-full max-w-[1132px] mx-auto h-[608px]" >
                    <img
                        src={Container}
                        alt="Background"
                        className="w-full h-full object-cover rounded-2xl"
                    />
                </div>
            </div>


            <div className="w-full max-w-[1032px] mx-auto py-8">
                <p className="w-full max-w-[1024px] [font-family:'Roboto',Helvetica] text-xl font-normal text-[#666666] tracking-[0] leading-6">
                    Google has been investing in AI for many years and bringing its
                    benefits to individuals, businesses and communities. Whether
                    it&apos;s publishing state-of-the-art research, building helpful
                    products or developing tools and resources that enable others,
                    we&apos;re committed to making AI accessible to everyone. <br />{" "}
                    <br />
                    We&apos;re now at a pivotal moment in our AI journey. Breakthroughs
                    in generative AI are fundamentally changing how people interact with
                    technology — and at Google, we&apos;ve been responsibly developing
                    large language models so we can safely bring them to our products.
                    Today, we&apos;re excited to share our early progress. Developers
                    and businesses can now try new APIs and products that make it easy,
                    safe and scalable to start building with Google&apos;s best AI
                    models through Google Cloud and a new prototyping environment called
                    MakerSuite. And in Google Workspace, we&apos;re introducing new
                    features that help people harness the power of generative AI to
                    create, connect and collaborate.
                </p>
            </div>

            <section className="w-full max-w-[1032px] mx-auto relative">
                 <div className="w-[5px] h-[104px] bg-[#00c2ff]" />
                <blockquote className="ml-6 mt-3">
                    <p className="text-lg text-[#666666] italic">
                        &quot;People worry that computers will get too smart and take over the
                        world, but the real problem is that they&apos;re too stupid and
                        they&apos;ve already taken over the world.&quot;
                    </p>

                    <cite className="block mt-4 ml-1 font-paragraph-medium-16px font-[number:var(--paragraph-medium-16px-font-weight)] text-[#333333] text-[length:var(--paragraph-medium-16px-font-size)] tracking-[var(--paragraph-medium-16px-letter-spacing)] leading-[var(--paragraph-medium-16px-line-height)] [font-style:var(--paragraph-medium-16px-font-style)]">
                        – Pedro Domingos
                    </cite>
                </blockquote>
            </section>


            <section className="w-full max-w-[1032px] mx-auto py-8">
      <p className="text-[#666666] leading-6">
        More than 3 billion people already benefit from AI-powered features in
        Google Workspace, whether it&apos;s using Smart Compose in Gmail or
        auto-generated summaries in Google Docs. Now, we&apos;re excited to take
        the next step and bring a limited set of trusted testers a{" "}
        <a
          href="https://workspace.google.com/blog/product-announcements/generative-ai"
          rel="noopener noreferrer"
          target="_blank"
          className="text-[#666666] leading-6 underline hover:text-[#555555] transition-colors"
        >
          new set of features
        </a>{" "}
        that makes the process of writing even easier. In Gmail and Google Docs,
        you can simply type in a topic you&apos;d like to write about, and a
        draft will be instantly generated for you. So if you&apos;re a manager
        onboarding a new employee, Workspace saves you the time and effort
        involved in writing that first welcome email. From there, you can
        elaborate upon or abbreviate the message or adjust the tone to be more
        playful or professional — all in just a few clicks. We&apos;ll be
        rolling out these new experiences to testers in the coming weeks.
      </p>

      <div className="w-full py-8">
          <img
            className="w-full max-w-[816px] h-[312px] mx-auto"
            alt="Image"
            src={Container}
          />
        </div>

        <div className="w-full py-8">
          <p className="w-full max-w-[1024px] [font-family:'Roboto',Helvetica] font-normal text-[#333333] text-base tracking-[0] leading-6">
            We&apos;re so excited by the potential of generative AI, and the
            opportunities it will unlock — from helping people express
            themselves creatively, to helping developers build brand new types
            of applications, to transforming how businesses and governments
            engage their customers and constituents. Stay tuned for more to come
            in the weeks and months ahead.
          </p>
        </div>
    </section>


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

    <Footer />
        </>
    )
}

export default Blog