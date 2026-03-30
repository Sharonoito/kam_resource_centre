// @/lib/microsoft-graph.ts

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

type GraphTokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

export async function getMicrosoftGraphToken(): Promise<string> {
  // 1. Check cache
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const tenantId = process.env.AZURE_AD_TENANT_ID;
  const clientId = process.env.AZURE_AD_CLIENT_ID;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing Azure AD environment variables.");
  }

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = (await response.json()) as GraphTokenResponse;

    if (!response.ok) {
      throw new Error(`Azure Auth Failed: ${data.error_description || data.error}`);
    }

    if (!data.access_token) {
      throw new Error("Access token missing from response.");
    }

    cachedToken = data.access_token;
    tokenExpiry = Date.now() + ((data.expires_in ?? 3600) - 60) * 1000;

    return data.access_token;
  } catch (error) {
    console.error("Failed to acquire Microsoft Graph token", error);
    throw error;
  }
}