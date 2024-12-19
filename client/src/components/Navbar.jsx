import { FiGithub } from "react-icons/fi";

const Navbar = () => {
  const githubPage=()=>{
    window.open("https://github.com/bidyut10/urlShortner", "_blank");
  }
  return (
    <div
      className="flex justify-end items-center max-w-3xl mx-auto mt-4 px-5 md:px-0"
      onClick={githubPage}
    >
      <h1 className="flex justify-center gap-2 font-normal border-b-2 border-gray-800 items-center text-lg cursor-pointer transition-colors hover:border-purple-900 hover:text-purple-900  duration-1000 hover:ease-in-out">
        Star us on <FiGithub size={16} />
      </h1>
    </div>
  );
};

export default Navbar;
