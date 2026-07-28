import json
import os
import sys
from pathlib import Path

docs_dir = Path(r"C:\Users\mdxbl\Desktop\技术支持\产品手册or实验方案撰写\建库&组学")
results = []

for f in sorted(docs_dir.iterdir()):
    if f.name.startswith("~$"):
        continue
    suffix = f.suffix.lower()
    info = {
        "filename": f.name,
        "suffix": suffix,
        "title": f.stem,
        "content_preview": "",
        "total_chars": 0,
    }

    try:
        if suffix == ".docx":
            from docx import Document
            doc = Document(str(f))
            text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        elif suffix == ".pdf":
            from PyPDF2 import PdfReader
            reader = PdfReader(str(f))
            pages_text = []
            for page in reader.pages[:3]:
                t = page.extract_text()
                if t:
                    pages_text.append(t)
            text = "\n".join(pages_text)
        else:
            text = ""
    except Exception as e:
        text = f"[ERROR: {e}]"

    info["content_preview"] = text[:1000]
    info["total_chars"] = len(text)
    results.append(info)

out_path = Path(__file__).parent / "ngs_doc_analysis.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(results)} documents → {out_path}")
for r in results:
    print(f"  {r['filename']}  ({r['suffix']}, {r['total_chars']} chars)")
