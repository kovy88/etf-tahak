"""Zmenšené fonty pro web (PLAN §16, LCP): Fraunces 400/600 a IBM Plex Mono 400/600.

Fontsource dělí každý řez na „latin“ a „latin-ext“ (dohromady ~110 kB přednačtených fontů).
Tady z obou souborů vezmeme jen znaky, které čeština na stránce potřebuje, variabilní Fraunces
zafixujeme na použité váhy a sloučíme je do jednoho woff2 na řez (~4× menší).

Spuštění (z kořene repa): uv run --project data python data/subset_fonts.py
Výstup: src/app/fonts/*.woff2 (commitují se). Skript selže, když v textech chybí glyf.
"""

import json
import re
import tempfile
from pathlib import Path

from fontTools import subset
from fontTools.merge import Merger
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[1]
NM = ROOT / "node_modules"
OUT = ROOT / "src" / "app" / "fonts"

FRAUNCES = NM / "@fontsource-variable" / "fraunces" / "files" / "fraunces-{sub}-wght-normal.woff2"
MONO = NM / "@fontsource" / "ibm-plex-mono" / "files" / "ibm-plex-mono-{sub}-{w}-normal.woff2"

# Celá Latin-1 + typografie z latin, z latin-ext jen čeština a slovenština (a pár běžných jmen).
LATIN = "".join(chr(c) for c in range(0x20, 0x7F)) + "".join(chr(c) for c in range(0xA0, 0x100))
EXT = "ČčĎďĚěŇňŘřŠšŤťŮůŽžĽľĹĺŔŕŐőŰűŁłŚśŹźŻżĆćŃńĄąĘę"
PUNCT = "„“‚‘’”–—…•·×€‰←→↓↑−≈≤≥†‹›  ‑"
TEXT = LATIN + EXT + PUNCT

# řezy: název souboru → (zdroj se zástupným {sub}, instance variabilní osy nebo None)
FONTS = {
    "fraunces-400": (str(FRAUNCES), {"wght": 400}),
    "fraunces-600": (str(FRAUNCES), {"wght": 600}),
    "plex-mono-400": (str(MONO).replace("{w}", "400"), None),
    "plex-mono-600": (str(MONO).replace("{w}", "600"), None),
}


def subset_to(src: Path, dst: Path, axes: dict | None) -> None:
    font = TTFont(src)
    if axes:
        font = instancer.instantiateVariableFont(font, axes)
    opts = subset.Options()
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    s = subset.Subsetter(opts)
    s.populate(text=TEXT)
    s.subset(font)
    font.flavor = None
    font.save(dst)


def build(name: str, pattern: str, axes: dict | None, tmp: Path) -> Path:
    parts = []
    for sub in ("latin", "latin-ext"):
        p = tmp / f"{name}-{sub}.ttf"
        subset_to(Path(pattern.format(sub=sub)), p, axes)
        parts.append(str(p))
    merged = Merger().merge(parts)
    merged.flavor = "woff2"
    out = OUT / f"{name}.woff2"
    merged.save(out)
    return out


def used_chars() -> set[str]:
    """Znaky ze všech textů a dat stránky (bez tiskové verze, ta má vlastní PDF)."""
    chars: set[str] = set()
    for p in (ROOT / "src" / "content").glob("*.ts"):
        for m in re.finditer(r'"((?:[^"\\]|\\.)*)"|`([^`]*)`', p.read_text("utf8")):
            chars.update(m.group(1) or m.group(2) or "")
    for p in (ROOT / "src" / "data").glob("*.json"):
        chars.update(json.dumps(json.loads(p.read_text("utf8")), ensure_ascii=False))
    return {c for c in chars if c.isprintable() and c not in "\n\t"}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as t:
        for name, (pattern, axes) in FONTS.items():
            out = build(name, pattern, axes, Path(t))
            cmap = TTFont(out).getBestCmap()
            # chybějící glyf vadí, jen když ho měl původní font (jinak i dnes kreslí záložní písmo)
            orig: set[int] = set()
            for sub in ("latin", "latin-ext"):
                orig.update(TTFont(pattern.format(sub=sub)).getBestCmap())
            missing = sorted(c for c in used_chars() if ord(c) in orig and ord(c) not in cmap)
            print(f"{out.relative_to(ROOT)}: {out.stat().st_size / 1024:.1f} kB")
            if missing:
                raise SystemExit(f"{name}: chybí glyfy {''.join(missing)!r}")


if __name__ == "__main__":
    main()
