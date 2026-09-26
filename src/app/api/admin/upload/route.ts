import { NextResponse, type NextRequest } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { isAdminSession } from "@/lib/adminSession";

/**
 * Admin panelden tarayıcı üzerinden doğrudan Vercel Blob'a fotoğraf yükleme için kısa ömürlü
 * token üretir (dosya bu sunucudan geçmez; büyük fotoğraflarda sunucu boyut sınırına takılmaz).
 * proxy.ts /api/admin/* yolunu zaten korur; burada oturum ayrıca doğrulanır.
 * BLOB_READ_WRITE_TOKEN tanımlı değilse yükleme kapalıdır (ImageField yükle butonunu göstermez).
 */
export async function POST(request: NextRequest) {
  if (!(await isAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Fotoğraf yükleme henüz yapılandırılmadı." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^(haberler|galeri|kadro|yonetim)\//.test(pathname)) throw new Error("Geçersiz klasör.");
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
