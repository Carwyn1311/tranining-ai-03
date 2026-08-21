import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://yqwsxpsrrqoiblxheqrs.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_tI_qBApqG-v7_SDu8LpZIw_we7WUGPh";

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  // Refresh auth token and get user
  let activeRole: string | null = null;
  let isAuthenticated = false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      isAuthenticated = true;
      activeRole = user.user_metadata?.role || (user.email?.toLowerCase().startsWith("admin@") || user.email?.toLowerCase().includes("admin") ? "ADMIN" : "CUSTOMER");
    }
  } catch (err) {
    // Supabase auth error fallback
  }

  // Fallback to minishop_user cookie
  if (!isAuthenticated) {
    const userCookie = request.cookies.get("minishop_user");
    if (userCookie?.value) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userCookie.value));
        if (parsed && parsed.email) {
          isAuthenticated = true;
          activeRole = parsed.role || (parsed.email?.toLowerCase().startsWith("admin@") || parsed.email?.toLowerCase().includes("admin") ? "ADMIN" : "CUSTOMER");
        }
      } catch (e) {
        // parse error
      }
    }
  }

  // Route Guard: Chặn khu vực quản trị /admin
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      // Chưa đăng nhập -> Chuyển về trang đăng nhập
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", "/admin");
      return NextResponse.redirect(loginUrl);
    }

    // Đã đăng nhập nhưng không có vai ADMIN -> Chặn và chuyển về login với thông báo
    if (activeRole !== "ADMIN") {
      const unauthorizedUrl = new URL("/login", request.url);
      unauthorizedUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return supabaseResponse;
};

export const createClient = (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  return supabaseResponse;
};
