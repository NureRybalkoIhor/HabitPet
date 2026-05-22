import { ReactNode } from 'react';
import logo from '../../assets/Logo.png';

interface AuthLayoutProps {
  children: ReactNode;
  maxWidth?: number;
  logoSize?: number;
  logoMarginClassName?: string;
  mainClassName?: string;
  shiftClassName?: string;
}

const AuthLayout = ({
  children,
  maxWidth = 520,
  logoSize = 250,
  logoMarginClassName = 'mb-6',
  mainClassName = 'min-h-screen bg-white px-4 pb-12 pt-14 sm:pt-16',
  shiftClassName = 'translate-y-4',
}: AuthLayoutProps) => (
  <main className={mainClassName}>
    <section
      className={`mx-auto flex w-full flex-col items-center ${shiftClassName}`}
      style={{ maxWidth }}
    >
      <img
        className={`${logoMarginClassName} object-contain`}
        src={logo}
        alt="HabitPet"
        style={{ width: logoSize, height: logoSize }}
      />
      {children}
    </section>
  </main>
);

export default AuthLayout;
