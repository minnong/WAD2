import { useTheme } from '../contexts/ThemeContext';
import Footer from './Footer';

export default function PrivacyPolicy() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col justify-between ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-200'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800'
      }`}
    >
      <main className="max-w-4xl mx-auto px-6 py-16 flex-1">
        <h1 className="text-4xl font-bold text-purple-400 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: 31 October 2025</p>

        <p className="mb-6 leading-relaxed">
          ShareLah (“we”, “our”, or “us”) respects your privacy and is committed to protecting your
          personal data. This Privacy Policy explains how we collect, use, share, and protect your
          information when you use the ShareLah platform or interact with our digital channels.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3 mt-10">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Account information: name, email address, and contact details</li>
          <li>Transaction details: tool listings, rental history, deposit payments, and refunds</li>
          <li>Device & usage data: IP address, browser type, device ID, and platform interactions</li>
          <li>Communication data: messages, reviews, and issue reports sent via ShareLah</li>
        </ul>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">2. How We Collect Your Data</h2>
        <p className="mb-6 leading-relaxed">
          We collect your information when you register an account, make a booking, list an item,
          contact another user, submit feedback, or browse our website. Data may also be collected
          through cookies and analytics tools to improve our platform experience.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Facilitate transactions, deposits, and refunds between renters and owners</li>
          <li>Send rental updates, reminders, and payment confirmations</li>
          <li>Resolve disputes and ensure platform safety</li>
          <li>Analyze usage patterns to enhance system performance</li>
          <li>Send marketing updates or promotions (only if you opt in)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">4. Sharing Your Data</h2>
        <p className="mb-6 leading-relaxed">
          We do not sell your personal data. We only share it with trusted service providers such as
          Firebase (for authentication and storage), Stripe and PayPal (for payment processing), and
          email or analytics partners strictly for operational purposes.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">5. Cookies and Analytics</h2>
        <p className="mb-6 leading-relaxed">
          ShareLah uses cookies and similar technologies to personalize your experience, remember
          your preferences, and analyze site performance. You can manage cookie settings via your
          browser at any time.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">6. Data Security & Retention</h2>
        <p className="mb-6 leading-relaxed">
          We use encrypted connections and secure databases hosted on Firebase to protect your
          personal data. Your information is retained only as long as necessary for legal, accounting,
          or operational purposes.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">7. Your Rights</h2>
        <p className="mb-6 leading-relaxed">
          You may access, correct, or delete your data, and withdraw consent for marketing at any
          time by contacting{' '}
          <a href="mailto:support@sharelah.sg" className="text-purple-400 underline">
            support@sharelah.sg
          </a>.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">8. Updates to This Policy</h2>
        <p className="mb-6 leading-relaxed">
          We may update this Privacy Policy from time to time to reflect operational, legal, or
          regulatory changes. Updates will be posted on this page with a revised “Last Updated” date.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">9. Contact Us</h2>
        <p className="leading-relaxed">
          For any questions about this policy or your data, please reach out to us at{' '}
          <a href="mailto:support@sharelah.sg" className="text-purple-400 underline">
            support@sharelah.sg
          </a>.
        </p>
      </main>
      <Footer />
    </div>
  );
}
