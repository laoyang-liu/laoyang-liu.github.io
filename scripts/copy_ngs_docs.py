import json
import shutil
from pathlib import Path

docs_dir = Path(r"C:\Users\mdxbl\Desktop\技术支持\产品手册or实验方案撰写\建库&组学")
out_dir = Path(r"C:\Users\mdxbl\WorkBuddy\2026-07-10-09-58-08\app\public\docs")

target_files = [
    "12257+12806+12308血液RNA实验操作SOP.docx",
    "12597ES-CUT&Tag-qPCR操作流程.VerCN20240426.pdf",
    "12597ES-甲醛交联的CUT&Tag操作流程.VerCN20240426.pdf",
    "ATAC和CUT&Tag进阶手册：含生信代码-程伟.pdf",
    "CUT&Tag实验操作指南画册.pdf",
    "Cuttag数据分析结果报告demo-20230111(1).pdf",
    "冻存组织ATAC实验流程.docx",
    "多组学技术汇总-刘洋.docx",
    "环状RNA建库实验操作SOP.pdf",
    "翌圣CUT&tag实验之植物样本细胞核分离操作流程.pdf",
]

file_map = {}

for fname in target_files:
    src = docs_dir / fname
    dst = out_dir / fname
    if src.exists():
        shutil.copy2(str(src), str(dst))
        suffix = src.suffix.lower()
        ftype = "PDF" if suffix == ".pdf" else "DOCX"
        file_map[fname] = {"path": f"docs/{fname}", "type": ftype, "size": src.stat().st_size}
        print(f"Copied: {fname} ({ftype}, {src.stat().st_size} bytes)")
    else:
        print(f"NOT FOUND: {fname}")

with open(Path(__file__).parent / "ngs_file_map.json", "w", encoding="utf-8") as f:
    json.dump(file_map, f, ensure_ascii=False, indent=2)
print(f"\nDone! {len(file_map)} files copied.")
