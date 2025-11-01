import { useTheme } from '../contexts/ThemeContext';
import Footer from './Footer';

export default function TermsOfService() {
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
        <h1 className="text-4xl font-bold text-purple-400 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: 31 October 2025</p>

        <p className="mb-6 leading-relaxed">
          Welcome to ShareLah! By accessing or using our platform, you agree to the following Terms
          of Service. Please read them carefully before proceeding.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3 mt-10">1. Overview</h2>
        <p className="mb-6 leading-relaxed">
          ShareLah is a peer-to-peer rental marketplace that enables users to list, rent, and share
          items securely. These Terms govern your use of our website, mobile application, and
          related services (“Service”).
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">2. Eligibility</h2>
        <p className="mb-6 leading-relaxed">
          You must be at least 18 years old to use ShareLah. By creating an account, you confirm
          that all information provided is accurate and that you are responsible for maintaining
          your account’s confidentiality.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">3. Rental Responsibilities</h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Owners must ensure listed items are accurately described and in working condition.</li>
          <li>Renters are responsible for returning items in the same condition received.</li>
          <li>Any damages, loss, or misuse may result in forfeiture of the security deposit.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">4. Payments & Deposits</h2>
        <p className="mb-6 leading-relaxed">
          All transactions are processed securely via Stripe or PayPal. Deposits are held by
          ShareLah until the rental period ends. Deposits may be forfeited if the item is damaged or
          if a dispute arises within the 24-hour inspection window.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">5. Cancellations & Refunds</h2>
        <p className="mb-6 leading-relaxed">
          Cancellation policies vary by listing. Refunds for deposits or payments are processed
          according to our dispute and refund procedures within the app.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">6. Prohibited Activities</h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Listing illegal or restricted items</li>
          <li>Misrepresenting ownership or product condition</li>
          <li>Using the platform for fraud, spam, or harassment</li>
        </ul>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">7. Liability</h2>
        <p className="mb-6 leading-relaxed">
          ShareLah serves as an intermediary and is not responsible for damages, loss, or misuse of
          items. Our liability is limited to the maximum extent permitted by Singapore law.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">8. Termination</h2>
        <p className="mb-6 leading-relaxed">
          We reserve the right to suspend or terminate any account that violates our terms or
          misuses the platform. Any outstanding payments or disputes will continue to be processed.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">9. Governing Law</h2>
        <p className="mb-6 leading-relaxed">
          These Terms shall be governed by and construed in accordance with the laws of the Republic
          of Singapore.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">10. Contact Us</h2>
        <p className="leading-relaxed">
          For inquiries about these Terms, please contact us at{' '}
          <a href="mailto:support@sharelah.sg" className="text-purple-400 underline">
            support@sharelah.sg
          </a>.
        </p>
      </main>
      <Footer />
    </div>
  );
}
