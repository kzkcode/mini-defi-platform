import { useState, useMemo } from "react";
import { ethers } from "ethers";

import Layout from "./components/common/Layout";
import AppRoutes from "./app/routes";

import tokenAbi from "./contracts/MyToken.json";

const TOKEN_ADDRESS = import.meta.env.VITE_MYTOKEN_ADDRESS;

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

  // READ専用
  const contract = useMemo(() => {
    if (!provider) return null;

    return new ethers.Contract(
      TOKEN_ADDRESS,
      tokenAbi.abi,
      provider
    );
  }, [provider]);

  // WRITE専用
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
      signerContract={signerContract}
      onConnect={handleConnect}
    >
      <AppRoutes
        account={account}
        contract={contract}
        signerContract={signerContract}
      />
    </Layout>
  );
}

export default App;