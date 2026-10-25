import { NextResponse, type NextRequest } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isSameOrigin } from "@/lib/adminAuth";
import { getAdminUser } from "@/lib/adminSession";
import { canUploadTo } from "@/lib/permissions";

/**
 * Admin panelden tarayıcı üzerinden doğrudan Vercel Blob'a fotoğraf yükleme için kısa ömürlü
 * token üretir (dosya bu sunucudan geçmez; büyük fotoğraflarda sunucu boyut sınırına takılmaz).
 * proxy.ts /api/admin/* yolunu zaten korur; burada oturum ayrıca doğrulanır.
 * BLOB_READ_WRITE_TOKEN tanımlı değilse yükleme kapalıdır (ImageField yükle butonunu göstermez).
 */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Geçersiz istek." }, { status: 403 });
  // Rol DB'den yeniden okunur: editör yalnızca haberler/ ve galeri/ klasörlerine yükleyebilir.
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Fotoğraf yükleme henüz yapılandırılmadı." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^(haberler|galeri|kadro|yonetim)\/[\w\-. ]{1,120}$/.test(pathname) || pathname.includes("..")) throw new Error("Geçersiz klasör.");
        if (!canUploadTo(user.role, pathname.split("/")[0])) throw new Error("Bu klasöre yükleme yetkiniz yok.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
          maximumSizeInBytes: 15 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    // Ayrıntı yalnızca sunucu logunda; istemciye sabit mesaj.
    console.error("[upload]", error);
    return NextResponse.json({ error: "Fotoğraf yüklenemedi. Lütfen tekrar deneyin." }, { status: 400 });
  }
}
