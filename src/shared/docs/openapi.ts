import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

export const registry = new OpenAPIRegistry();

// Utility to generate the final documentation object
export const getOpenApiDocumentation = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "TSCommerce API",
      version: "1.0.0",
      description: "E-commerce REST API built with Node.js & TypeScript",
    },
    servers: [{ url: "/api/v1" }],
  });
};
