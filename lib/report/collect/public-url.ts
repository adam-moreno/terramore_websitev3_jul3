import { lookup } from "node:dns/promises"
import { isIP } from "node:net"

/**
 * Outbound-fetch guard for the footprint collectors. The free business lookup runs on an anonymous request, so a
 * visitor chooses the URL our server fetches: only public http(s) hosts on standard ports are allowed, every address
 * a hostname resolves to must be public, and each redirect hop is checked again (see fetchText).
 */

export class BlockedUrlError extends Error {
  constructor(reason: string) {
    super(`Blocked URL: ${reason}`)
    this.name = "BlockedUrlError"
  }
}

function ipv4Private(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number)
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 169 && b === 254) || // link-local, cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224 // multicast and reserved
  )
}

function ipv6Private(ip: string): boolean {
  const v = ip.toLowerCase()
  if (v === "::" || v === "::1") return true
  const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return ipv4Private(mapped[1])
  return /^(fc|fd|fe8|fe9|fea|feb|ff)/.test(v)
}

export function isPrivateAddress(ip: string): boolean {
  const family = isIP(ip)
  if (family === 4) return ipv4Private(ip)
  if (family === 6) return ipv6Private(ip)
  return true
}

/** Throws BlockedUrlError unless the URL is a public http(s) address on a standard port. */
export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new BlockedUrlError("not a URL")
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new BlockedUrlError("protocol")
  if (url.username || url.password) throw new BlockedUrlError("credentials in URL")
  if (url.port && url.port !== "80" && url.port !== "443") throw new BlockedUrlError("port")
  const host = url.hostname.replace(/^\[|\]$/g, "")
  if (!host.includes(".") || /\.(local|internal|localhost)$/i.test(host) || host === "localhost") {
    throw new BlockedUrlError("host")
  }
  if (isIP(host)) {
    if (isPrivateAddress(host)) throw new BlockedUrlError("private address")
    return url
  }
  let addresses: Array<{ address: string }>
  try {
    addresses = await lookup(host, { all: true })
  } catch {
    throw new BlockedUrlError("does not resolve")
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) {
    throw new BlockedUrlError("private address")
  }
  return url
}
