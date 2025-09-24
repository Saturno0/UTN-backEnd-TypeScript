import {
  getAllSizesService,
  getSizeByIdService,
  createSizeService,
  createSizesService,
} from "../services/sizeService.js";

export const getAllSizes = async (req, res) => {
  try {
    const sizes = await getAllSizesService();
    return res.status(200).json(sizes);
  } catch (error) {
    if (error.statusCode === 204) {
      return res.status(204).json(error.message);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSizeById = async (req, res) => {
  try {
    const { id } = req.params;
    const size = await getSizeByIdService(id);
    return res.status(200).json(size);
  } catch (error) {
    if (error.statusCode === 204) {
      return res.status(204).json(error.message);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSize = async (req, res) => {
  try {
    const result = await createSizeService(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json(error.message);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSizes = async (req, res) => {
  try {
    const result = await createSizesService(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json(error.message);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

