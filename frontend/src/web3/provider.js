import { ethers } from "ethers";

export async function getSigner() {
  if (!window.ethereum) {
    throw new Error("MetaMask tidak ditemukan");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return await provider.getSigner();
}
