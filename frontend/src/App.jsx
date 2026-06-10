import { useState, useMemo, useEffect } from "react";
import { ethers } from "ethers";

import Layout from "./components/common/Layout";
import AppRoutes from "./app/routes";

import tokenAbi from "./contracts/MyToken.json";
import stakingAbi from "./contracts/Staking.json";
import ammAbi from "./contracts/AMM.json";

const TOKEN_ADDRESS = import.meta.env.VITE_MYTOKEN_ADDRESS;
const STAKING_ADDRESS = import.meta.env.VITE_STAKING_ADDRESS;
const AMM_ADDRESS = import.meta.env.VITE_AMM_ADDRESS;

function App() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  // ======================
  // provider
  // ======================
  const provider = useMemo(() => {
    if (!window.ethereum) return null;
    return new ethers.BrowserProvider(window.ethereum);
  }, []);

  // ======================
  // wallet connect
  // ======================
  async function handleConnect() {
    if (!provider) return;

    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  }

  // ======================
  // signer
  // ======================
  useEffect(() => {
    if (!provider || !account) return;

    provider.getSigner().then(setSigner);
  }, [provider, account]);

  // ======================
  // READ contracts
  // ======================
  const tokenContract = useMemo(() => {
    if (!provider) return null;

    return new ethers.Contract(
      TOKEN_ADDRESS,
      tokenAbi.abi,
      provider
    );
  }, [provider]);

  const stakingContract = useMemo(() => {
    if (!provider) return null;

    return new ethers.Contract(
      STAKING_ADDRESS,
      stakingAbi.abi,
      provider
    );
  }, [provider]);

  const ammContract = useMemo(() => {
    if (!provider) return null;

    return new ethers.Contract(
      AMM_ADDRESS,
      ammAbi.abi,
      provider
    );
  }, [provider]);

  // ======================
  // WRITE contracts
  // ======================
  const tokenWriteContract = useMemo(() => {
    if (!signer) return null;

    return new ethers.Contract(
      TOKEN_ADDRESS,
      tokenAbi.abi,
      signer
    );
  }, [signer]);

  const stakingWriteContract = useMemo(() => {
    if (!signer) return null;

    return new ethers.Contract(
      STAKING_ADDRESS,
      stakingAbi.abi,
      signer
    );
  }, [signer]);

  const ammWriteContract = useMemo(() => {
    if (!signer) return null;

    return new ethers.Contract(
      AMM_ADDRESS,
      ammAbi.abi,
      signer
    );
  }, [signer]);

  // ======================
  // UI
  // ======================
  return (
    <Layout account={account} onConnect={handleConnect}>
      <AppRoutes
        account={account}

        // READ
        contract={tokenContract}
        stakingContract={stakingContract}
        ammContract={ammContract}

        // WRITE
        signerContract={tokenWriteContract}
        signerStakingContract={stakingWriteContract}
        signerAmmContract={ammWriteContract}
      />
    </Layout>
  );
}

export default App;