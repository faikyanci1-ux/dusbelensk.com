import { getClubInfo } from "@/lib/queries";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export async function WhatsAppButton() {
  const club = await getClubInfo();
  const message = encodeURIComponent("Merhaba, Düşbelen SK hakkında bilgi almak istiyorum.");

  return (
    <a
      href={`https://wa.me/${club.whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp üzerinden bize yazın"
      className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/50 ring-2 ring-white/70 transition hover:brightness-110 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
    >
      <WhatsAppIcon size={24} />
    </a>
  );
}
