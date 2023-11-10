'use client'

import { GeneralContextProvider } from '~/context/generalContext';
import React from 'react';
import { FC } from 'react';

interface pageProps {
  children: React.ReactNode;
}

export const Providers: FC<pageProps> = ({ children }) => {
  return (
    <>
        <GeneralContextProvider>
          {children}
        </GeneralContextProvider>
    </>
  );
};