import MusicRoyaltyABI from "../abi/MusicRoyalty.json";
import MusicIPNFTABI from "../abi/MusicIPNFT.json";
import KYCRegistryABI from "../abi/KYCRegistry.json";

export const CONTRACTS = {
  musicRoyalty: {
    address: "0x371A8890d7DBb90Ad9024e289FfE1e670F285024",
    abi: MusicRoyaltyABI,
  },
  musicIPNFT: {
    address: "0x87d81aEAD1B6632Ed84a99426a260439aeE20368",
    abi: MusicIPNFTABI,
  },
  kycRegistry: {
    address: "0xfeDaf49154eCc07b315B527C194950c8e6F0b3B3",
    abi: KYCRegistryABI,
  },
};
