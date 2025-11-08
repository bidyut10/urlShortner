import { Twitter, Github, Mail, Linkedin } from "lucide-react";

const Contact = () => {
  return (
    <div className="border-y border-neutral-100 w-full">
      <div className="flex flex-col justify-between items-center max-w-6xl mx-auto border-x border-neutral-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 w-full gap-4">
          <a
            href="https://www.linkedin.com/in/bidyut-kundu-4ba406242/"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-neutral-100 p-8 bg-white  transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center mb-4 ">
                <Linkedin size={40} className="text-white" strokeWidth={0.8} />
              </div>
              <h3 className="text-2xl uppercase bric text-neutral-400 mb-2">
                Linkedin
              </h3>
              <p className="text-neutral-600 text-sm font-normal">
                Follow us for updates
              </p>
            </div>
          </a>
          <a
            href="https://x.com/BidyutKundu12"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-neutral-100 p-8 bg-white  transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center mb-4 ">
                <Twitter size={40} className="text-white" strokeWidth={0.8} />
              </div>
              <h3 className="text-2xl uppercase bric text-neutral-400 mb-2">
                Twitter
              </h3>
              <p className="text-neutral-600 text-sm font-normal">
                Follow us for updates
              </p>
            </div>
          </a>
          <a
            href="https://github.com/bidyut10"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-neutral-100 p-8 bg-white  transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mb-4 ">
                <Github size={40} className="text-white" strokeWidth={0.8} />
              </div>
              <h3 className="text-2xl uppercase bric text-neutral-400 mb-2">
                GitHub
              </h3>
              <p className="text-neutral-600 text-sm font-normal">
                Check out our repos
              </p>
            </div>
          </a>

          <a
            href="mailto:bidyut.kundu.dev@gmail.com"
            className="border border-neutral-100 p-8 bg-white  transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center mb-4 ">
                <Mail size={40} className="text-white" strokeWidth={0.8} />
              </div>
              <h3 className="text-2xl uppercase bric text-neutral-400 mb-2">
                Email
              </h3>
              <p className="text-neutral-600 text-sm font-normal">
                Drop us a message
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
