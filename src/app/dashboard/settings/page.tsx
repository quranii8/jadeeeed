import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ArrowRight } from "lucide-react";
import { SettingsClient } from "@/components/dashboard/SettingsClient";

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

      <header className="page-band page-band--ink text-center relative overflow-hidden mb-8">
        <h1 className="text-4xl md:text-5xl mb-3">الإعدادات</h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--g-on-muted)" }}>
          تخصيص تجربتك مع المنصة.
        </p>
      </header>

      <SettingsClient
        user={{
          name: session.user.name || "",
          email: session.user.email || "",
        }}
      />
    </section>
  );
}
