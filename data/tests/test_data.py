import json
from datetime import date
from pathlib import Path

import pytest

import build
from calc import scenario

OUT = Path(__file__).resolve().parents[2] / "src" / "data"
TICKERS = {"VOO", "SPY", "IVV", "VTI", "VT", "VEA", "VWO", "SCHD", "VYM", "VUG", "AGG", "GLD"}


@pytest.fixture(scope="module")
def res():
    return build.build(write=False)


def sourced(o, path=""):
    """Všechny dict s klíčem value a nenulovou hodnotou musí mít source a as_of."""
    if isinstance(o, dict):
        if "value" in o and "as_of" in o:
            yield path, o
        for k, v in o.items():
            yield from sourced(v, f"{path}.{k}")
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from sourced(v, f"{path}[{i}]")


def test_every_value_has_source_and_date(res):
    n = 0
    for blob in (res["etfs"], res["facts"], res["examples"]):
        for path, o in sourced(blob):
            n += 1
            date.fromisoformat(str(o["as_of"]))
            if o["value"] is not None:
                assert o["source"], f"{path}: chybí source"
    assert n > 200


def test_all_twelve_etfs(res):
    assert {e["ticker"] for e in res["etfs"]} == TICKERS


def test_ter_and_ranges(res):
    for e in res["etfs"]:
        assert 0 < e["ter_pct"]["value"] < 1, e["ticker"]
        assert e["exchange"]["value"] == "NYSE Arca"


def test_fx_exists_and_plausible(res):
    fx = res["meta"]["fx_usd_czk_end"]["value"]
    assert 15 < fx < 35
    for d in ("2026-09-30", "2025-09-30", "2021-09-30", "2016-09-30"):
        assert (build.RAW_CNB / f"{d}.txt").exists()


def test_czk_return_formula():
    # bez změny kurzu je CZK výnos stejný jako USD
    assert build.czk_return(10.0, 5, 22.0, 22.0) == pytest.approx(10.0)
    # kurz klesl o 10 % za 1 rok: (1,1 × 0,9) − 1 = −1 %
    assert build.czk_return(10.0, 1, 20.0, 18.0) == pytest.approx(-1.0)


def test_czk_returns_present(res):
    for e in res["etfs"]:
        assert set(e["returns_czk_pct"]) == {"1y", "5y", "10y"}


def test_twins_resolved_and_isin(res):
    for e in res["etfs"]:
        t = e["ucits_twin"]
        assert t["match"] in {"exact", "similar", "none"}
        assert (t["match"] == "none") == (not t["funds"])
        for f in t["funds"]:
            assert len(f["isin"]["value"]) == 12


def test_example_matches_calc(res):
    d = res["examples"]["default"]
    inp = res["examples"]["inputs"]
    a = scenario(
        d["monthly_czk"], d["years"], d["gross_pct"] / 100, inp["etf"]["ter_pct"]["value"] / 100
    )
    b = scenario(
        d["monthly_czk"],
        d["years"],
        d["gross_pct"] / 100,
        inp["avg_fund"]["ter_pct"]["value"] / 100,
    )
    assert d["etf_final_czk"] == round(a["final"])
    assert d["avg_fund_final_czk"] == round(b["final"])
    assert d["difference_czk"] == round(a["final"] - b["final"])
    assert d["difference_czk"] > 0
    assert d["deposited_czk"] == 3000 * 25 * 12


def test_example_defaults_are_plan_defaults(res):
    d = res["examples"]["default"]
    assert (d["monthly_czk"], d["years"], d["gross_pct"]) == (3000, 25, 6.0)


def test_json_written_and_valid(res):
    for name in ("etfs.json", "facts.json", "examples.json"):
        json.loads((OUT / name).read_text(encoding="utf-8"))
