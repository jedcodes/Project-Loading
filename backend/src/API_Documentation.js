import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

class API_Documentation {
    constructor(app) {
        this.app = app;
        this.swaggerDefinition = {
            openapi: '3.0.0',
            info: {
                title: 'Interactive Theater API',
                version: '1.0.0',
                description: 'This API handles all backend interactions for the Interactive Theater application.'
            },
            servers: [
                {
                    url: 'http://localhost:4000',
                    description: 'Development server'
                }
            ],
        };
        this.options = {
            swaggerDefinition: this.swaggerDefinition,
            // Paths to files where routes are documented
            apis: ['./routes/*.js']
        };
        this.swaggerSpec = swaggerJSDoc(this.options);
    }

    setup() {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(this.swaggerSpec));
        console.log('Swagger UI is set up at /api-docs');
    }
}

export default API_Documentation;