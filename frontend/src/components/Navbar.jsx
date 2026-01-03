import { Link } from "react-router-dom";

export default function Navbar({ account, onConnect }) {
  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b">
      <h1 className="font-bold text-xl">🎵 Melodia</h1>

      <div className="flex gap-6 items-center">
        <Link to="/">Home</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/creator">Creator</Link>
        <Link to="/portfolio">Portfolio</Link>

        {!account ? (
          <button
            onClick={onConnect}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Connect Wallet
          </button>
        ) : (
          <span className="text-sm">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        )}
      </div>
    </nav>
  );
}
