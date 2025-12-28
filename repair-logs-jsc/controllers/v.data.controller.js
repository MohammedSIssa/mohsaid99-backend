const poolDb = require("../db/pool");
const { findWhere } = require("../db/helpers/findWhere");
const { getColumnValues } = require("../db/helpers/getColumnValues");
const { getAll } = require("../db/helpers/getAll");
const { deleteById } = require("../db/helpers/deleteById");
const { insert } = require("../db/helpers/insert");

const tableName = "vehicles_data";

async function getDataByVehicleCode(req, res) {
  try {
    const vehicle = await findWhere(tableName, req.query, poolDb);
    if (!vehicle)
      return res.status(404).json({ message: "No vehicle was found!" });

    return res.status(200).json(vehicle);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getVehicleByLicenceNumber(req, res) {
  try {
    const vehicle = findWhere(tableName, req.query, poolDb);
    if (!vehicle || !vehicle.length)
      return res.status(404).json({ message: "No vehicle was found!" });

    return res.status(200).json(vehicle);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getVehiclesByState(req, res) {
  try {
    const vehicle = await findWhere(tableName, req.query, poolDb);
    if (!vehicle || !vehicle.length)
      return res.status(404).json({ message: "No vehicle was found!" });

    return res.status(200).json(vehicle);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllVehicleCode(req, res) {
  try {
    const codes = await getColumnValues(tableName, "vehicle_code", poolDb);
    if (!codes || !codes.length)
      return res.status(404).json({ message: "No codes were found!" });

    return res.status(200).json(codes);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllVehicleData(req, res) {
  try {
    const data = await getAll(tableName, poolDb);
    if (!data || !data.length)
      return res.status(404).json({ message: "No vehicle data was found!" });

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createVehicle(req, res) {
  try {
    await insert(tableName, req.body, poolDb);
    return res.status(201).json({ message: "Create vehicle successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteVehicleById(req, res) {
  try {
    await deleteById(tableName, req.params.id, poolDb);
    return res.status(204).json({ message: "Deleted successfully!" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getDataByVehicleCode,
  getVehicleByLicenceNumber,
  getVehiclesByState,
  getAllVehicleCode,
  getAllVehicleData,
  createVehicle,
  deleteVehicleById,
};
