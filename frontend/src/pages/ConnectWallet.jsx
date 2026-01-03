import { getSigner } from "../web3/provider";

export default function ConnectWallet({ onConnected }) {
  const connect = async () => {
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      onConnected(address);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <button
      onClick={connect}
      className="px-6 py-3 bg-black text-white rounded-xl"
    >
      Connect Wallet
    </button>
  );
}
