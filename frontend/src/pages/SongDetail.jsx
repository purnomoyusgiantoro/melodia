import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACTS } from "../config/contracts";

export default function SongDetail() {
  const { id } = useParams(); // tokenId dari URL

  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [song, setSong] = useState(null);
  const [royaltyContract, setRoyaltyContract] = useState(null);
  const [userBalance, setUserBalance] = useState("0");
  const [totalSupply, setTotalSupply] = useState("0");
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
    await prov.send("eth_requestAccounts", []);
    const sign = await prov.getSigner();
    const addr = await sign.getAddress();

    setProvider(prov);
    setSigner(sign);
    setAccount(addr);
  }

  /* =============================
     LOAD SONG (MusicIPNFT)
  ============================== */
  async function loadSong() {
    if (!provider || !id) return;

    const ipNFT = new ethers.Contract(
      CONTRACTS.musicIPNFT.address,
      CONTRACTS.musicIPNFT.abi,
      provider
    );

    const data = await ipNFT.getMusicIP(id);

    // metadata dari IPFS
    const metaRes = await fetch(
      data.metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/")
    );
    const meta = await metaRes.json();

    setSong({
      tokenId: id,
      title: data.title,
      artist: data.artist,
      description: meta.description,
      cover: meta.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
    });

    // hubungkan ke royalty contract
    const royalty = new ethers.Contract(
      data.royaltyContract,
      CONTRACTS.musicRoyalty.abi,
      provider
    );

    setRoyaltyContract(royalty);

    const supply = await royalty.totalSupply();
    setTotalSupply(ethers.formatEther(supply));

    if (account) {
      const bal = await royalty.balanceOf(account);
      setUserBalance(ethers.formatEther(bal));
    }
  }

  /* =============================
     BUY ROYALTY (TRANSFER)
  ============================== */
  async function buyRoyalty(to, amount) {
    if (!signer || !royaltyContract) return;

    try {
      setLoading(true);

      const royaltyWithSigner = royaltyContract.connect(signer);

      const tx = await royaltyWithSigner.transfer(
        to,
        ethers.parseEther(amount)
      );

      await tx.wait();
      alert("Royalty berhasil dibeli 🎉");

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
    if (provider) loadSong();
  }, [provider, account]);

  /* =============================
     UI
  ============================== */
  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading song from blockchain...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-10">
      <button
        onClick={connectWallet}
        className="mb-6 px-4 py-2 bg-purple-600 rounded"
      >
        {account
          ? `${account.slice(0, 6)}...${account.slice(-4)}`
          : "Connect Wallet"}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img src={song.cover} alt={song.title} className="rounded-xl" />

        <div>
          <h1 className="text-4xl font-bold">{song.title}</h1>
          <p className="text-gray-300 mb-4">{song.artist}</p>

          <p className="mb-6">{song.description}</p>

          <div className="mb-2">
            🎵 Total Royalty Supply: <b>{totalSupply}</b>
          </div>

          <div className="mb-6">
            💼 Your Balance: <b>{userBalance}</b>
          </div>

          <button
            onClick={() => buyRoyalty(account, "10")}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-lg"
          >
            {loading ? "Processing..." : "Buy 10 Royalty Tokens"}
          </button>
        </div>
      </div>
    </div>
  );
}
