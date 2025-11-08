import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage= ()=> {
  return (
    <div className="min-h-screen px-6 flex flex-col items-center justify-center text-[#0e0e0e]">
      <div className="flex items-center justify-center gap-4 mb-8 text-lg md:text-xl">
        <h1>404</h1>
        <h1>|</h1>
        <p>This page could not be found.</p>
      </div>
      <Link
        to="/"
        className="flex items-center justify-center gap-2 border-b-2 border-[#5a5b5a]"
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
        <p className="text-md font-medium">Go back to home</p>
      </Link>
    </div>
  );
}

export default  NotFoundPage