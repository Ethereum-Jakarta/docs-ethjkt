import React, { useState } from 'react';

interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

interface AddNetworkButtonProps {
  networkConfig: NetworkConfig;
  buttonText: string;
}

export default function AddNetworkButton({ networkConfig, buttonText }: AddNetworkButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddNetwork = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
      } catch (error) {
        console.error('Failed to add network:', error);
      }
    } else {
      alert('Please install MetaMask to add this network');
    }
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: isHovered ? '#1a1f4d' : '#0D102D',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    marginBottom: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isHovered ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
  };

  return (
    <button
      onClick={handleAddNetwork}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={buttonStyle}
    >
      <img
        src="/img/metamask.svg"
        alt="MetaMask"
        style={{ width: '20px', height: '20px', flexShrink: 0 }}
      />
      <span>{buttonText}</span>
    </button>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
