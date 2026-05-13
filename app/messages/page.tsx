import { Suspense } from 'react';
import Messages from './messages';

export default function MessagesPage() {
	return (
		<Suspense fallback={<div className="min-h-screen bg-[#071425]" />}>
			<Messages />
		</Suspense>
	);
}
