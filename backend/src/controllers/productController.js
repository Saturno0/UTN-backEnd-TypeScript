import {
  createProductService,
  createProductsService,
  deleteProductService,
  getAllColorsByProductService,
  getAllProductsService,
  getAllSizesByProductService,
  getProductByIdService,
  updateProductService,
} from "../services/productService.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();
    res.status(200).json(products);
  } catch (error) {
    if (error.statusCode === 204) {
      res.status(204).json(error.message);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getAllColorsByProduct = async (req,res) => {
  try {
    const { id } = req.params;
    const response = await getAllColorsByProductService(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(error.statusCode === 204? 204 : 500).json(error.message);
  }
}

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);
    res.status(200).json(product);
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(error.statusCode).json(error.message);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const createProduct = async (req, res) => {
  try {
    const hasImage = req.imageUrl || req.body.imageUrl;

    // Normalizar campos que llegan como strings en multipart/form-data
    const parseMaybeJson = (v) => {
      if (typeof v !== 'string') return v;
      try { return JSON.parse(v); } catch { return v; }
    };

    const coerceNumber = (v) => typeof v === 'string' ? Number(v) : v;
    const coerceBoolean = (v) => {
      if (typeof v === 'boolean') return v;
      if (typeof v === 'string') return v === 'true';
      return Boolean(v);
    };

    const raw = { ...req.body };
    const productData = {
      ...raw,
      colores: parseMaybeJson(raw.colores) ?? raw.colores,
      especificaciones: parseMaybeJson(raw.especificaciones) ?? raw.especificaciones,
      talles: parseMaybeJson(raw.talles) ?? raw.talles,
      precio_actual: coerceNumber(raw.precio_actual),
      precio_original: coerceNumber(raw.precio_original),
      descuento: coerceNumber(raw.descuento),
      calificacion: coerceNumber(raw.calificacion),
      opiniones: coerceNumber(raw.opiniones),
      stock: raw.stock !== undefined ? coerceBoolean(raw.stock) : raw.stock,
      imageUrl: hasImage || null,
    };

    const response = await createProductService(productData);
    res.status(200).json(response);
  } catch (error) {
    if (error.statusCode === 409) {
      res.status(409).json(error.message);
    } else {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  }
};

export const getAllSizesByProduct = async (req,res) => {
  try {
    const { id } = req.params;
    const response = await getAllSizesByProductService(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(error.statusCode === 404 ? 404 : 500).json(error.message);
  }
}

export const createProducts = async (req,res) => {
    try {
        const productsData = req.body;
        const response = await createProductsService(productsData);
        res.status(200).json(response);
    } catch (error) {
        if (error.statusCode === 409) {
            res.status(409).json(error.message);
        } else {
            res.status(500).json({ message: "Internal server error " + error.message });
        }
    }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const response = await updateProductService(id, productData);
    res.status(200).json(response);
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(error.statusCode).json(error.message);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteProductService(id);
    res.status(200).json(response);
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(error.statusCode).json(error.message);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
