import { useState, useEffect } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import icon from "../../assets/link.png";
import { GoHome } from "react-icons/go";
import { HiOutlineDocument } from "react-icons/hi";
import PropTypes from "prop-types";
const SideNavbar = ({ onSelectTool }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleToolSelect = (tool) => {
    onSelectTool(tool);
  };

  return (
    <div className="flex">
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "300px" }}
      >
        <div className="p-6 flex items-center justify-start mt-16">
          <img src={icon} alt="Logo" className="w-5 cursor-pointer" />
          <h1 className="ml-4 text-3xl font-normal">Cuturl</h1>
        </div>

        <nav className="p-4">
          <ul className="space-y-4 text-lg font-normal ml-2">
            <li>
              <button
                onClick={() => handleToolSelect("Home")}
                className="flex justify-center items-center gap-2 text-gray-800 hover:text-[#b366ff]"
              >
                <GoHome />
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleToolSelect("Documentation")}
                className="flex justify-center items-center gap-2 text-gray-800 hover:text-[#b366ff]"
              >
                <HiOutlineDocument />
                Documentation
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <button
        className="fixed cursor-pointer top-4 left-4 z-50 bg-[#b366ff] text-white p-1 rounded-full"
        onClick={handleToggle}
      >
        {isOpen ? (
          <IoClose className="w-6 h-6" />
        ) : (
          <IoMenu className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

SideNavbar.propTypes = {
  onSelectTool: PropTypes.func.isRequired,
};

export default SideNavbar;
