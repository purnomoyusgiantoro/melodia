import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { 
  Music, Wallet, Upload, Plus, ShieldCheck, TrendingUp, ChevronRight,
  Disc3, ExternalLink, Globe, Settings, CheckCircle2, Loader2
} from 'lucide-react';
import { CONTRACTS } from './config/contracts'; // Import kontrak yang sudah kamu buat
// ================= Admin Dashboard =================
const AdminDashboard = ({ account, onSuccess }) => {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    totalShares: 1000,
    totalRoyaltyValue: '',
  });
  const [deployedAddress, setDeployedAddress] = useState(null);
  const [files, setFiles] = useState({ audio: null, cover: null });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, audio: e.target.files[0] });
    }
  };

  const publishSong = async (e) => {
    e.preventDefault();
    if (!account) return alert("Please connect your wallet first");
    if (!window.ethereum) return alert("Install MetaMask");

    try {
      setError(null);
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Auto-switch to Localhost if wrong network
      const network = await provider.getNetwork();
      if (network.chainId !== 31337n) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x7A69' }], // 31337 hex
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7A69',
                chainName: 'Localhost 8545',
                rpcUrls: ['http://127.0.0.1:8545'],
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
              }]
            });
          } else throw switchError;
        }
      }

      const signer = await provider.getSigner();

      // Step 1: Prepare Metadata (mock)
      setStep(1);
      setStatus("Preparing Metadata...");
      const metadataURI = `ipfs://QmSongMetadata${Math.random().toString(36).substring(7)}`;
      await new Promise(r => setTimeout(r, 1000));

      // Step 2: Deploy Royalty Contract
      setStep(2);
      setStatus("Deploying Royalty Token...");
      const royaltyFactory = new ethers.ContractFactory(
        CONTRACTS.musicRoyalty.abi,
        MUSIC_ROYALTY_BYTECODE,
        signer
      );

      const royaltyContract = await royaltyFactory.deploy(
        `${formData.title} Royalty`,
        formData.title.substring(0, 3).toUpperCase() + "R",
        CONTRACTS.kycRegistry.address,
        formData.title,
        formData.artist,
        ethers.parseEther(formData.totalRoyaltyValue.toString()),
        formData.totalShares
      );

      await royaltyContract.waitForDeployment();
      const royaltyAddress = await royaltyContract.getAddress();
      console.log("Royalty deployed to:", royaltyAddress);

      // Step 3: Mint Music IP NFT
      setStep(3);
      setStatus("Minting Music IP NFT...");
      const nftContract = new ethers.Contract(
        CONTRACTS.musicIPNFT.address,
        CONTRACTS.musicIPNFT.abi,
        signer
      );

      const tx = await nftContract.mintMusicIP(
        account,
        formData.title,
        formData.artist,
        metadataURI,
        royaltyAddress
      );
      const receipt = await tx.wait();

      // Success
      setStep(4);
      setStatus("Success! Song published.");
      setDeployedAddress({ contract: royaltyAddress, hash: receipt.hash });

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);
      if (err.code === 4001 || err.message?.includes("rejected")) {
        setError("Transaction cancelled by user.");
      } else {
        setError(err.reason || err.message || "Deployment failed");
      }
      setStatus("idle");
      setStep(0);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      <form onSubmit={publishSong} className="space-y-4">
        <input
          type="text"
          placeholder="Song Title"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Artist Name"
          value={formData.artist}
          onChange={e => setFormData({ ...formData, artist: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total Shares"
          value={formData.totalShares}
          onChange={e => setFormData({ ...formData, totalShares: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total Royalty Value"
          value={formData.totalRoyaltyValue}
          onChange={e => setFormData({ ...formData, totalRoyaltyValue: e.target.value })}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border p-4">
          {files.audio ? files.audio.name : "Upload MP3 & Cover"}
        </div>
        <button type="submit" disabled={status !== "idle"}>
          {status !== "idle" ? "Processing..." : "Deploy & Mint"}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {step === 4 && deployedAddress && (
        <div className="p-4 bg-green-200">
          <p>Contract: {deployedAddress.contract}</p>
          <p>Tx: {deployedAddress.hash}</p>
        </div>
      )}
    </div>
  );
};

// ================= User Dashboard =================
const UserDashboard = ({ account }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState({ totalBalance: "0", songsOwned: 0, acquisitions: [] });

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!account || !window.ethereum) return setLoading(false);

      const provider = new ethers.BrowserProvider(window.ethereum);

      try {
        const kyc = new ethers.Contract(CONTRACTS.kycRegistry.address, CONTRACTS.kycRegistry.abi, provider);
        const verified = await kyc.isVerified(account);
        setIsVerified(verified);

        const nft = new ethers.Contract(CONTRACTS.musicIPNFT.address, CONTRACTS.musicIPNFT.abi, provider);
        const counter = await nft.tokenCounter();
        const acquisitions = [];

        for (let i = 1; i <= Number(counter); i++) {
          const item = await nft.getMusicIP(i);
          const royalty = new ethers.Contract(item.royaltyContract, CONTRACTS.musicRoyalty.abi, provider);
          const balance = await royalty.balanceOf(account);
          if (balance > 0n) {
            acquisitions.push({
              title: item.title,
              artist: item.artist,
              balance: ethers.formatEther(balance),
              contract: item.royaltyContract
            });
          }
        }

        setPortfolio({
          totalBalance: acquisitions.reduce((a, c) => a + Number(c.balance), 0),
          songsOwned: acquisitions.length,
          acquisitions
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchPortfolio();
  }, [account]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">User Portfolio</h2>
      <p>KYC: {loading ? "Loading..." : isVerified ? "Verified" : "Not Verified"}</p>
      <p>Total Tokens: {portfolio.totalBalance}</p>
      <p>Songs Owned: {portfolio.songsOwned}</p>
      <div>
        {portfolio.acquisitions.map((a, i) => (
          <div key={i} className="border p-2 my-2 rounded">
            <p>{a.title} by {a.artist}</p>
            <p>Balance: {a.balance}</p>
            <p>Contract: {a.contract}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ================= Main App =================
export default function App() {
  const [account, setAccount] = useState("");
  const [view, setView] = useState("explore");

  const connectWallet = async () => {
    if (window.ethereum) {
      const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accs[0]);
    } else {
      alert("Install MetaMask!");
    }
  };

  return (
    <div className="p-6 text-gray-100">
      <nav className="flex gap-4 mb-6">
        <button onClick={() => setView('explore')}>Explore</button>
        <button onClick={() => setView('admin')}>Admin</button>
        <button onClick={() => setView('user')}>Portfolio</button>
        {!account ? <button onClick={connectWallet}>Connect Wallet</button> : <span>{account.substring(0,6)}...</span>}
      </nav>

      {view === 'admin' && <AdminDashboard account={account} />}
      {view === 'user' && <UserDashboard account={account} />}
      {view === 'explore' && <div>Explore Section (coming soon)</div>}
    </div>
  );
}
