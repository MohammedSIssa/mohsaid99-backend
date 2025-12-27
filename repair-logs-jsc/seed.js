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
  const sheet = workbook.Sheets[workbook.SheetNames[3]];

  // 3. Convert to JSON
  const rows = xlsx.utils.sheet_to_json(sheet, {
    defval: null, // keep empty cells as null
    raw: false,
  });

  // 4. Insert rows
  for (const row of rows) {
    if (!parseDDMMYYYY(row.log_date)) break;
    await pool.query(
      `
      INSERT INTO logs (
      log_date,
      order_num, 
      vehicle_code, 
      vehicle_type_en, 
      vehicle_type_ar, 
      licence_number, 
      vehicle_model_ar, 
      vehicle_model_en,
      term_num,
      repair_desc_ar,
      repair_desc_en,
      unit,
      qty,
      unit_cost,
      repair_cost,
      total_cost
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `,
      [
        parseDDMMYYYY(row.log_date),
        row.order_num,
        row.vehicle_code,
        row.vehicle_type_en,
        row.vehicle_type_ar,
        row.licence_number,
        row.vehicle_model_ar,
        row.vehicle_model_en,
        row.term_num,
        row.repair_desc_ar,
        row.repair_desc_en,
        row.unit,
        row.qty,
        row.unit_cost,
        row.repair_cost,
        row.total_cost,
      ]
    );
  }

  console.log("✅ Seeding complete");
  await pool.end();
}

seed().catch(console.error);
