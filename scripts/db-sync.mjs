/**
 * Creates or updates the database tables at deploy time, only when a Postgres database
 * is connected (DATABASE_URL). Without one (local builds, previews before the database
 * exists) it does nothing, so the build never fails on it.
 */
import { execSync } from "child_process";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || "";
if (!/^postgres(ql)?:\/\//.test(url)) {
  console.log("db-sync: no Postgres database connected, skipping");
  process.exit(0);
}
try {
  execSync("npx prisma db push --skip-generate", { stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
} catch (e) {
  console.error("db-sync: prisma db push failed", e?.message);
  process.exit(1);
}
