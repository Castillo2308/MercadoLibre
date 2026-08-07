import dynamic from 'next/dynamic';

const ProfileComponent = dynamic(() => import('./profile'), { ssr: false });

export default function Page() {
  return <ProfileComponent />;
}
