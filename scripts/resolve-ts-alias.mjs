/** Lets verifiers import app TypeScript that uses "@/..." paths and extensionless imports. */
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const HAS_EXTENSION = /\.(?:ts|tsx|js|mjs|cjs|json)$/

export async function resolve(specifier, context, nextResolve) {
  let target = specifier
  if (target.startsWith("@/")) target = pathToFileURL(path.join(root, target.slice(2))).href
  const local = target.startsWith("./") || target.startsWith("../") || target.startsWith("file:")
  if (local && !HAS_EXTENSION.test(target)) return nextResolve(`${target}.ts`, context)
  return nextResolve(target, context)
}
