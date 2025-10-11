import { useState } from 'react';
import LiquidGlassNav from './LiquidGlassNav';
import Footer from './Footer';
import FAQChatbot from './FAQChatbot'; // Chatbot UI component

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is ShareLah?',
      answer:
        'ShareLah is a peer-to-peer equipment rental platform that allows users to lend or rent tools, gadgets, and gear safely and conveniently.',
    },
    {
      question: 'How do I list my item?',
      answer:
        'Simply go to the “List Item” page, fill in your item details, upload clear photos, and submit your listing for others to rent.',
    },
    {
      question: 'Is payment handled securely?',
      answer:
        'Yes! All payments are processed securely through our trusted payment partners. ShareLah does not store your payment information.',
    },
    {
      question: 'How do I contact another user?',
      answer:
        'Once you’re matched with a renter or lender, you can use the in-app chat feature to communicate directly and arrange details.',
    },
    {
      question: 'What if an item gets damaged?',
      answer:
        'We encourage users to take photos before and after rental. In case of disputes or damages, our support team will assist with resolution.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100">
      <LiquidGlassNav />

      <main className="flex-grow max-w-4xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Frequently Asked Questions
        </h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 focus:outline-none"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {faq.question}
                  </h3>
                  <span
                    className={`text-2xl transition-transform duration-300 ${
                      openIndex === index
                        ? 'rotate-45 text-purple-400'
                        : 'rotate-0 text-gray-400'
                    }`}
                  >
                    +
                  </span>
                </div>
              </button>

              <div
                className={`px-6 pb-6 text-gray-600 dark:text-gray-300 transition-all duration-500 ease-in-out overflow-hidden ${
                  openIndex === index
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Chatbot button / widget */}
      <FAQChatbot />

      <Footer />
    </div>
  );
}



