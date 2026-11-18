import assert from "node:assert/strict"
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { validateContent } from "./validate-content.mjs"

test("validates frontmatter, Markdown links, wikilinks, and image assets", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "atlas-content-valid-"))
  try {
    await mkdir(path.join(root, "assets"), { recursive: true })
    await writeFile(
      path.join(root, "index.md"),
      "---\ntitle: Home\n---\n[Guide](guide.md) ![Diagram](assets/diagram.svg) [[guide|Guide]]\n",
    )
    await writeFile(path.join(root, "guide.md"), "---\ntitle: Guide\n---\n# Guide\n")
    await writeFile(path.join(root, "assets", "diagram.svg"), "<svg />\n")

    assert.deepEqual(await validateContent(root), [])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("reports broken links and missing assets", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "atlas-content-broken-"))
  try {
    await writeFile(
      path.join(root, "index.md"),
      "---\ntitle: Home\n---\n[Missing](missing.md) ![Missing image](missing.svg) [[also-missing]]\n",
    )

    const diagnostics = await validateContent(root)
    assert.equal(diagnostics.length, 3)
    assert.match(diagnostics.join("\n"), /missing link target "missing\.md"/)
    assert.match(diagnostics.join("\n"), /missing asset target "missing\.svg"/)
    assert.match(diagnostics.join("\n"), /missing wikilink target "also-missing"/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("reports malformed YAML frontmatter", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "atlas-content-yaml-"))
  try {
    await writeFile(path.join(root, "index.md"), "---\ntitle: [unclosed\n---\n# Home\n")

    const diagnostics = await validateContent(root)
    assert.equal(diagnostics.length, 1)
    assert.match(diagnostics[0], /invalid frontmatter/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
