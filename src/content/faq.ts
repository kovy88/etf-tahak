import { typoDeep } from "@/lib/format";
import { N } from "./data";

export const faq = (emailEnabled: boolean) =>
  typoDeep({
    id: "faq",
    title: "Časté otázky",
    items: [
      {
        q: "Je to zdarma?",
        a: "Ano. Tahák i srovnání jsou zdarma a nepotřebujete platební kartu.",
      },
      {
        q: "Proč chcete e-mail?",
        a: emailEnabled
          ? "Pošleme na něj váš výpočet a odkaz na tahák. Odhlásit se můžete jedním klikem."
          : "Je to jediný údaj, který chceme. Adresu uložíme pro případné další informace o ETF. Zatím žádný e-mail neodesíláme.",
      },
      {
        q: "Zavolá mi někdo?",
        a: "Ne. Telefon se nezadává, nikdo vám nezavolá a žádný poradce se vám neozve.",
      },
      {
        q: "Je to investiční doporučení?",
        a: "Ne. Je to srovnání veřejných údajů a modelové výpočty. Žádné ETF nedoporučujeme a o investici rozhoduje každý sám.",
      },
      {
        q: "Jak často data aktualizujete?",
        a: `Teď platí data k ${N.dataDate}. Datum je u každého čísla. Pravidelnou aktualizaci zatím neslibujeme.`,
      },
    ],
  });
