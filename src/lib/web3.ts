import Web3 from 'web3';

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  if (typeof window === 'undefined') return false;
  return typeof (window as any).ethereum !== 'undefined' && (window as any).ethereum.isMetaMask;
};

// Initialize Web3
export const initWeb3 = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask extension not found. Please install MetaMask to use this application.');
  }

  try {
    // Request account access if needed
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
      throw new Error('No accounts found. Please connect to MetaMask.');
    }
    
    // Create Web3 instance
    const web3 = new Web3((window as any).ethereum);
    return web3;
  } catch (error) {
    console.error('Error initializing Web3:', error);
    throw new Error('Failed to connect to MetaMask. Please make sure you are logged in.');
  }
};

// Get current account
export const getCurrentAccount = async () => {
  if (!isMetaMaskInstalled()) return null;
  const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
  return accounts[0] || null;
};

// Listen for account changes
export const onAccountsChanged = (callback: (accounts: string[]) => void) => {
  if (!isMetaMaskInstalled()) return () => {};
  
  const handleAccountsChanged = (accounts: string[]) => {
    callback(accounts);
  };
  
  (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
  
  // Return cleanup function
  return () => {
    if ((window as any).ethereum?.removeListener) {
      (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  };
};
