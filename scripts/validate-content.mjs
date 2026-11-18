import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import matter from "gray-matter"
import remarkParse from "remark-parse"
import { unified } from "unified"
import { visit } from "unist-util-visit"

const markdownExtensions = new Set([".md", ".markdown", ".mdx"])
const externalProtocols = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i

async function listFiles(directory, relative = "") {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const relativePath = path.posix.join(relative, entry.name)
    const absolutePath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolutePath, relativePath)))
    } else if (entry.isFile()) {
      files.push(relativePath)
    }
  }

  return files
}

function resolveTarget(sourcePath, rawTarget, contentFiles, rootFallback = false) {
  const target = rawTarget.trim().replace(/^<|>$/g, "")
  if (!target || target.startsWith("#") || externalProtocols.test(target)) return { external: true }

  let pathname = target.split(/[?#]/, 1)[0]
  try {
    pathname = decodeURIComponent(pathname)
  } catch {
    return { missing: target }
  }

  const sourceDirectory = path.posix.dirname(sourcePath)
  const normalizedPaths = [
    path.posix.normalize(
      pathname.startsWith("/") ? pathname.slice(1) : path.posix.join(sourceDirectory, pathname),
    ),
  ]
  if (rootFallback && !pathname.startsWith("/"))
    normalizedPaths.push(path.posix.normalize(pathname))

  const candidates = normalizedPaths
    .filter((normalized) => normalized !== ".." && !normalized.startsWith("../"))
    .flatMap((normalized) =>
      path.posix.extname(normalized)
        ? [normalized]
        : [normalized, `${normalized}.md`, path.posix.join(normalized, "index.md")],
    )
  const resolved = candidates.find((candidate) => contentFiles.has(candidate))
  return resolved ? { path: resolved } : { missing: target }
}

function extractFrontmatter(source) {
  const parsed = matter(source)
  if (parsed.data === null || typeof parsed.data !== "object" || Array.isArray(parsed.data)) {
    throw new Error("frontmatter must be a YAML mapping")
  }
  return parsed.content
}

export async function validateContent(contentDirectory) {
  const files = await listFiles(contentDirectory)
  const contentFiles = new Set(files)
  const markdownFiles = files.filter((file) =>
    markdownExtensions.has(path.extname(file).toLowerCase()),
  )
  const diagnostics = []

  for (const sourcePath of markdownFiles) {
    const absolutePath = path.join(contentDirectory, ...sourcePath.split("/"))
    const source = await readFile(absolutePath, "utf8")
    let markdown

    try {
      markdown = extractFrontmatter(source)
    } catch (error) {
      diagnostics.push(`${sourcePath}: invalid frontmatter: ${error.message}`)
      continue
    }

    const tree = unified().use(remarkParse).parse(markdown)
    const definitions = new Map()
    visit(tree, "definition", (node) => {
      definitions.set(node.identifier, node.url)
    })

    const check = (rawTarget, line, kind) => {
      const result = resolveTarget(sourcePath, rawTarget, contentFiles, kind === "wikilink")
      if (result.missing) {
        diagnostics.push(`${sourcePath}:${line}: missing ${kind} target "${rawTarget}"`)
      }
    }

    visit(tree, (node) => {
      if (node.type === "link" || node.type === "image") {
        check(node.url, node.position?.start.line ?? 1, node.type === "image" ? "asset" : "link")
      } else if (node.type === "linkReference" || node.type === "imageReference") {
        const destination = definitions.get(node.identifier)
        if (destination) {
          check(
            destination,
            node.position?.start.line ?? 1,
            node.type === "imageReference" ? "asset" : "link",
          )
        }
      } else if (node.type === "text") {
        for (const match of node.value.matchAll(/!?\[\[([^\]]+)\]\]/g)) {
          const target = match[1].split("|", 1)[0].split("#", 1)[0]
          if (target) check(target, node.position?.start.line ?? 1, "wikilink")
        }
      }
    })
  }

  return diagnostics
}

async function main() {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
  const contentDirectory = path.join(repositoryRoot, "content")
  const diagnostics = await validateContent(contentDirectory)

  if (diagnostics.length > 0) {
    console.error(`Content validation failed with ${diagnostics.length} error(s):`)
    for (const diagnostic of diagnostics) console.error(`- ${diagnostic}`)
    process.exitCode = 1
    return
  }

  const markdownFiles = (await listFiles(contentDirectory)).filter((file) =>
    markdownExtensions.has(path.extname(file).toLowerCase()),
  )
  console.log(
    `Content validation passed: ${markdownFiles.length} Markdown files, frontmatter, local links, wikilinks, and assets.`,
  )
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main()
}
