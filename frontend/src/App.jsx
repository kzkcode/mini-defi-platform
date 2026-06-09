import { useState, useMemo, useEffect } from "react";
import { ethers } from "ethers";

import Layout from "./components/common/Layout";
import AppRoutes from "./app/routes";

import tokenAbi from "./contracts/MyToken.json";
import stakingAbi from "./contracts/Staking.json";

const TOKEN_ADDRESS = import.meta.env.VITE_MYTOKEN_ADDRESS;
const STAKING_ADDRESS = import.meta.env.VITE_STAKING_ADDRESS;

function App() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  const provider = useMemo(() => {
    if (!window.ethereum) return null;
    return new ethers.BrowserProvider(window.ethereum);
  }, []);

  async function handleConnect() {
    if (!provider) return;

    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  }

  // signer取得
  useEffect(() => {
    if (!provider || !account) return;

    provider.getSigner().then(setSigner);
  }, [provider, account]);

  // READ TOKEN
  const contract = useMemo(() => {
    if (!provider) return null;

    return new ethers.Contract(
      TOKEN_ADDRESS,
      tokenAbi.abi,
      provider
    );
  }, [provider]);

  // READ STAKING
  const stakingContract = useMemo(() => {
    if (!provider) return null;

    return new ethers.Contract(
      STAKING_ADDRESS,
      stakingAbi.abi,
      provider
    );
  }, [provider]);

  // WRITE TOKEN
  const signerContract = useMemo(() => {
    if (!signer) return null;

    return new ethers.Contract(
      TOKEN_ADDRESS,
      tokenAbi.abi,
      signer
    );
  }, [signer]);

  // WRITE STAKING
  const signerStakingContract = useMemo(() => {
    if (!signer) return null;

    return new ethers.Contract(
      STAKING_ADDRESS,
      stakingAbi.abi,
      signer
    );
  }, [signer]);

  return (
    <Layout account={account} onConnect={handleConnect}>
      <AppRoutes
        account={account}
        contract={contract}
        stakingContract={stakingContract}
        signerContract={signerContract}
        signerStakingContract={signerStakingContract}
      />
    </Layout>
  );
}

export default App;