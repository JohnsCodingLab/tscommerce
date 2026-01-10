import { getOpenApiDocumentation } from "#shared/docs/openapi.js";
import "#modules/auth/auth.validator.js";
import "#modules/auth/auth.route.js";

export const swaggerSpec = getOpenApiDocumentation();
