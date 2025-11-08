// import { Twitter, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <div className="border-y border-neutral-100 w-full">
      <div className="max-w-6xl mx-auto border-x border-neutral-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-3xl bric uppercase text-neutral-400 mb-4">
              Wcut
            </h3>
            <p className="text-neutral-600 text-sm font-normal mb-4">
              Whether you’re a creator, student, or business, Wcut fits
              seamlessly into your daily workflow.
            </p>
            {/* <div className="flex gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-100 transition-colors"
                >
                  <Twitter size={18} className="text-neutral-600" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-100 transition-colors"
                >
                  <Github size={18} className="text-neutral-600" />
                </a>
                <a
                  href="mailto:hello@company.com"
                  className="w-10 h-10 border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-100 transition-colors"
                >
                  <Mail size={18} className="text-neutral-600" />
                </a>
              </div> */}
          </div>

          <div>
            <h4 className="text-lg bric uppercase text-neutral-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#why-us"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  Why Us
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#sponsors"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  Sponsors
                </a>
              </li>
            </ul>
          </div>

          {/* More tools */}
          <div>
            <h4 className="text-lg bric uppercase text-neutral-400 mb-4">
              More tools
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://codewiseai.onrender.com"
                  target="_blank"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  Codewise AI
                </a>
              </li>
              <li>
                <a
                  href="https://paperdoc.netlify.app"
                  target="_blank"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  Paperdoc
                </a>
              </li>
              <li>
                <a
                  href="https://corporateai.in"
                  target="_blank"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  Corporate AI
                </a>
              </li>
              <li>
                <a
                  href="http://opensourceui.in"
                  target="_blank"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  Opensource UI
                </a>
              </li>
              <li>
                <a
                  href="https://chatscribe.netlify.app"
                  target="_blank"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  Chatscribe
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg bric uppercase text-neutral-400 mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  // href="#privacy"
                  className="text-neutral-500 text-sm font-normal transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  // href="#terms"
                  className="text-neutral-500 text-sm font-normal transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              {/* <li>
                <a
                  href="#cookies"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#licenses"
                  className="text-neutral-500 text-sm hover:text-neutral-900 font-normal transition-colors"
                >
                  Licenses
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
