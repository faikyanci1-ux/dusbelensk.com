import type { Metadata } from "next";
import { getGallery } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Galeri",
  description: "Düşbelen SK maç günlerinden ve antrenmanlardan fotoğraf galerisi.",
  path: "/galeri",
  image: "/images/gallery/match-1.jpg",
});

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <>
    <PageHero
      eyebrow="Kulüpten Kareler"
      title="Galeri"
      description="Maçlardan, antrenmanlardan ve kulüp atmosferinden kareler. Büyütmek için bir fotoğrafa tıklayın."
      image="/images/gallery/match-1.jpg"
    />
    <div className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <GalleryLightbox items={items} />
      </div>
    </div>
    </>
  );
}
