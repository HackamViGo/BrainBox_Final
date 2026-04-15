import os
import json
import datetime
import fnmatch

# ─── Token Counter ────────────────────────────────────────────────────────────
try:
    import tiktoken
    _enc = tiktoken.get_encoding("cl100k_base")
    def count_tokens(text: str) -> int:
        return len(_enc.encode(text))
    TOKEN_METHOD = "tiktoken / cl100k_base (точно)"
except ImportError:
    def count_tokens(text: str) -> int:
        return len(text) // 4
    TOKEN_METHOD = "апроксимация (chars ÷ 4)"

# ─── Настройки ────────────────────────────────────────────────────────────────
MAX_TOKENS_PER_PART = 100_000

BINARY_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg", ".ico", ".webp",
    ".tiff", ".raw", ".mp4", ".mp3", ".wav", ".ogg", ".avi", ".mov",
    ".mkv", ".flac", ".aac", ".pdf", ".doc", ".docx", ".xls", ".xlsx",
    ".ppt", ".pptx", ".zip", ".tar", ".gz", ".rar", ".7z", ".bz2",
    ".exe", ".dll", ".so", ".dylib", ".bin", ".img", ".iso",
    ".ttf", ".woff", ".woff2", ".eot", ".otf",
    ".pyc", ".pyo", ".pyd", ".class",
    ".db", ".sqlite", ".sqlite3",
    ".lock",
}

ALWAYS_SKIP_DIRS = {
    "node_modules", ".git", "__pycache__", ".venv", "venv", "env",
    "dist", "build", ".next", ".nuxt", ".svelte-kit", "out",
    "coverage", ".pytest_cache", ".mypy_cache", ".tox",
    "vendor", "bower_components", ".cache", "tmp", "temp",
    ".terraform", ".serverless", "target", "bin", "obj",
}

ALWAYS_SKIP_FILES = {
    ".DS_Store", "Thumbs.db", "desktop.ini",
    "*.min.js", "*.min.css", "*.map",
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "composer.lock",
}


# ─── Gitignore ────────────────────────────────────────────────────────────────
def load_gitignore_patterns(root: str) -> list[str]:
    path = os.path.join(root, ".gitignore")
    patterns = []
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    patterns.append(line)
    return patterns


def is_gitignored(abs_path: str, root: str, patterns: list[str]) -> bool:
    rel = os.path.relpath(abs_path, root).replace(os.sep, "/")
    name = os.path.basename(abs_path)
    for pat in patterns:
        clean = pat.rstrip("/")
        if fnmatch.fnmatch(rel, clean):
            return True
        if fnmatch.fnmatch(name, clean):
            return True
        # Проверява дали parent папка match-ва
        parts = rel.split("/")
        for i in range(1, len(parts)):
            if fnmatch.fnmatch("/".join(parts[:i]), clean):
                return True
    return False


def should_skip_file(name: str) -> bool:
    for pat in ALWAYS_SKIP_FILES:
        if fnmatch.fnmatch(name, pat):
            return True
    return False


# ─── Файлово четене ──────────────────────────────────────────────────────────
def is_binary(path: str) -> bool:
    ext = os.path.splitext(path)[1].lower()
    if ext in BINARY_EXTENSIONS:
        return True
    try:
        with open(path, "rb") as f:
            return b"\x00" in f.read(1024)
    except Exception:
        return True


def read_text(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            return f.read()
    except Exception as e:
        return f"[ГРЕШКА ПРИ ЧЕТЕНЕ: {e}]"


# ─── Изграждане на дървото ───────────────────────────────────────────────────
def build_tree(root: str, current: str, patterns: list[str], docs_dir: str) -> dict:
    tree = {}
    try:
        entries = sorted(os.scandir(current), key=lambda e: (e.is_file(), e.name.lower()))
    except PermissionError:
        return tree

    for entry in entries:
        abs_path = entry.path

        # Прескача docs/ самата папка
        if os.path.abspath(abs_path) == os.path.abspath(docs_dir):
            continue

        if entry.is_dir():
            if entry.name in ALWAYS_SKIP_DIRS:
                continue
            if is_gitignored(abs_path, root, patterns):
                continue
            subtree = build_tree(root, abs_path, patterns, docs_dir)
            tree[entry.name] = {
                "_type": "directory",
                "children": subtree,
            }

        else:
            if should_skip_file(entry.name):
                continue
            if is_gitignored(abs_path, root, patterns):
                continue

            size = os.path.getsize(abs_path)

            if is_binary(abs_path):
                tree[entry.name] = {
                    "_type": "binary",
                    "size_bytes": size,
                }
            else:
                content = read_text(abs_path)
                tree[entry.name] = {
                    "_type": "file",
                    "size_bytes": size,
                    "content": content,
                }
    return tree


def count_files_in_tree(tree: dict) -> int:
    total = 0
    for node in tree.values():
        t = node.get("_type")
        if t in ("file", "binary"):
            total += 1
        elif t == "directory":
            total += count_files_in_tree(node.get("children", {}))
    return total


# ─── Splitting ───────────────────────────────────────────────────────────────
def flatten_tree(tree: dict, prefix: str = "") -> list[tuple[str, dict]]:
    """Превръща nested дърво в [(path, node), ...]"""
    items = []
    for name, node in tree.items():
        path = f"{prefix}/{name}" if prefix else name
        if node.get("_type") == "directory":
            items.extend(flatten_tree(node.get("children", {}), path))
        else:
            items.append((path, node))
    return items


def rebuild_tree(flat: list[tuple[str, dict]]) -> dict:
    """Rebuild nested структура от flat списък."""
    tree = {}
    for path, node in flat:
        parts = path.replace("\\", "/").split("/")
        cur = tree
        for part in parts[:-1]:
            if part not in cur:
                cur[part] = {"_type": "directory", "children": {}}
            cur = cur[part]["children"]
        cur[parts[-1]] = node
    return tree


# ─── Запис ───────────────────────────────────────────────────────────────────
def save_parts(data: dict, docs_dir: str) -> list[tuple[str, int]]:
    flat = flatten_tree(data["project_tree"])

    # Базов overhead от metadata (без дървото)
    base = json.dumps({**data, "project_tree": {}}, ensure_ascii=False, indent=2)
    base_tokens = count_tokens(base)

    parts: list[list] = []
    current_part: list = []
    current_tokens = base_tokens

    for path, node in flat:
        node_tokens = count_tokens(json.dumps({path: node}, ensure_ascii=False))
        if current_part and current_tokens + node_tokens > MAX_TOKENS_PER_PART:
            parts.append(current_part)
            current_part = [(path, node)]
            current_tokens = base_tokens + node_tokens
        else:
            current_part.append((path, node))
            current_tokens += node_tokens

    if current_part:
        parts.append(current_part)

    total = len(parts)
    saved = []

    for i, chunk in enumerate(parts, 1):
        part_tree = rebuild_tree(chunk)
        part_data = {
            **data,
            "metadata": {
                **data["metadata"],
                "part": i,
                "total_parts": total,
                **({"note": f"Part {i}/{total}. За пълна картина зареди всички parts."} if total > 1 else {}),
            },
            "project_tree": part_tree,
        }

        filename = "project.json" if total == 1 else f"project_part{i}.json"
        out_path = os.path.join(docs_dir, filename)

        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(part_data, f, ensure_ascii=False, indent=2)

        tokens = count_tokens(json.dumps(part_data, ensure_ascii=False, indent=2))
        saved.append((filename, tokens))

    return saved, total


# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    docs_dir = os.path.dirname(os.path.abspath(__file__))
    root = os.path.dirname(docs_dir)

    print(f"\n{'═' * 58}")
    print(f"  📦  Project → JSON Export")
    print(f"{'═' * 58}")
    print(f"  Проект :  {root}")
    print(f"  Output :  {docs_dir}/")
    print(f"  Токени :  {TOKEN_METHOD}")
    print(f"  Лимит  :  {MAX_TOKENS_PER_PART:,} токена / файл")
    print(f"{'═' * 58}\n")

    patterns = load_gitignore_patterns(root)
    print(f"  📋  .gitignore — {len(patterns)} правила заредени")
    print(f"  🔍  Сканиране на проекта...")

    tree = build_tree(root, root, patterns, docs_dir)
    total_files = count_files_in_tree(tree)
    print(f"  📁  Намерени {total_files} файла\n")

    data = {
        "metadata": {
            "generated_at": datetime.datetime.now().isoformat(),
            "project_root": root,
            "total_files": total_files,
            "token_limit_per_part": MAX_TOKENS_PER_PART,
            "token_method": TOKEN_METHOD,
            "purpose": "AI codebase context — generated by export_project.py",
        },
        "project_tree": tree,
    }

    # Изчисли общия брой токени преди splitting
    raw = json.dumps(data, ensure_ascii=False, indent=2)
    total_tokens = count_tokens(raw)
    print(f"  🔢  Общо токени: ~{total_tokens:,}")

    if total_tokens > MAX_TOKENS_PER_PART:
        parts_needed = (total_tokens // MAX_TOKENS_PER_PART) + 1
        print(f"  ✂️   Разрязване на ~{parts_needed} части...\n")
    else:
        print(f"  ✅  В рамките на лимита — 1 файл\n")

    print(f"  💾  Записване...\n")
    saved, num_parts = save_parts(data, docs_dir)

    for fname, ftokens in saved:
        bar_len = int((ftokens / MAX_TOKENS_PER_PART) * 20)
        bar = "█" * bar_len + "░" * (20 - bar_len)
        print(f"     ✅  {fname}")
        print(f"         [{bar}] ~{ftokens:,} / {MAX_TOKENS_PER_PART:,} токена")
        print()

    print(f"{'═' * 58}")
    if num_parts == 1:
        print(f"  🎉  Готово! → docs/project.json")
    else:
        print(f"  🎉  Готово! → {num_parts} файла в docs/")
    print(f"{'═' * 58}\n")


if __name__ == "__main__":
    main()
