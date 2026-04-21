import os
import json
import subprocess
from datetime import date
from openai import OpenAI

# ── GitHub Models API клиент ──────────────────────────────────────────
client = OpenAI(
    base_url="https://models.github.ai/inference",
    api_key=os.environ["GITHUB_TOKEN"],
)
MODEL = "openai/gpt-4o-mini"  # Low tier = 150 req/ден безплатно

# ── Mapping: source файл → doc файл ──────────────────────────────────
DOC_MAP = {
    # Screens
    "apps/web-app/screens/Dashboard.tsx":  "docs/screens/dashboard.md",
    "apps/web-app/screens/Library.tsx":    "docs/screens/library.md",
    "apps/web-app/screens/Prompts.tsx":    "docs/screens/prompts.md",
    "apps/web-app/screens/AINexus.tsx":    "docs/screens/ai-nexus.md",
    "apps/web-app/screens/Workspace.tsx":  "docs/screens/workspace.md",
    "apps/web-app/screens/MindGraph.tsx":  "docs/screens/mind-graph.md",
    "apps/web-app/screens/Archive.tsx":    "docs/screens/archive.md",
    "apps/web-app/screens/Settings.tsx":   "docs/screens/settings.md",
    "apps/web-app/screens/Identity.tsx":   "docs/screens/identity.md",
    "apps/web-app/screens/Extension.tsx":  "docs/screens/extension.md",
    "apps/web-app/screens/Login.tsx":      "docs/screens/login.md",
    # Components
    "packages/ui/src/NeuralField.tsx":         "docs/components/neural-field.md",
    "packages/ui/src/AmbientLight.tsx":        "docs/components/ambient-light.md",
    "apps/web-app/components/Sidebar.tsx":             "docs/components/sidebar.md",
    "apps/web-app/components/NewChatModal.tsx":        "docs/components/new-chat-modal.md",
    "apps/web-app/components/IconPicker.tsx":          "docs/components/icon-picker.md",
    # Stores
    "apps/web-app/store/useAppStore.ts":       "docs/stores/use-app-store.md",
    "apps/web-app/store/useLibraryStore.ts":   "docs/stores/use-library-store.md",
    "apps/web-app/store/useAINexusStore.ts":   "docs/stores/use-ai-nexus-store.md",
    "apps/web-app/store/useExtensionStore.ts": "docs/stores/use-extension-store.md",
    # Architecture
    "apps/web-app/actions/auth.ts":            "docs/architecture/AUTH.md",
    # Extension
    "apps/extension/src/auth-bridge.ts":            "docs/extension/auth-bridge.md",
    "apps/extension/src/context-menus.ts":          "docs/extension/context-menus.md",
    "apps/extension/src/sync-manager.ts":           "docs/extension/sync-manager.md",
    "apps/extension/src/content/adapters/base.adapter.ts": "docs/extension/platform-adapters.md",
}

# Файлове, които тригерват обновяване на KNOWLEDGE_GRAPH
GRAPH_TRIGGERS = {
    "apps/web-app/store/useLibraryStore.ts",
    "apps/web-app/store/useAppStore.ts",
    "apps/web-app/screens/Library.tsx",
    "apps/extension/src/sync-manager.ts",
}

def get_diff(filepath: str) -> str:
    result = subprocess.run(
        ["git", "diff", "HEAD~1", "HEAD", "--", filepath],
        capture_output=True, text=True
    )
    return result.stdout.strip()

def update_doc(source_file: str, doc_file: str, diff: str) -> bool:
    if not os.path.exists(doc_file):
        print(f"⚠️  Doc не съществува: {doc_file} — пропускам")
        return False
    if not diff:
        print(f"ℹ️  Без реален diff за: {source_file}")
        return False

    with open(doc_file, "r", encoding="utf-8") as f:
        current_doc = f.read()

    print(f"🤖 Обновявам: {doc_file}")

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": f"""Ти си документационен асистент за BrainBox — AI chat management platform.
Обновявай САМО секциите засегнати от git diff-а.
Запазвай точната структура на шаблона (Purpose, UI Structure, State, User Flows, Known Issues, Placeholders).
Обновявай 'Last Updated' на днешна дата: {date.today()}.
Отговаряй САМО с пълния обновен Markdown документ — без обяснения, без markdown code blocks."""
                },
                {
                    "role": "user",
                    "content": f"""Source файл: {source_file}

=== Текущ документ ===
{current_doc}

=== Git diff (промените) ===
{diff[:3000]}

Обнови документацията спрямо промените в diff-а."""
                }
            ],
            max_tokens=2000,
            temperature=0.2,
        )

        updated = response.choices[0].message.content.strip()
        with open(doc_file, "w", encoding="utf-8") as f:
            f.write(updated)
        print(f"✅ Обновен: {doc_file}")
        return True

    except Exception as e:
        print(f"❌ Грешка при {doc_file}: {e}")
        return False

def update_knowledge_graph(changed_files: list[str]) -> None:
    graph_path = "docs/KNOWLEDGE_GRAPH.json"
    if not os.path.exists(graph_path):
        print("⚠️  KNOWLEDGE_GRAPH.json не е намерен")
        return

    with open(graph_path, "r", encoding="utf-8") as f:
        graph = json.load(f)

    # Изпращаме само relationships — пести токени
    relationships = graph.get("relationships", [])

    print("🕸️  Обновявам KNOWLEDGE_GRAPH.json...")

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": """Ти обновяваш relationships секцията на KNOWLEDGE_GRAPH.json за BrainBox.
Обновявай само засегнатите relationships.
Връщай САМО валиден JSON масив — без обяснения."""
                },
                {
                    "role": "user",
                    "content": f"""Текущи relationships:
{json.dumps(relationships, indent=2, ensure_ascii=False)[:2500]}

Променени файлове: {changed_files}

Обнови relationships ако промените засягат зависимостите между файловете."""
                }
            ],
            max_tokens=1500,
            temperature=0.1,
        )

        raw = response.choices[0].message.content.strip()
        # Почисти markdown code block ако има
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        updated_relationships = json.loads(raw)
        graph["relationships"] = updated_relationships
        graph["metadata"]["version"] = f"2.0.{date.today().strftime('%Y%m%d')}"

        with open(graph_path, "w", encoding="utf-8") as f:
            json.dump(graph, f, indent=2, ensure_ascii=False)
        print("✅ KNOWLEDGE_GRAPH.json обновен")

    except Exception as e:
        print(f"❌ Грешка при graph update: {e}")

# ── Main ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    raw_files = os.environ.get("CHANGED_FILES", "")
    changed_files = [f for f in raw_files.split("|") if f.strip()]

    if not changed_files:
        print("ℹ️  Няма променени файлове — нищо за правене")
        exit(0)

    print(f"📋 Открити промени в {len(changed_files)} файл(а):")
    for f in changed_files:
        print(f"   - {f}")

    # Обнови doc файловете
    updated_count = 0
    for source_file in changed_files:
        doc_file = DOC_MAP.get(source_file)
        if doc_file:
            diff = get_diff(source_file)
            if update_doc(source_file, doc_file, diff):
                updated_count += 1
        else:
            print(f"ℹ️  Няма mapping за: {source_file}")

    # Обнови graph ако трябва
    graph_relevant = [f for f in changed_files if f in GRAPH_TRIGGERS]
    if graph_relevant:
        update_knowledge_graph(graph_relevant)

    print(f"\n🎉 Готово! Обновени {updated_count} документа.")