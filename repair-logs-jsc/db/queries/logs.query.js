const db = require("../pool");

async function getLogs() {
  const { rows } = await db.query("SELECT * FROM public.logs");

  return rows;
}

async function getLogById(id) {
  const { rows } = await db.query("SELECT * FROM public.logs WHERE id = $1", [
    id,
  ]);

  return rows[0];
}

async function deleteLogById(id) {
  await db.query("DELETE FROM public.logs WHERE id = $1", [id]);
}

async function createLog(data) {
  const {
    logs_date,
    order_num,
    vehicle_code,
    vehicle_type_ar,
    licence_number,
    vehicle_type_en,
    vehicle_model_ar,
    vehicle_model_en,
    term_num,
    repair_desc_ar,
    repair_desc_en,
    unit,
    qty,
    unit_cost,
    repair_cost,
    total_cost,
    notes,
  } = data;

  console.log(data);

  await db.query(
    `INSERT INTO public.logs (
    log_date,
    order_num,
    vehicle_code,
    vehicle_type_ar,
    licence_number,
    vehicle_model_en,
    term_num,
    repair_desc_ar,
    repair_desc_en,
    unit,
    qty,
    unit_cost,
    repair_cost,
    total_cost,
    notes,
    vehicle_type_en,
    vehicle_model_ar
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
    [
      logs_date,
      order_num,
      vehicle_code,
      vehicle_type_ar,
      licence_number,
      vehicle_model_en,
      term_num,
      repair_desc_ar,
      repair_desc_en,
      unit,
      qty,
      unit_cost,
      repair_cost,
      total_cost,
      notes,
      vehicle_type_en,
      vehicle_model_ar,
    ]
  );
}

module.exports = { getLogs, getLogById, deleteLogById, createLog };
