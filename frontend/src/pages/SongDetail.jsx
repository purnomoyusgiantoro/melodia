import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACTS } from "../config/contracts";

export default function SongDetail() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [song, setSong] = useState(null);
  const [pricePerShare, setPricePerShare] = useState("0");
  const [availableShares, setAvailableShares] = useState(0);
  const [buyAmount, setBuyAmount] = useState(1);
  const [loading, setLoading] = useState(false);

  /* =============================
     CONNECT WALLET
  ============================== */
  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask tidak ditemukan");
      return;
    }

    const prov = new ethers.BrowserProvider(window.ethereum);
    const sign = await prov.getSigner();
    const addr = await sign.getAddress();

    setProvider(prov);
    setSigner(sign);
    setAccount(addr);
  }

  /* =============================
     LOAD SONG FROM CONTRACT
     (contoh: tokenId = 1)
  ============================== */
  async function loadSong() {
    if (!provider) return;

    const royalty = new ethers.Contract(
      CONTRACTS.musicRoyalty.address,
      CONTRACTS.musicRoyalty.abi,
      provider
    );

    const tokenId = 1;

    // 🔽 SESUAIKAN DENGAN CONTRACT KAMU
    const price = await royalty.pricePerShare(tokenId);
    const available = await royalty.availableShares(tokenId);
    const metadataURI = await royalty.tokenURI(tokenId);

    setPricePerShare(ethers.formatEther(price));
    setAvailableShares(Number(available));

    // Ambil metadata dari IPFS
    const res = await fetch(metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/"));
    const meta = await res.json();

    setSong({
      tokenId,
      title: meta.name,
      artist: meta.artist,
      cover: meta.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
      description: meta.description,
    });
  }

  /* =============================
     BUY SHARES
  ============================== */
  async function buyShares() {
    if (!signer) {
      alert("Connect wallet dulu");
      return;
    }

    try {
      setLoading(true);

      const royalty = new ethers.Contract(
        CONTRACTS.musicRoyalty.address,
        CONTRACTS.musicRoyalty.abi,
        signer
      );

      const totalCost = ethers.parseEther(
        (Number(pricePerShare) * buyAmount).toString()
      );

      const tx = await royalty.buyShares(song.tokenId, buyAmount, {
        value: totalCost,
      });

      await tx.wait();
      alert("Berhasil membeli shares 🎉");
      loadSong();
    } catch (err) {
      console.error(err);
      alert("Transaksi gagal");
    } finally {
      setLoading(false);
    }
  }

  /* =============================
     INIT
  ============================== */
  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    loadSong();
  }, [provider]);

  /* =============================
     UI
  ============================== */
  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading song from blockchain...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <button
        onClick={connectWallet}
        className="mb-6 px-4 py-2 bg-purple-600 rounded"
      >
        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={song.cover} className="rounded-xl" />

        <div>
          <h1 className="text-4xl font-bold">{song.title}</h1>
          <p className="text-gray-400 mb-4">{song.artist}</p>

          <p className="mb-4">{song.description}</p>

          <div className="mb-2">
            💰 Price / Share: <b>{pricePerShare} ETH</b>
          </div>

          <div className="mb-4">
            📦 Available Shares: <b>{availableShares}</b>
          </div>

          <input
            type="number"
            min="1"
            max={availableShares}
            value={buyAmount}
            onChange={(e) => setBuyAmount(Number(e.target.value))}
            className="text-black px-2 py-1 rounded mb-4"
          />

          <button
            onClick={buyShares}
            disabled={loading}
            className="block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-lg"
          >
            {loading ? "Processing..." : "Buy Shares"}
          </button>
        </div>
      </div>
    </div>
  );
}
