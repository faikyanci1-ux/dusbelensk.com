import { club } from "@/data/club";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export function WhatsAppButton() {
  const message = encodeURIComponent("Merhaba, Düşbelen SK hakkında bilgi almak istiyorum.");

  return (
    <a
      href={`https://wa.me/${club.whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp üzerinden bize yazın"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition hover:brightness-110"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
