import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { isAuthenticationError } from "@/src/modules/authentication/application/authentication-error";

export const dynamic = "force-dynamic";

const privateHeaders = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Vary: "Cookie, Authorization",
};

export async function GET() {
  const runtime = await createAuthenticationRuntime();
  if (!runtime.available) {
    return Response.json(
      { error: { code: "AUTH_CONFIGURATION_UNAVAILABLE" } },
      { status: 503, headers: privateHeaders },
    );
  }

  try {
    const account = await runtime.service.currentAccount();
    if (!account) {
      return Response.json(
        { error: { code: "AUTHENTICATION_REQUIRED" } },
        { status: 401, headers: privateHeaders },
      );
    }

    return Response.json(
      { data: { userId: account.id, accountState: account.state } },
      { status: 200, headers: privateHeaders },
    );
  } catch (error) {
    const code =
      isAuthenticationError(error) && error.code === "ACCOUNT_UNAVAILABLE"
        ? "ACCOUNT_UNAVAILABLE"
        : "AUTH_PROVIDER_UNAVAILABLE";
    return Response.json(
      { error: { code } },
      { status: code === "ACCOUNT_UNAVAILABLE" ? 403 : 503, headers: privateHeaders },
    );
  }
}
