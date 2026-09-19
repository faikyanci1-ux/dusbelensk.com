import type { Metadata } from "next";
import { getFaq } from "@/lib/queries";
import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Sık Sorulan Sorular",
  description:
    "Kayıt, deneme antrenmanı, antrenman programı, lisans ve aidat hakkında Düşbelen SK'ya en çok sorulan sorular.",
  path: "/sss",
});

export default async function FaqPage() {
  const faq = await getFaq();

  return (
    <div className="bg-cream py-16 text-ink">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          tone="light"
          eyebrow="Merak Edilenler"
          title="Sık Sorulan Sorular"
          description="Kayıt, antrenman ve kulüp süreçleri hakkında en çok sorulan sorular."
        />

        <div className="mt-12 space-y-3">
          {faq.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-black/10 bg-black/[0.02] p-5 open:border-accent"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink marker:hidden">
                {item.question}
                <span className="shrink-0 text-lg leading-none text-accent transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-ink-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
