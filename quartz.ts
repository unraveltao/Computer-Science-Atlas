import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

// Keep the approved knowledge domains in their numeric order after their display names are localized.
ExternalPlugin.Explorer({
  sortFn: (a, b) => {
    if (a.isFolder !== b.isFolder) {
      return a.isFolder ? -1 : 1
    }

    const aIsDomain =
      a.isFolder &&
      a.slugSegments?.[0]?.toLowerCase() === "computer-science" &&
      /^\d{2}-/.test(a.slugSegment ?? "")
    const bIsDomain =
      b.isFolder &&
      b.slugSegments?.[0]?.toLowerCase() === "computer-science" &&
      /^\d{2}-/.test(b.slugSegment ?? "")
    if (aIsDomain && bIsDomain) {
      return (a.slugSegment ?? "").localeCompare(b.slugSegment ?? "", undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }
    if (aIsDomain) return -1
    if (bIsDomain) return 1

    return (a.displayName ?? "").localeCompare(b.displayName ?? "", undefined, {
      numeric: true,
      sensitivity: "base",
    })
  },
})

ExternalPlugin.Breadcrumbs({ rootName: "首页" })

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
