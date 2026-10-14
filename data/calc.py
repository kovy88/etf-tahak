"""Výpočet kalkulačky poplatků. Stejný vzorec musí použít src/lib/calc.ts."""


def project(monthly: float, years: int, gross: float, ter: float, entry: float = 0.0) -> float:
    """Hodnota portfolia po `years` letech.

    gross, ter, entry jsou desetinná čísla (0.06 = 6 %).
    Čistý roční výnos = gross - ter. Měsíční sazba = (1 + čistý)^(1/12) - 1.
    Vklad na začátku měsíce, vstupní poplatek ho krátí, pak připíše měsíční úrok.
    """
    net = gross - ter
    m = (1 + net) ** (1 / 12) - 1
    balance = 0.0
    for _ in range(years * 12):
        balance = (balance + monthly * (1 - entry)) * (1 + m)
    return balance


def scenario(monthly: float, years: int, gross: float, ter: float, entry: float = 0.0) -> dict:
    final = project(monthly, years, gross, ter, entry)
    free = project(monthly, years, gross, 0.0, 0.0)
    return {
        "final": final,
        "deposited": monthly * years * 12,
        "fee_cost": free - final,
    }
