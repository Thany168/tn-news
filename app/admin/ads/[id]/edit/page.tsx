import { notFound } from "next/navigation";
import { getAd } from "@/lib/ads";
import AdsForm from "../../AdsForm";

export const dynamic = "force-dynamic";

export default async function EditAdPage({
  params,
}: {
  params: { id: string };
}) {
  const ad = await getAd(Number(params.id));
  if (!ad) notFound();
  return <AdsForm ad={ad} />;
}
