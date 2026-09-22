<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentação da API - Solicitações de Atendimento</title>
    <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@5.32.13/swagger-ui.css"
        crossorigin="anonymous"
    >
    <style>
        html {
            box-sizing: border-box;
            overflow-y: scroll;
        }

        *, *::before, *::after {
            box-sizing: inherit;
        }

        body {
            margin: 0;
            background: #fafafa;
        }

        .swagger-ui .topbar {
            display: none;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script
        src="https://unpkg.com/swagger-ui-dist@5.32.13/swagger-ui-bundle.js"
        crossorigin="anonymous"
    ></script>
    <script
        src="https://unpkg.com/swagger-ui-dist@5.32.13/swagger-ui-standalone-preset.js"
        crossorigin="anonymous"
    ></script>
    <script>
        window.addEventListener('load', function () {
            SwaggerUIBundle({
                url: @json(route('docs.openapi')),
                dom_id: '#swagger-ui',
                deepLinking: true,
                displayRequestDuration: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset,
                ],
                plugins: [SwaggerUIBundle.plugins.DownloadUrl],
                layout: 'StandaloneLayout',
            });
        });
    </script>
</body>
</html>
