import { useState, useMemo } from "react";
import { ethers } from "ethers";

import Layout from "./components/common/Layout";
import AppRoutes from "./app/routes";

import tokenAbi from "./contracts/MyToken.json";
import stakingAbi from "./contracts/Staking.json";

const TOKEN_ADDRESS = import.meta.env.VITE_MYTOKEN_ADDRESS;
const STAKING_ADDRESS = import.meta.env.VITE_STAKING_ADDRESS;

function App() {
  const provider = useMemo(() => {
    if (!window.ethereum) return null;
    return new ethers.BrowserProvider(window.ethereum);
  }, []);

  const [account, setAccount] = useState(null);

  async function handleConnect() {
    if (!provider) return;

    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  }

  // ERC20（MyToken）READ
  const contract = useMemo(() => {
    if (!provider) return null;

    return new ethers.Contract(
      TOKEN_ADDRESS,
      tokenAbi.abi,
      provider
    );
  }, [provider]);

  // Staking READ
  const stakingContract = useMemo(() => {
    if (!provider) return null;

    return new ethers.Contract(
      STAKING_ADDRESS,
      stakingAbi.abi,
      provider
    );
  }, [provider]);

  // ERC20 WRITE
  const signerContract = useMemo(() => {
    if (!provider || !account) return null;

    const signer = provider.getSigner();

    return new ethers.Contract(
      TOKEN_ADDRESS,
      tokenAbi.abi,
      signer
    );
  }, [provider, account]);

  return (
    <Layout
      account={account}
      contract={contract}
      stakingContract={stakingContract}
      signerContract={signerContract}
      onConnect={handleConnect}
    >
      <AppRoutes
        account={account}
        contract={contract}
        stakingContract={stakingContract}
        signerContract={signerContract}
      />
    </Layout>
  );
}

export default App;