"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProviderOrdersPage() {
  const router = useRouter();

  // Redirect to open orders page by default
  useEffect(() => {
    router.replace("/provider/orders/open");
  }, [router]);

  return null;
}
