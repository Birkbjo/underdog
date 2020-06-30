import React, { ReactNode } from 'react';
import Headerbar from '../components/Headerbar';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;

  return (
    <>
      <Headerbar />
      {children}
    </>
  );
}
