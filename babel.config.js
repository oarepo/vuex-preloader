module.exports = {
    presets: [
        'bili/babel',
        '@vue/cli-plugin-babel/preset'
    ],

    'plugins': [
        'syntax-dynamic-import',
        [
            '@babel/plugin-proposal-decorators',
            {
                'legacy': true
            }
        ],
        [
            '@babel/plugin-proposal-class-properties',
            {
                'loose': true
            }
        ]
    ]
}
