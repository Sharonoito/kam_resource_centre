// @/lib/microsoft-graph.ts

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getMicrosoftGraphToken(): Promise<string> {
  // 1. Check cache
  if (cachedToken && Date.now() < tokenExpiry) {
    console.log("DEBUG: Using cached Microsoft Graph token");
    return cachedToken;
  }

  const tenantId = process.env.AZURE_AD_TENANT_ID;
  const clientId = process.env.AZURE_AD_CLIENT_ID;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;

  // 2. Log if variables are missing
  if (!tenantId || !clientId || !clientSecret) {
    console.error("DEBUG ERROR: Environment variables are missing!", {
      tenantId: !!tenantId,
      clientId: !!clientId,
      clientSecret: !!clientSecret
    });
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
    console.log("DEBUG: Requesting fresh token from Azure...");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("DEBUG: Azure Auth Failed Response:", data);
      throw new Error(`Azure Auth Failed: ${data.error_description || data.error}`);
    }

    if (!data.access_token) {
      console.error("DEBUG: Azure returned 200 but NO TOKEN in body.");
      throw new Error("Access token missing from response.");
    }

    // 3. Log success and token length
    console.log("DEBUG: Token successfully retrieved. Length:", data.access_token.length);

    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    return data.access_token;
  } catch (error) {
    console.error("DEBUG: getMicrosoftGraphToken Critical Error:", error);
    throw error;
  }
}