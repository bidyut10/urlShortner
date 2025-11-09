import { useEffect } from "react";
import axios from "axios";
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
  useEffect(() => {
    // Silent server warmup - runs in background without blocking UI
    const warmupServer = async () => {
      try {
        // Fire and forget - no await, runs completely in background
        axios
          .get("https://cuturl-oi0x.onrender.com/health", {
            timeout: 30000, // 30 second timeout for cold start
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          })
          .catch(() => {
            // The purpose is just to wake up the server
          });
      } catch (error) {
        // Silent catch - no error handling needed
      }
    };

    // Trigger warmup immediately when component mounts
    warmupServer();

    // Optional: Retry warmup after 2 seconds if user is still on page
    // This ensures server is definitely awake by the time they generate URL
    const retryTimeout = setTimeout(() => {
      axios
        .get("https://cuturl-oi0x.onrender.com/health", {
          timeout: 10000,
        })
        .catch(() => {});
    }, 2000);

    // Cleanup
    return () => {
      clearTimeout(retryTimeout);
    };
  }, []); // Empty dependency - runs once on mount

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
