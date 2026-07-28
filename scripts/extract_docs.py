"""Extract titles and first 500 chars from PDF/DOCX to create portfolio entries."""
import json, os, sys
from pathlib import Path
from docx import Document
from PyPDF2 import PdfReader

DOCS_DIR = Path(r"C:\Users\mdxbl\Desktop\技术支持\产品手册or实验方案撰写\细胞实验")
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "docs"

def extract_pdf(path: str) -> str:
    try:
        reader = PdfReader(path)
        text = ""
        for page in reader.pages[:2]:
            t = page.extract_text()
            if t:
                text += t + "\n"
        return text.strip()
    except Exception as e:
        return f"[PDF read error: {e}]"

def extract_docx(path: str) -> str:
    try:
        doc = Document(path)
        paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
        return "\n".join(paragraphs[:20])
    except Exception as e:
        return f"[DOCX read error: {e}]"

def truncate(text: str, max_len: int = 500) -> str:
    if len(text) <= max_len:
        return text
    return text[:max_len] + "..."

def analyze_file(filepath: Path) -> dict:
    name = filepath.stem
    suffix = filepath.suffix.lower()

    if suffix == ".pdf":
        full_text = extract_pdf(str(filepath))
    elif suffix == ".docx":
        full_text = extract_docx(str(filepath))
    else:
        full_text = ""

    lines = [l for l in full_text.split("\n") if l.strip()]
    title = ""
    desc_lines = []

    for i, line in enumerate(lines):
        clean = line.strip()
        if not title and len(clean) > 3 and len(clean) < 100:
            # First meaningful line is title
            title = clean
        elif title and len(clean) > 5:
            desc_lines.append(clean)
            if sum(len(d) for d in desc_lines) > 300:
                break

    if not title:
        title = name

    desc = "；".join(desc_lines[:5]) if desc_lines else title
    desc = truncate(desc, 400)

    return {
        "filename": filepath.name,
        "stem": name,
        "title": title,
        "description": desc,
        "first_lines": truncate(full_text, 600),
        "ext": suffix.lstrip("."),
    }

def main():
    results = []
    files = sorted(DOCS_DIR.glob("*"))
    for f in files:
        if f.suffix.lower() in (".pdf", ".docx"):
            print(f"Processing: {f.name}")
            info = analyze_file(f)
            results.append(info)

    with open(Path(__file__).resolve().parent / "doc_analysis.json", "w", encoding="utf-8") as fp:
        json.dump(results, fp, ensure_ascii=False, indent=2)

    print(f"\nDone. {len(results)} documents analyzed.")

if __name__ == "__main__":
    main()
