import Img from 'next/image';

interface LogoProps {
  width: number;
}

export const Logo = ({ width }: LogoProps) => {
  return <Img src="/img/logo.png" alt="Logo" width={width} height={width * 0.3} />;
};
