import json
import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

docs_dir = Path(r"C:\Users\mdxbl\Desktop\技术支持\产品手册or实验方案撰写\分子实验")
files = sorted(docs_dir.iterdir())

results = []

for f in files:
    if f.name.startswith("~$"):
        continue
    info = {
        "filename": f.name,
        "suffix": f.suffix.lower(),
        "title": f.stem,
        "content_preview": "",
        "total_chars": 0,
    }

    try:
        if f.suffix.lower() == ".docx":
            from docx import Document
            doc = Document(str(f))
            text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        elif f.suffix.lower() == ".pdf":
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

    info["content_preview"] = text[:800]
    info["total_chars"] = len(text)
    results.append(info)

out_path = Path(__file__).parent / "molecular_doc_analysis.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(results)} documents → {out_path}")
for r in results:
    print(f"  {r['filename']}  ({r['suffix']}, {r['total_chars']} chars)")
