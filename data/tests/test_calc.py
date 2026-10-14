import json
from pathlib import Path

import pytest

from calc import scenario

CASES = json.loads((Path(__file__).parent / "calc_cases.json").read_text(encoding="utf-8"))


@pytest.mark.parametrize("c", CASES["cases"], ids=lambda c: c["name"])
def test_case(c):
    s = scenario(c["monthly"], c["years"], c["gross"], c["ter"], c["entry"])
    for k, v in c["expected"].items():
        assert s[k] == pytest.approx(v, abs=CASES["tolerance_czk"]), k


def test_handchecked_values():
    by = {c["name"]: c["expected"] for c in CASES["cases"]}
    assert by["nulový výnos, bez poplatků"]["final"] == 12000
    assert by["vstupní poplatek 5 % bez výnosu"]["final"] == 11400
    assert by["čistý roční výnos odpovídající měsíční sazbě 1 %"]["final"] == pytest.approx(
        1000 * 1.01 * (1.01**12 - 1) / 0.01, abs=0.01
    )
    assert by["výnos shodný s TER (čistý 0 %)"]["final"] == 24000


def test_fees_never_help():
    low = scenario(3000, 25, 0.06, 0.0003)["final"]
    high = scenario(3000, 25, 0.06, 0.0146)["final"]
    assert low > high
