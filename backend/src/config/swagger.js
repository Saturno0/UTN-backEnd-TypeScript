import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'API REST para aplicación de comercio electrónico de ropa',
      contact: {
        name: 'API Support',
        email: 'support@ecommerce.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticación'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['nombre', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario',
              example: '507f1f77bcf86cd799439011'
            },
            nombre: {
              type: 'string',
              description: 'Nombre completo del usuario',
              example: 'Juan Pérez',
              minLength: 1,
              trim: true
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único del usuario',
              example: 'juan@example.com',
              minLength: 6,
              maxLength: 30
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario (mínimo 8 caracteres, con número, mayúscula y minúscula)',
              example: 'Password123',
              minLength: 8
            },
            rol: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'Rol del usuario en el sistema'
            },
            activo: {
              type: 'boolean',
              default: true,
              description: 'Estado del usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'juan@example.com'
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario',
              example: 'Password123'
            }
          }
        },
        UserResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica si la operación fue exitosa'
            },
            message: {
              type: 'string',
              description: 'Mensaje de respuesta'
            },
            data: {
              $ref: '#/components/schemas/User'
            },
            token: {
              type: 'string',
              description: 'Token JWT para autenticación'
            }
          }
        },
        Category: {
          type: 'object',
          required: ['nombre'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único de la categoría',
              example: '507f1f77bcf86cd799439011'
            },
            nombre: {
              type: 'string',
              description: 'Nombre único de la categoría',
              example: 'Camisetas',
              trim: true
            },
            descripcion: {
              type: 'string',
              description: 'Descripción de la categoría',
              example: 'Camisetas de algodón para hombre y mujer',
              trim: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'precio_actual', 'precio_original', 'category'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del producto',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              description: 'Nombre del producto',
              example: 'Camiseta Básica Algodón',
              trim: true
            },
            calificacion: {
              type: 'number',
              minimum: 0,
              maximum: 5,
              default: 0,
              description: 'Calificación promedio del producto'
            },
            opiniones: {
              type: 'number',
              minimum: 0,
              default: 0,
              description: 'Número de opiniones del producto'
            },
            description: {
              type: 'string',
              description: 'Descripción del producto',
              example: 'Camiseta de algodón 100% orgánico',
              trim: true
            },
            stock: {
              type: 'boolean',
              default: true,
              description: 'Disponibilidad del producto'
            },
            descuento: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              default: 0,
              description: 'Porcentaje de descuento'
            },
            precio_actual: {
              type: 'number',
              minimum: 0,
              description: 'Precio actual del producto',
              example: 25.99
            },
            precio_original: {
              type: 'number',
              minimum: 0,
              description: 'Precio original del producto',
              example: 29.99
            },
            talles: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
              },
              description: 'Talles disponibles',
              example: ['S', 'M', 'L', 'XL']
            },
            estado: {
              type: 'string',
              enum: ['Activo', 'Inactivo'],
              default: 'Activo',
              description: 'Estado del producto'
            },
            especificaciones: {
              type: 'object',
              properties: {
                material: {
                  type: 'string',
                  description: 'Material del producto',
                  example: '100% Algodón'
                },
                peso: {
                  type: 'string',
                  description: 'Peso del producto',
                  example: '150g'
                },
                fabricado_en: {
                  type: 'string',
                  description: 'País de fabricación',
                  example: 'España'
                }
              }
            },
            category: {
              type: 'string',
              description: 'ID de la categoría',
              example: '507f1f77bcf86cd799439011'
            },
            colores: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Nombre del color',
                    example: 'Azul'
                  },
                  stock: {
                    type: 'number',
                    minimum: 0,
                    description: 'Stock disponible del color',
                    example: 10
                  }
                }
              },
              description: 'Colores disponibles con stock'
            },
            ingreso: {
              type: 'string',
              enum: ['nuevo', 'viejo'],
              default: 'nuevo',
              description: 'Tipo de ingreso del producto'
            },
            imageUrl: {
              type: 'string',
              nullable: true,
              description: 'URL de la imagen en AWS S3',
              example: 'https://mi-bucket.s3.amazonaws.com/productos/imagen.jpg'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: false,
              description: 'Indica si la operación fue exitosa'
            },
            message: {
              type: 'string',
              description: 'Mensaje de error'
            },
            error: {
              type: 'string',
              description: 'Detalles del error'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: true,
              description: 'Indica si la operación fue exitosa'
            },
            message: {
              type: 'string',
              description: 'Mensaje de éxito'
            },
            data: {
              type: 'object',
              description: 'Datos de respuesta'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
