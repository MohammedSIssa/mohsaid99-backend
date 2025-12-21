require("dotenv").config();
const xlsx = require("xlsx");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://mohamed:moh01234@localhost:5432/repairlogs",
});

function parseDDMMYYYY(value) {
  if (!value) return null;

  // Expect "DD/MM/YYYY"
  const [day, month, year] = value.split("/");

  if (!day || !month || !year) return null;

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

async function seed() {
  // 1. Read file
  const workbook = xlsx.readFile("./data.xlsx");

  // 2. Select first sheet
  const sheet = workbook.Sheets[workbook.SheetNames[2]];

  // 3. Convert to JSON
  const rows = xlsx.utils.sheet_to_json(sheet, {
    defval: null, // keep empty cells as null
    raw: false,
  });

  // rows = [{ name: "Apple", price: 1.22, created_at: "2025-09-01" }]

  // 4. Insert rows
  for (const row of rows) {
    // if (!parseDDMMYYYY(row.log_date)) break;
    await pool.query(
      `
      INSERT INTO repair_terms (term_num, repair_type_ar, repair_type_en, repair_desc_ar, repair_desc_en, uom, qty, service_cost)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        row.term_num,
        row.repair_type_ar,
        row.repair_type_en,
        row.repair_desc_ar,
        row.repair_desc_en,
        row.uom,
        row.qty,
        row.service_cost,
      ]
    );
  }

  console.log("✅ Seeding complete");
  await pool.end();
}

seed().catch(console.error);
