import { useTheme } from '../contexts/ThemeContext';
import Footer from './Footer';

export default function CookiePolicy() {
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
        <h1 className="text-4xl font-bold text-purple-400 mb-4">Cookie Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: 31 October 2025</p>

        <p className="mb-6 leading-relaxed">
          This Cookie Policy explains how ShareLah (“we”, “our”, or “us”) uses cookies and similar
          tracking technologies to recognize you when you visit our website or use our platform.
          It describes what these technologies are, why we use them, and your rights to control
          their use.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3 mt-10">
          1. What Are Cookies?
        </h2>
        <p className="mb-6 leading-relaxed">
          Cookies are small text files placed on your device when you visit a website. They help
          websites remember your preferences, improve navigation, and analyze how visitors interact
          with content. Some cookies are essential for the website to function properly.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">
          2. How We Use Cookies
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            <strong>Essential Cookies:</strong> Required for core platform features such as secure
            login, session management, and checkout processes.
          </li>
          <li>
            <strong>Performance Cookies:</strong> Help us analyze how users interact with ShareLah
            (e.g. Google Analytics, Firebase Analytics) so we can improve usability and reliability.
          </li>
          <li>
            <strong>Functional Cookies:</strong> Remember your preferences such as theme mode and
            saved filters to enhance your browsing experience.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Used to deliver relevant ads and measure
            effectiveness via trusted partners such as Google Ads, Meta Ads, and TikTok Ads.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">
          3. Third-Party Cookies
        </h2>
        <p className="mb-6 leading-relaxed">
          Some cookies are placed by third-party services that appear on our pages or integrate with
          our platform. These may include analytics, advertising, or social media partners. We do not
          control these cookies and recommend reviewing their respective privacy policies for more
          details.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">
          4. Managing or Disabling Cookies
        </h2>
        <p className="mb-6 leading-relaxed">
          You can manage or delete cookies through your browser settings. Most browsers allow you to
          block cookies or receive a notification before a cookie is stored. Please note that
          disabling cookies may limit certain features of the ShareLah platform, such as login or
          payment functions.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">
          5. Updates to This Policy
        </h2>
        <p className="mb-6 leading-relaxed">
          We may update this Cookie Policy periodically to reflect operational, technical, or legal
          changes. Updates will be reflected with a revised “Last Updated” date at the top of this
          page.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-3">6. Contact Us</h2>
        <p className="leading-relaxed">
          For questions about this Cookie Policy, please contact us at{' '}
          <a href="mailto:support@sharelah.sg" className="text-purple-400 underline">
            support@sharelah.sg
          </a>.
        </p>
      </main>
      <Footer />
    </div>
  );
}
