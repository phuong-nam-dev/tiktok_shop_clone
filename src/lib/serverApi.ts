export const serverApi = {
  async get<T>(endpoint: string, init?: RequestInit): Promise<T> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api${endpoint}`,
      {
        ...init,
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("Server API Error");
    return res.json();
  },

  async post<T>(
    endpoint: string,
    body?: unknown,
    init?: RequestInit
  ): Promise<T> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api${endpoint}`,
      {
        ...init,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) throw new Error("Server API Error");
    return res.json();
  },
};
