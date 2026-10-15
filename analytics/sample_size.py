# /// script
# requires-python = ">=3.12"
# dependencies = ["statsmodels>=0.14"]
# ///
"""Velikost vzorku pro 3 A/B hypotézy z README (PLAN §18).

Dvouvýběrový test podílů (Cohenovo h), oboustranně, alfa 0,05, síla 0,8.
Základní konverze = odhad z PLAN §17 (9 % leadů na unikátní návštěvu landing page).

Spuštění: uv run analytics/sample_size.py
"""

import math

from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

BASE = 0.09
ALPHA = 0.05
POWER = 0.8

# hypotéza → očekávaný relativní nárůst (spodní hranice z README, ať test nepodceníme)
HYPOTHESES = {
    "H1 hloubka gate (zamčeno vs. vše zdarma)": 0.30,
    "H2 interaktivní vs. statický hero": 0.15,
    "H3 CTA „Stáhnout tahák zdarma“ vs. „Chci tahák zdarma“": 0.05,
}


def n_per_variant(base: float, lift: float) -> int:
    h = proportion_effectsize(base * (1 + lift), base)
    n = NormalIndPower().solve_power(
        effect_size=h, alpha=ALPHA, power=POWER, alternative="two-sided"
    )
    return math.ceil(n)


def main() -> None:
    print(f"Základní konverze {BASE:.0%}, alfa {ALPHA}, síla {POWER}")
    for name, lift in HYPOTHESES.items():
        n = n_per_variant(BASE, lift)
        print(f"{name}: +{lift:.0%} relativně → {n:,} návštěv na variantu".replace(",", " "))
    print(
        "Citlivost (H1 +30 %): "
        + ", ".join(
            f"{b:.0%} → {n_per_variant(b, 0.30):,}".replace(",", " ") for b in (0.05, 0.09, 0.14)
        )
    )


if __name__ == "__main__":
    main()
