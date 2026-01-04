import { ethers } from "ethers";
import { CONTRACTS } from "../config/contracts";
import { getSigner } from "./provider";

export async function loadContracts() {
  const signer = await getSigner();

  return {
    musicRoyalty: new ethers.Contract(
      CONTRACTS.musicRoyalty.address,
      CONTRACTS.musicRoyalty.abi,
      signer
    ),
    musicIPNFT: new ethers.Contract(
      CONTRACTS.musicIPNFT.address,
      CONTRACTS.musicIPNFT.abi,
      signer
    ),
    kycRegistry: new ethers.Contract(
      CONTRACTS.kycRegistry.address,
      CONTRACTS.kycRegistry.abi,
      signer
    ),
  };
}
