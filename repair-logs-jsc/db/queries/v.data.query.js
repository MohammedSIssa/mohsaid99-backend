const db = require("../pool");

async function getDataByVehicleCode(code) {
  const { rows } = await db.query(
    "SELECT * FROM public.vehicles_data WHERE vehicle_code = $1",
    [code]
  );

  return rows[0];
}

async function getVehicleByLicenceNumber(ln) {
  const { rows } = await db.query(
    "SELECT * FROM public.vehicles_data WHERE licence_number = $1",
    [ln]
  );

  return rows[0];
}

async function getVehiclesByState(state) {
  const { rows } = await db.query(
    "SELECT * FROM public.vehicles_data WHERE vehicle_state = $1",
    [state]
  );

  return rows;
}

async function getAllVehicleCode() {
  const { rows } = await db.query(
    "SELECT vehicle_code FROM public.vehicles_data"
  );
  if (rows.length) return rows.map((row) => row.vehicle_code);

  return [];
}

async function getAllVehicleData() {
  const { rows } = await db.query("SELECT * FROM public.vehicles_data");

  return rows;
}

async function createVehicle(data) {
  const {
    vehicle_code,
    licence_number,
    vehicle_type_en,
    vehicle_type_ar,
    vehicle_model_ar,
    vehicle_state,
    vehicle_dept,
    vehicle_model_en,
    notes,
  } = data;

  await db.query(
    `INSERT INTO public.vehicles_data (
      vehicle_code,
      licence_number,
      vehicle_type_en,
      vehicle_type_ar,
      vehicle_model_ar,
      vehicle_state,
      vehicle_dept,
      vehicle_model_en,
      notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      vehicle_code,
      licence_number,
      vehicle_type_en,
      vehicle_type_ar,
      vehicle_model_ar,
      vehicle_state,
      vehicle_dept,
      vehicle_model_en,
      notes,
    ]
  );
}

async function deleteVehicleById(id) {
  await db.query("DELETE FROM public.vehicles_data WHERE id = $1", [id]);
}

module.exports = {
  getDataByVehicleCode,
  getVehicleByLicenceNumber,
  getVehiclesByState,
  getAllVehicleCode,
  createVehicle,
  getAllVehicleData,
  deleteVehicleById,
};
