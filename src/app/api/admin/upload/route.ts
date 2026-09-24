import { NextResponse, type NextRequest } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminAuth";

/**
 * Admin panelden tarayıcı üzerinden doğrudan Vercel Blob'a fotoğraf yükleme için kısa ömürlü
 * token üretir (dosya bu sunucudan geçmez; büyük fotoğraflarda sunucu boyut sınırına takılmaz).
 * proxy.ts /api/admin/* yolunu zaten korur; burada oturum ayrıca doğrulanır.
 * BLOB_READ_WRITE_TOKEN tanımlı değilse yükleme kapalıdır (ImageField yükle butonunu göstermez).
 */
export async function POST(request: NextRequest) {
  if (!(await verifySessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value))) {
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
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
