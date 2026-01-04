
# **Project Documentation (Revised for GitHub)**

## **1. Project Structure**

```
├── contracts
│   ├── KYCRegistry.sol          # Verifikasi KYC (opsional untuk demo)
│   ├── MusicIPNFT.sol           # NFT untuk IP musik
│   └── MusicRoyalty.sol         # Kontrak utama tokenisasi & jual royalty
├── docs
│   ├── DEPLOYMENT.md            # Panduan deploy smart contract
│   ├── DOCUMENTATION.md         # Dokumentasi umum proyek
│   ├── ROADMAP.md               # Roadmap proyek
│   └── SMART_CONTRACTS.md       # Dokumentasi fungsi kontrak
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── src
│   │   ├── abi
│   │   │   ├── KYCRegistry.json
│   │   │   ├── MusicIPNFT.json
│   │   │   └── MusicRoyalty.json
│   │   ├── App.jsx
│   │   ├── components
│   │   │   └── Navbar.jsx
│   │   ├── config
│   │   │   └── contracts.js    # Alamat & ABI kontrak untuk frontend
│   │   ├── index.css
│   │   ├── lib
│   │   │   └── ethers.js        # Helper Web3 / ethers.js
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── ConnectWallet.jsx
│   │   │   ├── CreatorHub.jsx   # Deploy / mint MusicRoyalty untuk demo
│   │   │   ├── HomePage.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   └── SongDetail.jsx   # Detail lagu & beli token
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.js
│   │   └── web3
│   │       ├── contracts.js     # Kontrak helper untuk connect frontend
│   │       └── provider.js      # Provider / signer
│   └── vite.config.js
├── LICENSE
├── package.json
├── package-lock.json
└── README.md
```

---

## **2. Contracts Overview**

### **2.1 MusicRoyalty.sol**

* Fungsi utama: **Tokenisasi lagu & pembagian royalty**.

* Untuk demo, tambahan:

  1. `buyShares` → orang bisa beli token dari admin.
  2. `pricePerShare` & `setPricePerShare` → admin bisa ubah harga token.
  3. Event `SharesPurchased` → mencatat pembelian.
  4. Modifier `onlyVerifiedOrDemo` → bypass KYC sementara agar semua bisa beli untuk demo.

* Opsional untuk demo:

  * `_isVerified()` bisa selalu return `true`.
  * Freeze / maxHolding bisa diabaikan jika mengganggu demo.

---

### **2.2 MusicIPNFT.sol**

* NFT untuk Intellectual Property musik.
* Tidak perlu diubah untuk demo, hanya untuk mint IP NFT.

---

### **2.3 KYCRegistry.sol**

* Opsional untuk demo.
* Bisa dibuat return `true` selalu supaya semua account bisa beli token.

---

## **3. Frontend Pages**

| Page              | Fungsi                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| HomePage.jsx      | Tampilan awal, menampilkan statistik & link ke SongDetail / CreatorHub |
| CreatorHub.jsx    | Deploy / mint MusicRoyalty & simulasikan upload musik                  |
| SongDetail.jsx    | Menampilkan metadata lagu dari IPFS & beli token                       |
| ConnectWallet.jsx | Connect wallet (MetaMask)                                              |
| Marketplace.jsx   | Opsional, menampilkan semua lagu / NFT                                 |
| Portfolio.jsx     | Opsional, menampilkan saldo user / royalty                             |

---

## **4. Frontend Integrasi**

1. **Update ABI & Address**

   * File: `frontend/src/config/contracts.js`
   * Contoh:

```js
export const CONTRACTS = {
  musicRoyalty: {
    address: "0xYourDeployedContractAddress",
    abi: require("../abi/MusicRoyalty.json").abi,
  },
};
```
## **Tes dan Fix!! Pages fuction** `frontend/src/pages/..`

2. **Connect Wallet**

   * Gunakan `window.ethereum` untuk mendapatkan `provider`, `signer`, dan `account`.
   * Pastikan account tampil di UI.

3. **Load Musik**

   * Ambil metadata dari kontrak (`music`) & IPFS.
   * Tampilkan `title`, `artist`, `cover`, `description`.

4. **Buy Shares**

   * Pastikan fungsi `buyShares` dipanggil.
   * Saldo bertambah / berkurang sesuai jumlah pembelian.

5. **Admin Functions**

   * Freeze / unfreeze account.
   * Set legal document & price per share.
   * Force transfer token (jika perlu).

---

## **5. Cek Demo Checklist Dan Perbaiki**

1. Deploy `MusicRoyalty` lewat **Creator Hub**.
2. HomePage menampilkan data lagu (dummy atau real).
3. SongDetail bisa membaca metadata dari IPFS.
4. User bisa beli token (bypass KYC sementara).
5. Admin bisa ubah harga token, freeze akun, upload legal document.
6. Opsional: mint IP NFT untuk lagu baru.

---


