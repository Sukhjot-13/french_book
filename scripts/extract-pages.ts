import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";
import { cleanPdfText } from "../src/lib/dataset/normalize";

export interface RawPage {
  pdf_page: number;
  printed_page: number | null;
  text: string;
  extraction_status: "ok" | "empty" | "error";
  notes: string | null;
}

export async function extractPages() {
  console.log("Starting PDF page extraction from docs/source_book.pdf...");
  const pdfPath = path.resolve(process.cwd(), "docs/source_book.pdf");
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF not found at ${pdfPath}`);
  }

  const dataBuffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  const pages = result.pages || [];

  console.log(`Extracted ${pages.length} pages from PDF.`);

  const outputDir = path.resolve(process.cwd(), "data/raw/pages");
  fs.mkdirSync(outputDir, { recursive: true });

  const allPages: RawPage[] = [];

  for (let i = 0; i < pages.length; i++) {
    const pdfPage = i + 1;
    const rawText = pages[i]?.text || "";
    const cleaned = cleanPdfText(rawText);

    // Detect printed page number from text or mapping
    // Note: PDF page 15 corresponds to printed page 1
    let printedPage: number | null = null;
    if (pdfPage >= 15 && pdfPage <= 286) {
      printedPage = pdfPage - 14;
    }

    const pageObj: RawPage = {
      pdf_page: pdfPage,
      printed_page: printedPage,
      text: cleaned,
      extraction_status: cleaned.length > 0 ? "ok" : "empty",
      notes: null,
    };

    allPages.push(pageObj);

    const pad = pdfPage.toString().padStart(3, "0");
    const pageFilePath = path.join(outputDir, `page-${pad}.json`);
    fs.writeFileSync(pageFilePath, JSON.stringify(pageObj, null, 2), "utf-8");
  }

  const allPagesFilePath = path.resolve(process.cwd(), "data/raw/pages-all.json");
  fs.writeFileSync(allPagesFilePath, JSON.stringify(allPages, null, 2), "utf-8");

  console.log(`Successfully wrote ${allPages.length} individual page files to data/raw/pages/ and data/raw/pages-all.json.`);
}

if (require.main === module) {
  extractPages().catch((err) => {
    console.error("Error during extractPages:", err);
    process.exit(1);
  });
}

