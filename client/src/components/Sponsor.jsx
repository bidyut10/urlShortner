import { Mail, TrendingUp } from "lucide-react";

const Sponsor = () => {
  return (
    <div className="border-y border-neutral-100 w-full">
      <div className="flex flex-col justify-between items-center max-w-6xl mx-auto border-x border-neutral-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-4">
          <div className="border-2 border-dashed border-neutral-100 p-12 flex flex-col items-center justify-center relative overflow-hidden group hover:border-neutral-100 transition-all">
            <div className="text-8xl font-black text-neutral-200 mb-4">?</div>
            <h3 className="text-2xl bric uppercase text-neutral-400 mb-3 text-center">
              Your Brand Here
            </h3>
            <p className="text-neutral-500 text-sm text-center mb-6 max-w-xs">
              Premium visibility to engaged users actively looking for QR
              solutions
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-white text-neutral-700 text-xs font-semibold border border-neutral-100">
                📊 10K+ views/mo
              </span>
              <span className="px-3 py-1 bg-white text-neutral-700 text-xs font-semibold border border-neutral-100">
                🎯 Targeted
              </span>
            </div>
          </div>
          <div className="border-2 border-dashed border-neutral-100 p-12 flex flex-col items-center justify-center relative overflow-hidden group hover:border-neutral-100 transition-all">
            <div className="text-8xl font-black text-neutral-200 mb-4">?</div>
            <h3 className="text-2xl bric uppercase text-neutral-400 mb-3 text-center">
              Your Brand Here
            </h3>
            <p className="text-neutral-500 text-sm text-center mb-6 max-w-xs">
              Premium visibility to engaged users actively looking for QR
              solutions
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-white text-neutral-700 text-xs font-semibold border border-neutral-100">
                📊 10K+ views/mo
              </span>
              <span className="px-3 py-1 bg-white text-neutral-700 text-xs font-semibold border border-neutral-100">
                🎯 Targeted
              </span>
            </div>
          </div>
          <div className="border-2 border-dashed border-neutral-100 p-12 flex flex-col items-center justify-center relative overflow-hidden group hover:border-neutral-100 transition-all">
            <div className="text-8xl font-black text-neutral-200 mb-4">?</div>
            <h3 className="text-2xl bric uppercase text-neutral-400 mb-3 text-center">
              Your Brand Here
            </h3>
            <p className="text-neutral-500 text-sm text-center mb-6 max-w-xs">
              Connect with a growing community of businesses and creators
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-white text-neutral-700 text-xs font-semibold border border-neutral-100">
                💼 B2B Focus
              </span>
              <span className="px-3 py-1 bg-white text-neutral-700 text-xs font-semibold border border-neutral-100">
                🚀 Growing
              </span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="border border-neutral-100 bg-white p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-3xl bric uppercase text-neutral-400 mb-3">
                  Become a Sponsor
                </h3>
                <p className="text-neutral-600 text-sm mb-4">
                  Join leading brands who trust our platform. Get your message
                  in front of thousands of potential customers every month.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 border border-emerald-50 px-4 py-2">
                    <TrendingUp size={18} className="text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">
                      High Engagement
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border border-blue-50 px-4 py-2">
                    <Mail size={18} className="text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">
                      Flexible Terms
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button className="cursor-pointer px-6 py-3 bg-yellow-300 text-black font-medium border border-yellow-300 hover:bg-yellow-400 transition-colors flex justify-center items-center gap-2">
                  <a
                    href="mailto:bidyut.kundu.dev@gmail.com"
                    className="flex items-center text-sm gap-2"
                  >
                    {/* <Mail size={20} /> */}
                    Get in Touch
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsor;
