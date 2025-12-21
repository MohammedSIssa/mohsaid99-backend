const db = require("../db/queries/v.data.query");

async function getDataByVehicleCode(req, res) {
  const { vcode } = req.params;
  try {
    const vehicle = await db.getDataByVehicleCode(vcode);
    if (!vehicle)
      return res.status(404).json({ message: "No vehicle was found!" });

    return res.status(200).json(vehicle);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getVehicleByLicenceNumber(req, res) {
  const { licence } = req.params;
  try {
    const vehicle = await db.getVehicleByLicenceNumber(licence);
    if (!vehicle || !vehicle.length)
      return res.status(404).json({ message: "No vehicle was found!" });

    return res.status(200).json(vehicle);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getVehiclesByState(req, res) {
  const { state } = req.params;
  try {
    const vehicle = await db.getVehiclesByState(state);
    if (!vehicle || !vehicle.length)
      return res.status(404).json({ message: "No vehicle was found!" });

    return res.status(200).json(vehicle);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllVehicleCode(req, res) {
  try {
    const codes = await db.getAllVehicleCode();
    if (!codes || !codes.length)
      return res.status(404).json({ message: "No codes were found!" });

    return res.status(200).json(codes);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllVehicleData(req, res) {
  try {
    const data = await db.getAllVehicleData();
    if (!data || !data.length)
      return res.status(404).json({ message: "No vehicle data was found!" });

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createVehicle(req, res) {
  try {
    await db.createVehicle(req.body);

    return res.status(201).json({ message: "Create vehicle successfully" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteVehicleById(req, res) {
  const { id } = req.params;
  try {
    await db.deleteVehicleById(id);
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
