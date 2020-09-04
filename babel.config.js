module.exports = function (api) {
  // api.cache(true);
  api.cache.never();

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    [
      "@babel/preset-react",
    ]
  ];
  const plugins = [
    "@babel/plugin-proposal-class-properties",
  ];

  return {
    presets,
    plugins
  };
}