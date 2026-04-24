import dynamic from 'next/dynamic';

const LoginComponent = dynamic(() => import('./login'), { ssr: false });

export default function Page() {
  return <LoginComponent />;
}

