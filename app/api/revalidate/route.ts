import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path");
    const slug = request.nextUrl.searchParams.get("slug");

    // 특정 slug가 지정된 경우 해당 포스트만 재검증
    if (slug) {
      revalidatePath(`/blog/${slug}`);
      revalidatePath("/blog"); // 목록 페이지도 함께 재검증
      return NextResponse.json({
        revalidated: true,
        paths: [`/blog/${slug}`, "/blog"],
        now: Date.now(),
      });
    }

    // 특정 경로가 지정된 경우 해당 경로만 재검증
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now(),
      });
    }

    // 경로가 지정되지 않은 경우 블로그 관련 경로 모두 재검증
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");

    return NextResponse.json({
      revalidated: true,
      paths: ["/blog", "/blog/[slug]"],
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
