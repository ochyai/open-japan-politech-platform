import { prisma } from "@ojpp/db";

// ここに総務省のCSVデータ（一部）を貼り付けるイメージ
const RAW_CSV_DATA = `
01000,北海道,5139913,752046629,967922725,1153070407
13000,東京都,13911902,6345075503,2190609266,260821164
23000,愛知県,7542415,1389688897,1019241429,281055570
`;

export async function ingestSBCMData() {
  const lines = RAW_CSV_DATA.trim().split("\n");
  
  for (const line of lines) {
    const [code, name, pop, tax, mandatory, flux] = line.split(",");
    
    await prisma.governanceBlock.upsert({
      where: { code },
      update: {},
      create: {
        code,
        name,
        population: parseInt(pop),
        productionSigma: BigInt(tax),
        maintenanceDelta: BigInt(mandatory),
        inflowFlux: BigInt(flux),
      },
    });
  }
  console.log("SBCM: Physical Grounding Complete.");
}
