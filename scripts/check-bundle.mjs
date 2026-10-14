// Kontrola, že tajné klíče a jejich názvy nejsou v klientském bundlu (.next/static). Spustit po `npm run build`.
import fs from "node:fs";
import path from "node:path";

const root = ".next/static";
const forbidden = ["SUPABASE_SERVICE_ROLE_KEY", "service_role", "RESEND_API_KEY", "SUPABASE_URL"];
// hodnoty z .env.local (pokud existují) se hledají také
const values = [];
if (fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
    const m = /^(SUPABASE_SERVICE_ROLE_KEY|RESEND_API_KEY)=(.+)$/.exec(line);
    if (m && m[2].length > 12) values.push(m[2].replace(/^"|"$/g, ""));
  }
}
function* walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) yield* walk(p);
    else if (/\.(js|css|html|json|map)$/.test(f.name)) yield p;
  }
}
const hits = [];
let files = 0;
for (const f of walk(root)) {
  files++;
  const t = fs.readFileSync(f, "utf8");
  for (const w of forbidden) if (t.includes(w)) hits.push(`${f}: obsahuje „${w}“`);
  for (const v of values) if (t.includes(v)) hits.push(`${f}: obsahuje hodnotu klíče z .env.local`);
}
console.log(`Zkontrolováno ${files} souborů v ${root}, hodnot z .env.local: ${values.length}`);
if (hits.length) {
  console.error(hits.join("\n"));
  process.exit(1);
}
console.log("OK: v klientském bundlu nejsou žádné tajné klíče.");
