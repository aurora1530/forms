import Link from 'next/link';

import { auth, signIn, signOut } from '@/lib/auth';

export default async function Header() {
  const session = await auth();

  const SignInButton = () => {
    return (
      <form
        action={async () => {
          'use server';
          await signIn('google');
        }}
      >
        <button type="submit" className="text-white">
          ログイン
        </button>
      </form>
    );
  };

  const SignOutButton = () => {
    return (
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <button type="submit" className="text-white">
          {session?.user?.name} をログアウト
        </button>
      </form>
    );
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="mx-auto py-2 px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Forms
        </Link>
        <div>{session?.user ? <SignOutButton /> : <SignInButton />}</div>
      </div>
    </header>
  );
}
