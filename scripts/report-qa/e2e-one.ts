/**
 * One real public-business end-to-end diagnostic (collect + score).
 * Skips LLM/email unless RUN_LLM=1.
 *
 * Usage: npx tsx scripts/report-qa/e2e-one.ts
 */

import { collectDiagnostic } from "../../lib/report/diagnostic"
import { renderReportHtml } from "../../lib/report/render/html-report"
import { writeReportFromDiagnostic } from "../../lib/report/write"
import { renderReportPdf } from "../../lib/report/pdf"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"

async function main() {
  const businessName = process.env.E2E_NAME || "Allbirds"
  const website = process.env.E2E_URL || "https://www.allbirds.com"

  console.log(`Collecting diagnostic for ${businessName} (${website})…`)
  const diagnostic = await collectDiagnostic(businessName, website)
  console.log(
    JSON.stringify(
      {
        overall: diagnostic.scores.overall,
        coverage: diagnostic.scores.evidenceCoverage,
        pages: diagnostic.pages.map((p) => p.url),
        directories: diagnostic.directories.filter((d) => d.found).map((d) => d.platform),
        location: diagnostic.location.found
          ? { name: diagnostic.location.name, rating: diagnostic.location.rating, reviews: diagnostic.location.reviewCount }
          : diagnostic.location.note,
        catalog: {
          kind: diagnostic.catalog.kind,
          available: diagnostic.catalog.available,
          productCount: diagnostic.catalog.productCount,
          note: diagnostic.catalog.note,
        },
        topActions: diagnostic.recommendations.map((r) => `${r.rank}. ${r.action}`),
      },
      null,
      2,
    ),
  )

  const outDir = join(process.cwd(), "tmp-og", "report-qa")
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, "diagnostic.json"), JSON.stringify(diagnostic, null, 2))

  if (process.env.RUN_LLM === "1") {
    console.log("Writing LLM prose + PDF…")
    const report = await writeReportFromDiagnostic(diagnostic)
    const pdf = await renderReportPdf(report)
    const html = renderReportHtml(report)
    writeFileSync(join(outDir, "report.pdf"), pdf)
    writeFileSync(join(outDir, "report.html"), html)
    console.log(`Wrote ${outDir}/report.pdf and report.html (score ${report.overallScore}, coverage ${report.evidenceCoverage}%)`)
  } else {
    console.log("Skipped LLM/PDF (set RUN_LLM=1 to generate). diagnostic.json written.")
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
