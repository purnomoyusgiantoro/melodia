import { ethers } from "ethers";

/**
 * Mantle Sepolia Testnet config
 * Chain ID: 5003 (0x138B)
 */
const MANTLE_SEPOLIA = {
  chainId: "5003",
  chainName: "Mantle Sepolia Testnet",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.sepolia.mantle.xyz"],
  blockExplorerUrls: ["https://sepolia.mantlescan.xyz"],
};

export async function getSigner() {
  if (!window.ethereum) {
    throw new Error("MetaMask tidak ditemukan");
  }

  // 1️⃣ Paksa switch ke Mantle Sepolia
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: MANTLE_SEPOLIA.chainId }],
    });
  } catch (error) {
    // 2️⃣ Jika chain belum ada → tambahkan
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [MANTLE_SEPOLIA],
      });
    } else {
      throw error;
    }
  }

  // 3️⃣ Buat provider & signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();

  // 4️⃣ Validasi network (anti salah chain)
  const network = await provider.getNetwork();
  if (network.chainId !== 5003n) {
    throw new Error("Bukan Mantle Sepolia. Network salah.");
  }

  return signer;
}
