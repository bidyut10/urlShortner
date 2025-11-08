import {
  Zap,
  QrCode,
  Sparkles,
  ArrowDownToLine,
  VectorSquare,
} from "lucide-react";

const Features = () => {
  return (
    <div className="border-y border-neutral-100 w-full">
      <div className="flex flex-col justify-between items-center max-w-6xl mx-auto border-x border-neutral-100 gap-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4 py-4">
          <div className="border border-neutral-100 w-full bg-white">
            <div className="p-8 flex flex-col items-start text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500  flex items-center justify-center mb-4 transition-transform">
                <Zap size={40} className="text-white" strokeWidth={0.8} />
              </div>
              <h3 className="text-5xl uppercase bric text-neutral-400 mb-3">
                No Login
              </h3>
              <p className="text-neutral-600 text-sm font-normal mb-4">
                Start instantly
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/90 text-neutral-800 text-xs font-semibold backdrop-blur-sm border border-neutral-100">
                  🔒 SSL
                </span>
                <span className="px-3 py-1 bg-white/90 text-neutral-800 text-xs font-semibold backdrop-blur-sm border border-neutral-100">
                  ⚡ 0.2s
                </span>
                <span className="px-3 py-1 bg-white/90 text-neutral-800 text-xs font-semibold backdrop-blur-sm border border-neutral-100">
                  99.9%
                </span>
              </div>
            </div>
          </div>

          <div className="border border-neutral-100 p-8 transition-all relative overflow-hidden group ">
            <div className="absolute top-0 right-0 text-9xl font-black text-yellow-200 opacity-20 transform rotate-12 -mr-8 -mt-8">
              $0
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500  flex items-center justify-center mb-4 transition-transform">
                <Sparkles size={40} className="text-white" strokeWidth={0.8} />
              </div>
              <h3 className="text-5xl bric uppercase text-neutral-400 my-3">
                100% Free
              </h3>
              <p className="text-neutral-600 text-sm font-normal mb-4">
                Forever. No limits.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm text-neutral-600 font-normal">
                  Join thousands
                </span>
              </div>
            </div>
          </div>

          <div className="border border-neutral-100 p-8 transition-all relative overflow-hidden group bg-white">
            <div className="absolute top-0 left-0 w-32 h-32 border-8 border-purple-200 rounded-2xl rotate-12 -ml-12 -mt-12 opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-8 border-pink-200 rounded-2xl -rotate-12 -mr-8 -mb-8 opacity-20"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600  flex items-center justify-center mb-4 transition-transform">
                <QrCode size={32} className="text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-5xl bric uppercase text-neutral-400 my-3">
                QR Codes
              </h3>
              <p className="text-neutral-600 text-sm font-normal mb-4">
                Download instantly
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 border border-purple-50 p-3">
                  <ArrowDownToLine size={16} className="text-purple-600" />
                  <span className="text-xs font-semibold text-purple-700">
                    PNG • JPG • JPEG
                  </span>
                </div>
                <div className="flex items-center gap-2 border border-pink-50 p-3">
                  <VectorSquare size={16} className="text-pink-600" />
                  <span className="text-xs font-semibold text-pink-700">
                    Multiple sizes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
