import "#modules/auth/auth.validator.js";
import "#modules/auth/auth.route.js";
import { getOpenApiDocumentation } from "#shared/docs/openapi.js";

export const swaggerSpec = getOpenApiDocumentation();
