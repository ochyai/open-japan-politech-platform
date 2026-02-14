import fs from "node:fs";
import path from "node:path";
import { prisma } from "@ojpp/db";

export async function seedMesoData() {
  // 1. CSVファイルを読み込む
  const csvPath = path.join(__dirname, "../../data/sbcm_latest.csv");
  const fileContent = fs.readFileSync(csvPath, "utf-8");
  
  // 2. 行ごとに分割
  const lines = fileContent.split("\n").slice(1); // 1行目はヘッダーなので飛ばす

  console.log(`🚀 Scanning physical telemetry for ${lines.length} blocks...`);

  for (const line of lines) {
    const columns = line.split(",");
    if (columns.length < 5) continue;

    // CSVの列に合わせてマッピング（例：0番目がコード、1番目が名前...）
    const [code, name, population, tax, mandatory, flux] = columns;

    await prisma.governanceBlock.upsert({
      where: { code: String(code) },
      update: {
        population: parseInt(population),
        productionSigma: BigInt(tax),
        maintenanceDelta: BigInt(mandatory),
        inflowFlux: BigInt(flux),
      },
      create: {
        code: String(code),
        name: String(name),
        population: parseInt(population),
        productionSigma: BigInt(tax),
        maintenanceDelta: BigInt(mandatory),
        inflowFlux: BigInt(flux),
      },
    });
  }

  console.log("✅ SBCM: All municipal circuits grounded.");
}
