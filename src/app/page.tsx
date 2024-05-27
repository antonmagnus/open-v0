import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import AppPage from "@/components/app-page";
import SessionProvider from "@/lib/provider";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const maxDuration = 60;
export default async function Home() {
  const session = await getServerSession(authOptions)
  if (!session) {
    // redirect to sign in if user is not logged in
    redirect('/sign-in')
  }

  return (
    <SessionProvider session={session}>
      <div className="h-full">
        <AppPage preview={false} />
      </div>
    </SessionProvider>

  );
}
