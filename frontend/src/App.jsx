import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { getSigner } from "./web3/provider";

import HomePage from "./pages/HomePage";
import Marketplace from "./pages/Marketplace";
import CreatorHub from "./pages/CreatorHub";
import Portfolio from "./pages/Portfolio";
import SongDetail from "./pages/SongDetail";

export default function App() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();

      setSigner(signer);
      setAccount(address);

      console.log("Connected:", address);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              account={account}
              onConnect={connectWallet}
            />
          }
        />

        <Route
          path="/marketplace"
          element={<Marketplace signer={signer} account={account} />}
        />

        <Route
          path="/creator"
          element={<CreatorHub signer={signer} />}
        />

        <Route
          path="/portfolio"
          element={<Portfolio signer={signer} account={account} />}
        />

        <Route path="/song/:id" element={<SongDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
