module.exports = {
  productionSourceMap: false,
  pwa: {
    appleMobileWebAppStatusBarStyle: '#fff',
    name: 'Notes',
    themeColor: '#fff',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
      exclude: [
        /\.map$/,
        /manifest\.json$/
      ]
    }
  }
}
