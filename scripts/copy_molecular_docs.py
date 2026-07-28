import json
import os
import shutil
from pathlib import Path

docs_dir = Path(r"C:\Users\mdxbl\Desktop\技术支持\产品手册or实验方案撰写\分子实验")
out_dir = Path(r"C:\Users\mdxbl\WorkBuddy\2026-07-10-09-58-08\app\public\docs")

# Only the 6 user-specified files
target_files = [
    "qPCR数据处理和作图.docx",
    "qPCR引物设计需要跨内含子吗？.docx",
    "RNA提取+逆转录+qPCR超详细实验方案.docx",
    "分子克隆操作手册-诺唯赞.pdf",
    "实时荧光定量PCR实验操作手册 -诺唯赞.pdf",
    "荧光定量标准操作指南-ABI.pdf",
]

file_map = {}

for fname in target_files:
    src = docs_dir / fname
    # Keep the filename as-is (Chinese chars)
    dst = out_dir / fname
    if src.exists():
        shutil.copy2(str(src), str(dst))
        suffix = src.suffix.lower()
        ftype = "PDF" if suffix == ".pdf" else "DOCX"
        file_map[fname] = {"path": f"docs/{fname}", "type": ftype, "size": src.stat().st_size}
        print(f"Copied: {fname} ({ftype}, {src.stat().st_size} bytes)")
    else:
        print(f"NOT FOUND: {fname}")

# Save mapping
with open(Path(__file__).parent / "molecular_file_map.json", "w", encoding="utf-8") as f:
    json.dump(file_map, f, ensure_ascii=False, indent=2)
print("\nDone!")
