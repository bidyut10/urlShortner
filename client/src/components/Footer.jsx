import { FiGithub } from "react-icons/fi";
import link from "../../assets/link.png";
const Footer = () => {
  return (
    <div className="flex justify-between items-center max-w-3xl mx-auto mb-8 px-5 md:px-0">
      <img src={link} alt="link" className="size-5" />
      <h1 className="text-xl font-normal">All rights reserved</h1>
      <FiGithub className="size-6" />
    </div>
  );
};

export default Footer;
