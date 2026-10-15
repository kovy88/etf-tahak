import "server-only";
import { resolve4, resolveMx } from "node:dns/promises";

const TIMEOUT_MS = 1500;

/**
 * Má doména MX záznam (nebo aspoň A záznam)? Při timeoutu a neznámé chybě vrací true,
 * aby špatné DNS nikdy neblokovalo skutečného člověka. false jen při jistotě, že doména neexistuje.
 */
export async function domainCanReceiveMail(domain: string): Promise<boolean> {
  const lookup = async (): Promise<boolean> => {
    try {
      const mx = await resolveMx(domain);
      // Null MX (RFC 7505) výslovně říká, že doména poštu nepřijímá; A záznam to nepřebije.
      if (mx.length > 0) return mx.some((record) => record.exchange !== "" && record.exchange !== ".");
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      if (code !== "ENODATA" && code !== "ENOTFOUND") return true;
    }
    try {
      return (await resolve4(domain)).length > 0;
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      return code !== "ENODATA" && code !== "ENOTFOUND";
    }
  };
  const timeout = new Promise<boolean>((r) => setTimeout(() => r(true), TIMEOUT_MS));
  return Promise.race([lookup(), timeout]);
}
