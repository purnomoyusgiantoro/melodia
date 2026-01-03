import React, { useState } from "react";
import {
  Music,
  Upload,
  FileAudio,
  DollarSign,
  ArrowLeft,
  Check
} from "lucide-react";

export default function CreatorHub() {
  const [step, setStep] = useState(1);

  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    genre: "",
    audioFile: null,
    coverImage: null,
    totalShares: "",
    pricePerShare: "",
    royaltyPercentage: "",
    releaseDate: ""
  });

  /* =======================
     HANDLERS
  ======================== */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSongData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSongData((prev) => ({
      ...prev,
      [type]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Song data:", songData);

    // ⛓️ NANTINYA DI SINI:
    // - Upload audio & image ke IPFS
    // - Panggil smart contract (mint / deploy royalty)
    alert("Smart contract call placeholder");
  };

  /* =======================
     UI
  ======================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* NAVBAR */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold">Melodia</span>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">Wallet Connected</span>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* HEADER */}
        <button className="flex items-center gap-2 text-gray-300 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-2">Creator Hub</h1>
        <p className="text-gray-300 mb-10">
          Tokenize your music & deploy royalty smart contracts
        </p>

        {/* STEPS */}
        <div className="flex justify-center items-center gap-4 mb-12">
          {[1, 2, 3].map((n) => (
            <React.Fragment key={n}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  step >= n
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-white/10"
                }`}
              >
                {step > n ? <Check /> : n}
              </div>
              {n < 3 && (
                <div
                  className={`w-24 h-1 ${
                    step > n
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-white/10"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileAudio className="text-purple-400" />
                Song Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  name="title"
                  placeholder="Song Title"
                  value={songData.title}
                  onChange={handleInputChange}
                  required
                  className="input"
                />

                <input
                  name="artist"
                  placeholder="Artist Name"
                  value={songData.artist}
                  onChange={handleInputChange}
                  required
                  className="input"
                />

                <select
                  name="genre"
                  value={songData.genre}
                  onChange={handleInputChange}
                  required
                  className="input"
                >
                  <option value="">Select Genre</option>
                  <option>Pop</option>
                  <option>Rock</option>
                  <option>Hip Hop</option>
                  <option>Electronic</option>
                  <option>Jazz</option>
                </select>

                <input
                  type="date"
                  name="releaseDate"
                  value={songData.releaseDate}
                  onChange={handleInputChange}
                  required
                  className="input"
                />
              </div>

              {/* AUDIO */}
              <label className="upload-box">
                <Upload />
                <span>
                  {songData.audioFile
                    ? songData.audioFile.name
                    : "Upload Audio File"}
                </span>
                <input
                  type="file"
                  accept="audio/*"
                  hidden
                  onChange={(e) => handleFileChange(e, "audioFile")}
                />
              </label>

              {/* COVER */}
              <label className="upload-box">
                <Upload />
                <span>
                  {songData.coverImage
                    ? songData.coverImage.name
                    : "Upload Cover Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFileChange(e, "coverImage")}
                />
              </label>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign className="text-purple-400" />
                Tokenomics
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="number"
                  name="totalShares"
                  placeholder="Total Shares"
                  value={songData.totalShares}
                  onChange={handleInputChange}
                  required
                  className="input"
                />

                <input
                  type="number"
                  name="pricePerShare"
                  placeholder="Price per Share (ETH)"
                  value={songData.pricePerShare}
                  onChange={handleInputChange}
                  required
                  className="input"
                />

                <input
                  type="number"
                  name="royaltyPercentage"
                  placeholder="Royalty %"
                  value={songData.royaltyPercentage}
                  onChange={handleInputChange}
                  required
                  className="input md:col-span-2"
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Review & Deploy</h2>
              <pre className="bg-black/30 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(songData, null, 2)}
              </pre>
            </div>
          )}

          {/* NAV */}
          <div className="flex justify-between mt-10">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-white/10 rounded-lg"
              >
                Previous
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold"
              >
                Deploy Smart Contract
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
