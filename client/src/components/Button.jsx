import React from "react";

const Button = ({ children, onClick }) => {
  return (
    <button
      className="relative px-3 py-3 bg-white text-black font-medium border border-neutral-200 hover:bg-neutral-50 transition-colors group overflow-hidden"
      onClick={onClick}
    >
      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-black"></span>
      <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-black"></span>
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-black"></span>
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-black"></span>
      <span className="relative z-10 flex justify-center items-center gap-2 text-sm">
        {children}
      </span>
    </button>
  );
};

export default Button;
