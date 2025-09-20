import { useAuth } from '../contexts/AuthContext';
import LiquidGlassNav from './LiquidGlassNav';
import LiquidEther from './LiquidEther';

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 z-0">
        <LiquidEther />
      </div>

      {/* Navigation */}
      <LiquidGlassNav />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Welcome Message */}
          <div className="mb-12 animate-fadeInUp">
            <h1 className="text-hero font-sf-pro-display mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Welcome to ShareLah!
            </h1>
            <p className="text-xl text-white/80 font-sf-pro-text max-w-2xl mx-auto leading-relaxed">
              {currentUser?.displayName ? (
                <>
                  Hello, <span className="text-blue-400 font-semibold">{currentUser.displayName.split(' ')[0]}</span>!
                  Ready to start sharing and renting tools in your community?
                </>
              ) : (
                'Ready to start sharing and renting tools in your community?'
              )}
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glass-effect rounded-2xl p-8 hover:bg-white/15 transition-apple">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-sf-pro-display mb-4">List Your Tools</h3>
              <p className="text-white/70 font-sf-pro-text">
                Share your unused tools with neighbors and earn money while helping others.
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-8 hover:bg-white/15 transition-apple">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-sf-pro-display mb-4">Find Tools</h3>
              <p className="text-white/70 font-sf-pro-text">
                Browse available tools in your area and rent exactly what you need.
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-8 hover:bg-white/15 transition-apple">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-sf-pro-display mb-4">Build Community</h3>
              <p className="text-white/70 font-sf-pro-text">
                Connect with neighbors and build a stronger, more sustainable community.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold font-sf-pro-text transition-apple shadow-lg hover:shadow-xl">
              Browse Tools
            </button>
            <button className="px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-2xl font-semibold font-sf-pro-text transition-apple">
              List a Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}