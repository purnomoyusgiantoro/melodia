import React, { useEffect, useState } from "react";
import { CONTRACTS } from "../config/contracts";
import { ethers } from "ethers";

export default function Marketplace() {
  const [songs, setSongs] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Metamask tidak ditemukan");
      return;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };

  // load data dari smart contract
  const loadSongs = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );

    const data = await contract.getAllSongs();

    const parsed = data.map((s) => ({
      id: Number(s.id),
      title: s.title,
      artist: s.artist,
      price: ethers.formatEther(s.price),
      availableShares: Number(s.availableShares),
    }));

    setSongs(parsed);
    setLoading(false);
  };

  // beli shares
  const buyShares = async (songId, price) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const tx = await contract.buyShares(songId, 1, {
      value: ethers.parseEther(price),
    });

    await tx.wait();
    alert("Berhasil membeli shares!");
    loadSongs();
  };

  useEffect(() => {
    loadSongs();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Marketplace</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Wallet: {account}</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        songs.map((song) => (
          <div key={song.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
            <p>Price: {song.price} ETH</p>
            <p>Available: {song.availableShares}</p>

            <button onClick={() => buyShares(song.id, song.price)}>
              Buy Share
            </button>
          </div>
        ))
      )}
    </div>
  );
}
