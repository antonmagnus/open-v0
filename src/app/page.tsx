import { auth } from "@/auth";
import AppPage from "@/components/app-page";
import { SessionProvider } from "next-auth/react";

export const maxDuration = 60;
export const runtime = 'edge'

export default async function Home() {
  const session = await auth()
  if (!session) return <div>Not authenticated</div>

  return (
    <SessionProvider session={session}>
      <div className="h-full">
        <AppPage preview={false} />
      </div>
    </SessionProvider>

  );
}
