import MusicRoyaltyArtifact from "../artifacts/contracts/MusicRoyalty.sol/MusicRoyalty.json";
import MusicIPNFTArtifact from "../artifacts/contracts/MusicIPNFT.sol/MusicIPNFT.json";
import KYCRegistryArtifact from "../artifacts/contracts/KYCRegistry.sol/KYCRegistry.json";

const MusicRoyaltyABI = MusicRoyaltyArtifact.abi;
const MusicIPNFTABI = MusicIPNFTArtifact.abi;
const KYCRegistryABI = KYCRegistryArtifact.abi;

export const CONTRACTS = {
  musicRoyalty: {
    address: "0xC9353F7dfc74B532C8073070FbdA5487fB9c90CD",
    abi: MusicRoyaltyABI,
  },
  musicIPNFT: {
    address: "0xd6d380B69201089BfDE262A7f65273C2C49288ab",
    abi: MusicIPNFTABI,
  },
  kycRegistry: {
    address: "0x68d4243A8bb967D0Fc355d76770ae2d03570d250",
    abi: KYCRegistryABI,
  },
};
