import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ArrowRight } from "lucide-react";
import { SettingsClient } from "@/components/dashboard/SettingsClient";
import { HeadingStar } from "@/components/zellige/Rosette";

export const metadata = { title: "الإعدادات" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin?callbackUrl=/dashboard/settings");

  return (
    <section className="max-w-3xl mx-auto px-5 py-8">
      <Link href="/dashboard" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        لوحة التحكم
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <HeadingStar />
        <h1 className="text-2xl md:text-3xl font-extrabold">الإعدادات</h1>
      </div>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>
        تخصيص تجربتك مع المنصة.
      </p>

      <SettingsClient
        user={{
          name: session.user.name || "",
          email: session.user.email || "",
        }}
      />
    </section>
  );
}
