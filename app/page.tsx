import { redirect } from "next/navigation";

import { defaultLocale } from "@/src/shared/localization/locales";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
