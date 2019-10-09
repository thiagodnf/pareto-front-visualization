
'use strict'

require.config({

    paths: {

        // Vendors
        'toast': 'vendor/toast.min',

        // Charts
        'chart-2d': 'modules/chart/chart-2d',
        'chart-3d': 'modules/chart/chart-3d',
        'chart-4d': 'modules/chart/chart-4d',

        // Utils
        'toaster': 'modules/util/toaster',
    },
})

// Load the main app module to start the app
require(['main'])
