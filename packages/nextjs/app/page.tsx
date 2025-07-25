"use client";

import { useState } from "react";
import { BITE } from "@skalenetwork/bite";
import { ethers } from "ethers";
import type { NextPage } from "next";

// MyToken ABI - Feel free to expand it as necessary
const MyTokenABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  // Configuration
  const CONTRACT_ADDRESS = "0x437F581d7C3472a089AAd0D1b53cef5DC72C7d6E";
  const RECIPIENT_ADDRESS = "0xcE7E58D645655CB7B573Fa3B161F344e210Dd2c8";
  const AMOUNT = "1";
  const FAIR_RPC_URL = "https://testnet-v1.skalenodes.com/v1/idealistic-dual-miram";

  // Add your private key here (make sure to keep it secure!)
  const PRIVATE_KEY = ""; // Replace with your actual private key

  const handleMint = async () => {
    if (!PRIVATE_KEY || PRIVATE_KEY === "") {
      setStatus("Please add your private key to the PRIVATE_KEY variable");
      return;
    }

    setLoading(true);
    setStatus("Preparing mint transaction...");
    setTxHash("");

    try {
      // Create provider and wallet
      const provider = new ethers.JsonRpcProvider(FAIR_RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

      console.log("Minting with account:", wallet.address);
      setStatus(`Minting with account: ${wallet.address}`);

      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MyTokenABI, wallet);

      // Encode the function data
      const data = contract.interface.encodeFunctionData("mint", [RECIPIENT_ADDRESS, ethers.parseUnits(AMOUNT, 18)]);

      // Initialize BITE
      const bite = new BITE(FAIR_RPC_URL);

      // Create transaction object
      const transaction = {
        to: CONTRACT_ADDRESS,
        data: data,
      };

      setStatus("Encrypting transaction with BITE...");

      // Encrypt the transaction using BITE
      const encryptedTx = await bite.encryptTransaction(transaction);

      console.log("Encrypted transaction:", encryptedTx);

      setStatus("Sending encrypted transaction...");

      // Send the encrypted transaction
      const tx = await wallet.sendTransaction({
        ...encryptedTx,
        value: 0,
        gasLimit: 100000,
      });

      setStatus(`Transaction sent! Hash: ${tx.hash}`);
      setTxHash(tx.hash);

      console.log("Transaction hash:", tx.hash);

      // Wait for transaction to be mined
      setStatus("Waiting for transaction to be mined...");
      const receipt = await tx.wait();

      console.log("Transaction receipt:", receipt);
      setStatus(`✅ Mint successful! Transaction mined in block ${receipt?.blockNumber}`);
    } catch (error: any) {
      console.error("Mint failed:", error);
      setStatus(`❌ Mint failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5 w-full max-w-4xl">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold text-white">BITE Mint Token DApp</span>
            <span className="block text-lg mt-2 text-white">Scaffold-ETH Integration</span>
          </h1>

          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title text-white">Configuration</h2>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-white">Contract:</span>
                  <code className="bg-base-200 p-2 rounded text-white text-xs break-all">{CONTRACT_ADDRESS}</code>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-white">Recipient:</span>
                  <code className="bg-base-200 p-2 rounded text-white text-xs break-all">{RECIPIENT_ADDRESS}</code>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-white">Amount:</span>
                  <code className="bg-base-200 p-2 rounded text-white">{AMOUNT} tokens</code>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-white">Network:</span>
                  <span className="text-white font-medium">FAIR Testnet</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <button
                onClick={handleMint}
                disabled={loading}
                className={`btn btn-lg w-full ${loading ? "btn-disabled" : "btn-success hover:btn-success text-white"}`}
              >
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? "Minting..." : "Mint ERC-20 Token"}
              </button>
            </div>
          </div>

          {status && (
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h3 className="card-title text-white">Status</h3>
                <div className="alert alert-info">
                  <p className="text-sm break-all text-white">{status}</p>
                </div>
              </div>
            </div>
          )}

          {txHash && (
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h3 className="card-title text-white">Transaction Hash</h3>
                <div className="alert alert-success">
                  <a
                    href={`https://idealistic-dual-miram.explorer.testnet-v1.skalenodes.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary break-all text-sm text-white"
                  >
                    {txHash}
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="card bg-warning text-warning-content shadow-xl">
            <div className="card-body">
              <h3 className="card-title">⚠️ Security Notice</h3>
              <p className="text-sm">
                Remember to add your private key to the PRIVATE_KEY variable in the code before testing. Never commit
                your private key to version control!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
