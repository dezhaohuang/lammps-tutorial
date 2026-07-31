/**
 * Cloudflare Worker — 简易访问统计
 * KV 命名空间绑定名: STATS
 *
 * 部署后挂载路由: www.whu-atmes.com/api/tutorial-stats
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://www.whu-atmes.com",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function hashIP(ip) {
  const data = new TextEncoder().encode(ip + "_lammps_tutorial_salt_2026");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const KV = env.STATS;

    // 读取当前计数
    const raw = await KV.get("counts", "json");
    let counts = raw || { pv: 0, uv: 0 };

    if (request.method === "POST") {
      // 每次访问 +1 PV
      counts.pv += 1;

      // 用 IP hash 判断是否新访客（KV key 存 365 天）
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const visitorKey = `v:${await hashIP(ip)}`;
      const seen = await KV.get(visitorKey);
      if (!seen) {
        counts.uv += 1;
        await KV.put(visitorKey, "1", { expirationTtl: 86400 * 365 });
      }

      await KV.put("counts", JSON.stringify(counts));
    }

    return new Response(JSON.stringify(counts), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        ...CORS_HEADERS,
      },
    });
  },
};
