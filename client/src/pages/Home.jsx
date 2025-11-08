import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Announcement from "../components/Title";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Features from "../components/Features";
import Sponsor from "../components/Sponsor";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import CopyRight from "../components/CopyRight";

const Home = () => {
  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-white">
      <div className="flex flex-col gap-4 md:gap-6 justify-center items-center border border-neutral-100 bg-white">
        <Navbar />
        <Announcement id="home" text={"/ start now"} />
        <Hero />
        <Announcement id="why-us" text={"/ why Choose Wcut?"} />
        <Features />

        <Announcement id="sponsors" text={"/ our sponsors"} />
        <Sponsor />
        <Announcement id="faq" text={"/ frequently asked questions"} />
        <FAQ />
        <Announcement id="testimonials" text={"/ what people say about us"} />
        <Testimonials />
        <Announcement id="contact" text={"/ get in touch"} />
        <Footer />
        <Contact />
        <CopyRight />
      </div>
    </div>
  );
};

export default Home;
