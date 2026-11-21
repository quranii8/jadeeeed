import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";
import { AppIcon } from "@/components/AppIcon";
import { StarMark } from "@/components/zellige/Rosette";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "سجّل دخولك لمزامنة محفوظاتك وملاحظاتك",
};

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto px-5 py-12">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 w-fit"><StarMark size={64} /></div>
        <h1 className="font-kufic text-3xl md:text-4xl font-bold mb-2">سجّل دخولك</h1>
        <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
          بحساب Google، فتُحفظ ختمتك وورد يومك ومحفوظاتك من الآيات والأحاديث وآخر ما قرأت، وتجدها على كل أجهزتك.
        </p>
      </div>

      <div className="plaster-tile p-6 md:p-8">
        <SignInForm />
      </div>

      <div className="text-center mt-6 text-xs" style={{ color: "var(--text-soft)" }}>
        <AppIcon name="lock" /> نحفظ اسمك وبريدك وصورتك من Google وتقدّمك في الموقع فقط، ولا نستخدمها لأي غرض آخر.
      </div>
    </div>
  );
}
