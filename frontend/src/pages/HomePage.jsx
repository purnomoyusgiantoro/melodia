import React from 'react';
import { Music, Coins, TrendingUp, Shield, Users, Zap } from 'lucide-react';

export default function HomePage({account, onConnect}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/30 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">   
              <Music className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Melodia
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-purple-400 transition">Home</a>
              <a href="#features" className="hover:text-purple-400 transition">Features</a>
              <a href="#explore" className="hover:text-purple-400 transition">Explore</a>
              <a href="#about" className="hover:text-purple-400 transition">About</a>
            </div>
            <button
              onClick={onConnect}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            >
              {account
                ? account.slice(0, 6) + "..." + account.slice(-4)
                : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
            <span className="text-purple-300">🎵 Decentralized Music Royalty Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Tokenize Your Music,
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Share The Success
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Platform Web3 yang memungkinkan musisi mentokenisasi karya mereka dan membagi royalti 
            secara transparan menggunakan teknologi blockchain Ethereum.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-lg hover:scale-105 transition shadow-lg shadow-purple-500/50">
              Start Creating
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full font-semibold text-lg hover:bg-white/20 transition border border-white/20">
              Explore Songs
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">1,234</div>
            <div className="text-gray-400">Songs Tokenized</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-pink-400 mb-2">$2.5M</div>
            <div className="text-gray-400">Total Royalties Paid</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">5,678</div>
            <div className="text-gray-400">Active Investors</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">892</div>
            <div className="text-gray-400">Artists</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-purple-400">Melodia?</span>
            </h2>
            <p className="text-xl text-gray-300">
              Revolutionary platform for the music industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Music className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Creator Hub</h3>
              <p className="text-gray-300">
                Publish your songs and create automatic royalty contracts in minutes. Full control over your music rights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-pink-500/50 transition hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Coins className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Invest & Own</h3>
              <p className="text-gray-300">
                Buy royalty tokens and own a piece of your favorite songs. Earn passive income from music streams.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-500/50 transition hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Portfolio Dashboard</h3>
              <p className="text-gray-300">
                Track all your music assets in one place. Real-time analytics and earnings visibility.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-green-500/50 transition hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Blockchain Security</h3>
              <p className="text-gray-300">
                All ownership records stored immutably on Ethereum. Transparent and tamper-proof transactions.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-yellow-500/50 transition hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Community Driven</h3>
              <p className="text-gray-300">
                Connect directly with fans and investors. Build a sustainable music career together.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-red-500/50 transition hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Payments</h3>
              <p className="text-gray-300">
                No middlemen, no delays. Smart contracts ensure automatic and fair royalty distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/30">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Revolutionize Music?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of artists and investors creating the future of music ownership.
          </p>
          <button className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-lg hover:scale-105 transition shadow-lg shadow-purple-500/50">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/30 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">Melodia</span>
          </div>
          <p className="text-gray-400 mb-4">
            Decentralized Music Royalty Platform on Ethereum
          </p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-purple-400 transition">Twitter</a>
            <a href="#" className="hover:text-purple-400 transition">Discord</a>
            <a href="#" className="hover:text-purple-400 transition">GitHub</a>
            <a href="#" className="hover:text-purple-400 transition">Docs</a>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            © 2024 Melodia. MIT License.
          </p>
        </div>
      </footer>
    </div>
  );
}