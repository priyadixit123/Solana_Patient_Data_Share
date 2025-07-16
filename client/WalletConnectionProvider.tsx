import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, 
         WalletProvider
       } from '@solana/wallet-adapter-react';
import { 
        PhantomWalletAdapter,
        SolfareWalletAdapter
} from '@solana/wallet-adapter-wallets';

import {
  WalletModalProvider 

} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';import type { HospitalDataShare } from "../target/types/hospital_data_share";

// Configure the client to use the local cluster
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.HospitalDataShare as anchor.Program<HospitalDataShare>;



export const WalletConnectionProvider: FC <{ children: ReactNode }> = ({ children }) => {
  const endpoint = clusterApiUrl("devnet");

  const wallets = useMemo (
    () => [
      new PhantomWalletAdapter(),
      new SolfareWalletAdapter({network: "devnet "}),

    ],
    []

  );
  return (

    <ConnectionProvider endpoint={endpoint}>  
      <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider> 

     

 );
};