"""Copy the 13 user-specified docs to public/docs with URL-safe names, and generate portfolio data."""
import json, shutil, os
from pathlib import Path

SRC_DIR = Path(r"C:\Users\mdxbl\Desktop\技术支持\产品手册or实验方案撰写\细胞实验")
DST_DIR = Path(r"C:\Users\mdxbl\WorkBuddy\2026-07-10-09-58-08\app\public\docs")
ANALYSIS_FILE = Path(r"C:\Users\mdxbl\WorkBuddy\2026-07-10-09-58-08\app\scripts\doc_analysis.json")

TARGET_FILES = [
    "过表达慢病毒载体构建和包装-吉凯基因.pdf",
    "基质胶及类器官应用操作指南-翌圣生物.pdf",
    "巨噬细胞清除操作及文献实例分析-老羊.docx",
    "流式检测细胞凋亡详细实验方案 .docx",
    "慢病毒包装和感染产品操作指南 - （含QP+WB）.docx",
    "慢病毒操作手册-汉恒生物.pdf",
    "人肠道类器官培养方法.docx",
    "细胞划痕实验.docx",
    "细胞培养基础知识手册-赛默飞.pdf",
    "细胞增殖毒性检测方法详解.docx",
    "细胞周期检测方案.pdf",
    "血管形成实验protocol.docx",
    "原代细胞提取方案-by客户提供.docx",
]

def sanitize_filename(name: str) -> str:
    return name.replace(" ", "_").replace("（", "(").replace("）", ")").replace(" - ", "-")

with open(ANALYSIS_FILE, "r", encoding="utf-8") as f:
    all_docs = json.load(f)

# Build lookup by filename
info_by_name = {d["filename"]: d for d in all_docs}

entries = []

for i, filename in enumerate(TARGET_FILES):
    src = SRC_DIR / filename
    safe_name = sanitize_filename(filename)
    dst = DST_DIR / safe_name

    if not src.exists():
        print(f"WARNING: not found: {filename}")
        continue

    shutil.copy2(str(src), str(dst))
    print(f"Copied: {safe_name}")

    info = info_by_name.get(filename, {})
    ext = filename.rsplit(".", 1)[-1].lower()
    file_type = "PDF" if ext == "pdf" else "DOCX"

    # Clean up title
    title = info.get("title", filename.rsplit(".", 1)[0])
    if len(title) < 3 or len(title) > 80:
        title = filename.rsplit(".", 1)[0]

    desc = info.get("description", title)[:400]

    # Determine tags based on content
    tags = ["细胞实验", file_type]
    content_lower = (info.get("first_lines", "") + desc).lower()

    # Build the Work entry
    entry = {
        "id": f"cell-doc-{i+1:02d}",
        "title": title,
        "description": desc,
        "filename": safe_name,
        "fileType": file_type,
        "tags": tags,
    }
    entries.append(entry)

# Write portfolio entries as JSON for reference
out_path = Path(r"C:\Users\mdxbl\WorkBuddy\2026-07-10-09-58-08\app\scripts\portfolio_entries.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(entries, f, ensure_ascii=False, indent=2)

print(f"\nCopied {len(entries)} files. Portfolio entries saved to scripts/portfolio_entries.json")
