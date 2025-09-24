import {
  getAllColorsService,
  getColorByIdService,
  createColorService,
  createColorsService,
} from "../services/colorService.js";

export const getAllColors = async (req, res) => {
  try {
    const colors = await getAllColorsService();
    return res.status(200).json(colors);
  } catch (error) {
    if (error.statusCode === 204) {
      return res.status(204).json(error.message);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await getColorByIdService(id);
    return res.status(200).json(color);
  } catch (error) {
    if (error.statusCode === 204) {
      return res.status(204).json(error.message);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createColor = async (req, res) => {
  try {
    const result = await createColorService(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json(error.message);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createColors = async (req, res) => {
  try {
    const result = await createColorsService(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json(error.message);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

