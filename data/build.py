"""Build dat: ETF a fakta ze source YAML -> src/data/*.json.

Spuštění: uv run python build.py
"""

from __future__ import annotations

import json
import re
import sys
from datetime import UTC, date, datetime
from pathlib import Path
from typing import Any

import httpx
import yaml
from pydantic import BaseModel, ConfigDict, model_validator

from calc import scenario

ROOT = Path(__file__).resolve().parent.parent
DATA = Path(__file__).resolve().parent
OUT = ROOT / "src" / "data"
RAW_CNB = DATA / "raw" / "cnb"

CNB_URL = (
    "https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/"
    "kurzy-devizoveho-trhu/denni_kurz.txt?date={d}"
)
END = date(2026, 9, 30)
HORIZONS = (1, 5, 10)
DEFAULTS = {"monthly_czk": 3000, "years": 25, "gross_pct": 6.0}
AMOUNTS = (1000, 3000, 5000, 10000)
HORIZON_CHOICES = (10, 20, 25, 30)
GROSS_CHOICES = (4.0, 6.0, 8.0)


class Sourced(BaseModel):
    model_config = ConfigDict(extra="forbid")
    value: Any
    source: str | None
    as_of: date
    note: str | None = None
    verified: bool = True

    @model_validator(mode="after")
    def need_source(self) -> Sourced:
        if self.value is not None and not self.source:
            raise ValueError("hodnota bez zdroje")
        return self


class EtfSource(BaseModel):
    model_config = ConfigDict(extra="forbid")
    ticker: str
    name: str
    issuer: str
    exchange: Sourced
    index: Sourced
    category: str
    ter_pct: Sourced
    aum_usd: Sourced
    holdings: Sourced
    inception: Sourced
    dividend_yield_pct: Sourced
    return_1y_pct: Sourced
    return_5y_pct: Sourced
    return_10y_pct: Sourced

    @model_validator(mode="after")
    def ranges(self) -> EtfSource:
        if not 0 < self.ter_pct.value < 1:
            raise ValueError(f"{self.ticker}: TER mimo rozsah")
        if self.exchange.value != "NYSE Arca":
            raise ValueError(f"{self.ticker}: není na NYSE Arca")
        for h in HORIZONS:
            if not -30 < getattr(self, f"return_{h}y_pct").value < 60:
                raise ValueError(f"{self.ticker}: výnos {h}y mimo rozsah")
        return self


class UcitsFund(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    issuer: str
    type: str
    isin: Sourced
    ter_pct: Sourced
    distribution: Sourced
    domicile: Sourced
    index: Sourced
    listings: dict[str, str | None]
    aum_usd: Sourced | None = None
    launch: Sourced | None = None
    note: str | None = None

    @model_validator(mode="after")
    def isin_ok(self) -> UcitsFund:
        if not re.fullmatch(r"[A-Z]{2}[A-Z0-9]{9}\d", self.isin.value):
            raise ValueError(f"neplatný ISIN {self.isin.value}")
        if not 0 < self.ter_pct.value < 1:
            raise ValueError("TER mimo rozsah")
        return self


class Twin(BaseModel):
    model_config = ConfigDict(extra="forbid")
    match: str
    funds: list[str]
    note: str


def fetch_fx(d: date) -> float:
    """Kurz USD/CZK ČNB k datu. Surový soubor se ukládá do data/raw/cnb/."""
    path = RAW_CNB / f"{d.isoformat()}.txt"
    if not path.exists():
        r = httpx.get(CNB_URL.format(d=d.strftime("%d.%m.%Y")), timeout=30)
        r.raise_for_status()
        path.write_text(r.text, encoding="utf-8")
    for line in path.read_text(encoding="utf-8").splitlines():
        parts = line.split("|")
        if len(parts) == 5 and parts[3] == "USD":
            return float(parts[4].replace(",", ".")) / float(parts[2])
    raise ValueError(f"USD v kurzu ČNB pro {d} nenalezeno")


def load_yaml(name: str) -> Any:
    return yaml.safe_load((DATA / name).read_text(encoding="utf-8"))


def czk_return(usd_pct: float, years: int, fx_start: float, fx_end: float) -> float:
    cum = (1 + usd_pct / 100) ** years * fx_end / fx_start
    return (cum ** (1 / years) - 1) * 100


def dump(obj: Any, name: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def validate_facts(obj: Any) -> None:
    """I fakta mimo ETF musí mít zdroj a datum; nechybějící klíč nesmí obejít kontrolu."""
    if isinstance(obj, dict):
        if "value" in obj:
            Sourced.model_validate(obj)
        else:
            for value in obj.values():
                validate_facts(value)
    elif isinstance(obj, list):
        for value in obj:
            validate_facts(value)


def build(write: bool = True) -> dict[str, Any]:
    fx_end = fetch_fx(END)
    fx_start = {h: fetch_fx(date(END.year - h, 9, 30)) for h in HORIZONS}
    fx_src = {h: CNB_URL.format(d=date(END.year - h, 9, 30).strftime("%d.%m.%Y")) for h in HORIZONS}

    etfs_raw = load_yaml("etfs.source.yaml")
    ucits_raw = load_yaml("ucits.source.yaml")
    facts_raw = load_yaml("facts.source.yaml")
    validate_facts(facts_raw)

    etfs = {t: EtfSource(**v) for t, v in etfs_raw.items()}
    funds = {k: UcitsFund(**v) for k, v in ucits_raw["funds"].items()}
    twins = {t: Twin(**v) for t, v in ucits_raw["twins"].items()}
    missing = set(etfs) - set(twins)
    if missing:
        raise ValueError(f"chybí dvojčata pro {missing}")

    etf_out = []
    for t, e in etfs.items():
        d = e.model_dump(mode="json")
        d["returns_czk_pct"] = {
            f"{h}y": {
                "value": round(
                    czk_return(getattr(e, f"return_{h}y_pct").value, h, fx_start[h], fx_end), 2
                ),
                "source": fx_src[h],
                "as_of": END.isoformat(),
                "note": (
                    "Vlastní přepočet: (1 + výnos v USD)^n × kurz ČNB 30. 9. 2026 / kurz ČNB "
                    f"30. 9. {END.year - h}, pak anualizováno. Kurzy: {fx_start[h]} → {fx_end}."
                ),
            }
            for h in HORIZONS
        }
        tw = twins[t]
        d["us_retail_buyable"] = False
        d["ucits_twin"] = {
            "match": tw.match,
            "note": tw.note,
            "funds": [{"id": k, **funds[k].model_dump(mode="json")} for k in tw.funds],
        }
        etf_out.append(d)

    # Příklad: nejlevnější S&P 500 UCITS (ověřený) vs. průměrný akciový fond (ESMA)
    sp = [
        (k, f)
        for k, f in funds.items()
        if f.index.value == "S&P 500 Index" and f.type == "UCITS ETF"
    ]
    cheapest_key, cheapest = min(sp, key=lambda kf: kf[1].ter_pct.value)
    fc = facts_raw["fund_costs"]
    avg_ter = fc["avg_equity_fund_ter_pct"]["value"]
    avg_entry = 0.0

    def ex(monthly: int, years: int, gross: float) -> dict:
        g = gross / 100
        a = scenario(monthly, years, g, cheapest.ter_pct.value / 100)
        b = scenario(monthly, years, g, avg_ter / 100, avg_entry / 100)
        return {
            "monthly_czk": monthly,
            "years": years,
            "gross_pct": gross,
            "deposited_czk": round(a["deposited"]),
            "etf_final_czk": round(a["final"]),
            "avg_fund_final_czk": round(b["final"]),
            "difference_czk": round(a["final"] - b["final"]),
            "etf_fee_cost_czk": round(a["fee_cost"]),
            "avg_fund_fee_cost_czk": round(b["fee_cost"]),
        }

    examples = {
        "default": ex(DEFAULTS["monthly_czk"], DEFAULTS["years"], DEFAULTS["gross_pct"]),
        "by_amount": [ex(m, DEFAULTS["years"], DEFAULTS["gross_pct"]) for m in AMOUNTS],
        "by_horizon": [
            ex(DEFAULTS["monthly_czk"], y, DEFAULTS["gross_pct"]) for y in HORIZON_CHOICES
        ],
        "by_gross": [ex(DEFAULTS["monthly_czk"], DEFAULTS["years"], g) for g in GROSS_CHOICES],
        "inputs": {
            "etf": {
                "id": cheapest_key,
                "name": cheapest.name,
                "ter_pct": cheapest.ter_pct.model_dump(mode="json"),
                "note": "Nejlevnější S&P 500 UCITS ETF mezi ověřenými (CSPX, VUAA, SPYL). Jiné emitenty jsem neprošel.",
            },
            "avg_fund": {
                "label": "Průměrný akciový fond v EU (ESMA)",
                "ter_pct": facts_raw["fund_costs"]["avg_equity_fund_ter_pct"],
                "entry_fee_pct": {
                    "value": avg_entry,
                    "source": "Předpoklad, nedoloženo (viz poznámka)",
                    "as_of": "2026-10-14",
                    "verified": False,
                    "note": "Vstupní poplatek průměrného fondu zatím není doložen, počítá se 0 %. Rozdíl je proto spíš podhodnocený.",
                },
            },
            "assumption": facts_raw["assumptions"]["gross_return_pct"],
        },
        "method": (
            "Vklad na začátku měsíce, čistý roční výnos = hrubý − TER, měsíční sazba "
            "(1 + čistý)^(1/12) − 1. Vstupní poplatek krátí každý vklad. Modelový výpočet."
        ),
        "formula_ref": "data/calc.py, shodně src/lib/calc.ts",
    }

    meta = {
        "generated_at": datetime.now(UTC).isoformat(timespec="seconds"),
        "data_as_of": END.isoformat(),
        "fx_usd_czk_end": {
            "value": fx_end,
            "source": CNB_URL.format(d="30.09.2026"),
            "as_of": END.isoformat(),
        },
        "fx_usd_czk_start": {
            f"{h}y": {
                "value": round(fx_start[h], 3),
                "source": fx_src[h],
                "as_of": date(END.year - h, 9, 30).isoformat(),
            }
            for h in HORIZONS
        },
    }
    facts = {k: v for k, v in facts_raw.items()}
    if write:
        dump({"meta": meta, "etfs": etf_out}, "etfs.json")
        dump(facts, "facts.json")
        dump(examples, "examples.json")
    return {"etfs": etf_out, "examples": examples, "facts": facts, "meta": meta}


def report(res: dict[str, Any]) -> None:
    print(f"{'ETF':5} {'TER':>6} {'1y USD':>7} {'5y USD':>7} {'5y CZK':>7} {'10y CZK':>8}  twin")
    for e in res["etfs"]:
        r = e["returns_czk_pct"]
        print(
            f"{e['ticker']:5} {e['ter_pct']['value']:6.4f} {e['return_1y_pct']['value']:7.2f} "
            f"{e['return_5y_pct']['value']:7.2f} {r['5y']['value']:7.2f} {r['10y']['value']:8.2f}  "
            f"{e['ucits_twin']['match']}: {','.join(f['id'] for f in e['ucits_twin']['funds']) or '-'}"
        )
    print("\nPříklad:", json.dumps(res["examples"]["default"], ensure_ascii=False))
    print("\nNeověřeno (verified: false):")

    def walk(o: Any, path: str) -> None:
        if isinstance(o, dict):
            if o.get("verified") is False:
                print(f"  {path}: {o.get('note', '')[:110]}")
            for k, v in o.items():
                walk(v, f"{path}.{k}" if path else k)
        elif isinstance(o, list):
            for i, v in enumerate(o):
                walk(v, f"{path}[{i}]")

    walk(res["etfs"], "etfs")
    walk(res["facts"], "facts")
    walk(res["examples"], "examples")


if __name__ == "__main__":
    try:
        report(build())
    except Exception as exc:
        print(f"build selhal: {exc}", file=sys.stderr)
        raise
