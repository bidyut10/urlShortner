import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I generate a QR code?",
      answer:
        "Simply enter your URL or text in the input field and click generate. Your QR code will be created instantly and ready to download.",
    },
    {
      question: "Are the QR codes permanent?",
      answer:
        "Yes! Once generated, the QR codes are permanent and will work forever. There's no expiration date or usage limit.",
    },
    {
      question: "What formats can I download?",
      answer:
        "You can download your QR codes in PNG, JPG, and JPEG formats. Multiple size options are available for each format.",
    },
    {
      question: "Is there a limit on QR code generation?",
      answer:
        "No limits whatsoever! Generate as many QR codes as you need, completely free. No registration or subscription required.",
    },
    {
      question: "Can I customize the QR code design?",
      answer:
        "Currently we offer standard QR codes optimized for maximum compatibility and scanning reliability across all devices.",
    },
  ];

  return (
    <div className="border-y border-neutral-100 w-full">
      <div className="flex flex-col justify-between items-center max-w-6xl mx-auto border-x border-neutral-100 p-4">
        <div className="w-full space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-neutral-100 bg-white overflow-hidden transition-all duration-300 ease-in-out"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-lg font-medium text-neutral-800 pr-4">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 w-8 h-8 bg-neutral-100 flex items-center justify-center">
                    {isOpen ? (
                      <Minus size={20} className="text-neutral-600" />
                    ) : (
                      <Plus size={20} className="text-neutral-600" />
                    )}
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 pt-0">
                    <div className="border-t border-neutral-100 pt-4">
                      <p className="text-neutral-600 text-sm font-normal leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
