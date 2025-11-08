import { Twitter, Github, Mail } from "lucide-react";

const CopyRight = () => {
  return (
    <div className="border-t border-neutral-100 w-full">
      <div className="max-w-6xl mx-auto border-x border-neutral-100">
        <div className="p-4 border-neutral-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 text-sm font-normal">
              © 2025 Wcut. All rights reserved.
            </p>
            <div className="flex gap-4">
              <span className="px-3 py-1 bg-white text-neutral-800 text-xs font-semibold border border-neutral-100">
                Made with ❤️
              </span>
              <span className="px-3 py-1 bg-white text-neutral-800 text-xs font-semibold border border-neutral-100">
                Open Source
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyRight;
