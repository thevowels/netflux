"use client"

import {useRouter} from 'next/navigation';
export default function Home() {
    const router = useRouter();
  return (
      <>
          <h1 className="text-3xl font-bold underline text-sky-300">
              Netflix clone go to /auth
          </h1>
          <button
              className={" mt-10 px-8 py-5 bg-amber-200 border-r-blue-700 rounded-xl"}
              onClick={() => router.push('/auth')}> Auth</button>

      </>
  );
}
