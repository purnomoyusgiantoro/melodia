import { BrowserProvider, Contract } from "ethers"
import MusicRoyaltyABI from "../contracts/MusicRoyalty.json"

export const ROYALTY_ADDRESS = "0x371A8890d7DBb90Ad9024e289FfE1e670F285024"

export async function getProvider() {
  if (!window.ethereum) throw new Error("MetaMask not found")
  return new BrowserProvider(window.ethereum)
}

export async function getSigner() {
  const provider = await getProvider()
  await provider.send("eth_requestAccounts", [])
  return provider.getSigner()
}

export async function getRoyaltyContract() {
  const signer = await getSigner()
  return new Contract(ROYALTY_ADDRESS, MusicRoyaltyABI, signer)
}
