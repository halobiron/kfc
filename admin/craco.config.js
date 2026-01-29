const path = require('path');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Allow imports from outside src directory
            webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
                plugin => plugin.constructor.name !== 'ModuleScopePlugin'
            );

            // Add alias for shared assets
            webpackConfig.resolve.alias = {
                ...webpackConfig.resolve.alias,
                '@shared-assets': path.resolve(__dirname, '../frontend/src/assets')
            };

            return webpackConfig;
        }
    }
};
