import { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import MusicRoyaltyABI from "../abi/MusicRoyalty.json";

const KYC_REGISTRY_ADDRESS = "0xfeDaf49154eCc07b315B527C194950c8e6F0b3B3";

export default function CreatorHub() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tokenName: "",
    tokenSymbol: "",
    title: "",
    artist: "",
    totalRoyaltyValue: "",
    totalShares: "",
    legalDocument: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // MOCK IPFS (sementara)
  const uploadToIPFS = async (text) => {
    return "ipfs://LEGAL_DOC_HASH_EXAMPLE";
  };

  const handleDeploy = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
      alert("MetaMask tidak ditemukan");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload legal doc
      const legalDocURI = await uploadToIPFS(form.legalDocument);

      // 2️⃣ Connect wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 3️⃣ Factory
      const factory = new ethers.ContractFactory(
        MusicRoyaltyABI.abi,
        MusicRoyaltyABI.bytecode,
        signer
      );

      // 4️⃣ Deploy contract (INI YANG MEMUNCULKAN METAMASK)
      const contract = await factory.deploy(
        form.tokenName,
        form.tokenSymbol,
        KYC_REGISTRY_ADDRESS,
        form.title,
        form.artist,
        ethers.parseEther(form.totalRoyaltyValue),
        ethers.parseEther(form.totalShares)
      );

      await contract.waitForDeployment();

      // 5️⃣ Set legal document
      await contract.setLegalDocument(legalDocURI);

      alert(`🎉 Lagu berhasil dibuat!\nContract: ${contract.target}`);

      navigate("/portfolio");
    } catch (err) {
      console.error(err);
      alert("Gagal deploy contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🎵 Creator Hub
        </h1>

        <form onSubmit={handleDeploy} className="space-y-4">
          <input
            name="tokenName"
            placeholder="Token Name (ex: Melodia Royalty)"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            name="tokenSymbol"
            placeholder="Token Symbol (ex: MLD)"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            name="title"
            placeholder="Judul Lagu"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            name="artist"
            placeholder="Nama Artist"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            name="totalRoyaltyValue"
            placeholder="Total Royalty (ETH)"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            name="totalShares"
            placeholder="Total Shares (contoh: 1000)"
            className="input"
            onChange={handleChange}
            required
          />

          <textarea
            name="legalDocument"
            placeholder="Legal Document / IP Info"
            className="input h-28"
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold hover:opacity-90 transition"
          >
            {loading ? "Deploying..." : "🚀 Deploy Music Contract"}
          </button>
        </form>
      </div>
    </div>
  );
}
