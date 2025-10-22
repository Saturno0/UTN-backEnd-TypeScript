import type { Dispatch } from "@reduxjs/toolkit";

export interface ProductColor {
  name: string;
  cantidad: number;
  stock: number;
}

export interface ProductSpecs {
  material: string;
  peso: string;
  fabricado_en: string;
}

export interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  metodoPago: string;
}

export interface Product {
  _id?: string;
  id?: string | number;
  name: string;
  image: File,
  imageUrl: string;
  category: string;
  description: string;
  calificacion: number;
  opiniones: number;
  stock: boolean;
  descuento: number;
  precio_actual: number;
  precio_original: number;
  talles: string[];
  especificaciones: ProductSpecs;
  colores: ProductColor[];
  ingreso: string;
  estado: string;
}

export interface CartState {
  totalItems: number;
  products: CartItem[];
}

export interface CartItem {
  id: string;
  name: string;
  color: string;
  precio_actual: number;
  quantity: number;
  image: string;
}

export interface CartItemsProps {
  items: CartItem[];
  dispatch: Dispatch;
}

export interface UserState {
  nombre: string;
  email: string;
  password: string;
  rol: string;
  activo: boolean;
}

export interface Category {
  _id?: string;
  nombre: string;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiUser {
  _id?: string;
  nombre: string;
  email: string;
  rol: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
