import { useState } from "react";
import { MessageCircle, Quote, Sparkles } from "lucide-react";

const creators = [
  [
    {
      name: "Marina Mogilko",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bg: "from-cyan-500 to-teal-400",
      type: "profile",
      review:
        "Wcut made sharing links so much easier! I can shorten any URL in seconds and it looks so clean everywhere I post.",
    },
    {
      logo: "CORNERSTONE",
      bg: "from-white to-white",
      type: "logo",
      logoStyle: "bric text-4xl tracking-tight",
    },
    {
      name: "Jörg Storm",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      bg: "from-yellow-400 to-yellow-300",
      quote:
        "Wcut saves me so much time. I use it daily to share short, professional links that look great on any platform.",
      subtext:
        "Founder of AI Newsletter Weekly Storm, Top 50 Creator Worldwide",
      type: "quote",
    },
  ],
  [
    {
      logo: "MILK ROAD",
      bg: "from-white to-white",
      type: "logo",
      logoStyle: "bric text-4xl tracking-tight",
    },
    {
      name: "Chris Evans",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bg: "from-green-400 to-emerald-400",
      type: "profile",
      review:
        "Wcut keeps my social media links short and neat. It’s fast, reliable, and super easy to use!",
    },
    {
      logo: "ESPN",
      bg: "from-white to-white",
      type: "logo",
      logoStyle: "bric text-4xl tracking-wider",
    },
    {
      name: "Bonnie Dilber",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bg: "from-orange-400 to-amber-400",
      type: "profile",
      review:
        "I love how quick and clean Wcut is! It’s my go-to tool for sharing links across all my platforms.",
    },
  ],
  [
    {
      name: "Paula Echeverria",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
      bg: "from-purple-400 to-fuchsia-400",
      quote:
        "Wcut is perfect for managing short links. The interface is simple, links load fast, and I can track performance easily.",
      subtext: "Manager at YouTube Channel Slidebean",
      type: "quote",
    },
    {
      name: "Sarah Johnson",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bg: "from-sky-400 to-blue-400",
      type: "profile",
      review:
        "Wcut helps me keep my shared links professional and clutter-free. It’s fast, easy, and looks great!",
    },
    {
      logo: "CORPORATE AI",
      bg: "from-white to-white",
      type: "logo",
      logoStyle: "text-4xl bric",
    },
  ],
];

function CreatorCard({ creator }) {
  const [showReview, setShowReview] = useState(false);
  return (
    <div
      className={`relative overflow-hidden border border-neutral-100 bg-linear-to-br ${creator.bg} flex flex-col justify-center items-center text-center h-[280px] md:h-80`}
    >
      {creator.type === "quote" && (
        <>
          <div className="text-left p-6 md:p-8 h-full flex flex-col">
            <Quote
              className="w-9 h-9 md:w-11 md:h-11 text-yellow-400"
              strokeWidth={1.2}
            />
            <p className="mt-3 md:mt-4 text-neutral-900 font-normal text-sm md:text-base leading-relaxed">
              {creator.quote}
            </p>
            {creator.subtext && (
              <div className="mt-auto pt-4 md:pt-5">
                <p className="text-sm md:text-base text-neutral-900 font-semibold">
                  {creator.name}
                </p>
                <p className="text-xs md:text-sm text-neutral-800/80 mt-1">
                  {creator.subtext}
                </p>
              </div>
            )}
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
              <Sparkles
                className="w-4 h-4 text-neutral-200"
                strokeWidth={1.2}
              />
            </div>
          </div>
        </>
      )}

      {creator.type === "profile" && (
        <>
          <div className="absolute inset-0">
            <img
              src={creator.image}
              alt={creator.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                showReview ? "blur-md brightness-50 scale-110" : ""
              }`}
            />
            <div
              className={`absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent transition-all duration-500`}
            ></div>
          </div>

          {showReview && creator.review && (
            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8 z-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="text-center max-w-xs">
                <Quote
                  className="w-8 h-8 md:w-10 md:h-10 text-white/80 mx-auto mb-4"
                  strokeWidth={1}
                />
                <p className="text-white text-sm md:text-base leading-relaxed font-normal drop-shadow-lg">
                  {creator.review}
                </p>
              </div>
            </div>
          )}

          <div
            className={`relative z-10 mt-auto w-full p-6 md:p-8 text-left transition-opacity duration-300 ${
              showReview ? "opacity-0" : "opacity-100"
            }`}
          >
            <p className="font-semibold text-white text-lg md:text-xl drop-shadow-md">
              {creator.name}
            </p>
          </div>
          <button
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-9 h-9 md:w-8 md:h-8 rounded-full bg-white text-neutral-900 flex justify-center items-center hover:bg-neutral-50 transition-all duration-300 hover:scale-110 z-20 cursor-pointer"
            onMouseEnter={() => setShowReview(true)}
            onMouseLeave={() => setShowReview(false)}
          >
            <MessageCircle size={16} strokeWidth={2} />
          </button>
        </>
      )}

      {creator.type === "logo" && (
        <div className="flex justify-center items-center h-full p-6 md:p-8">
          <div
            className={
              creator.logoStyle ||
              "text-2xl md:text-3xl font-bold text-neutral-900"
            }
          >
            {creator.logo}
          </div>
        </div>
      )}
    </div>
  );
}
const Testimonials = () => {
  return (
    <div className="border-y border-neutral-100 w-full">
      <div className="flex justify-between items-center max-w-6xl mx-auto border-x border-neutral-100 px-4">
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {creators[0].map((creator, index) => (
              <CreatorCard key={`row1-${index}`} creator={creator} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {creators[1].map((creator, index) => (
              <CreatorCard key={`row2-${index}`} creator={creator} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {creators[2].map((creator, index) => (
              <CreatorCard key={`row3-${index}`} creator={creator} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
