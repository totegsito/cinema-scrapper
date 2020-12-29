module.exports = {
  cines: {
    cinesa: {
      principePio: {
        url: 'https://www.ecartelera.com/cines/53,0,1.html',
        api: 'https://www.cinesa.es/Cines/Horarios/781/28000'
      }
    },
    yelmo: {
      ideal: {
        url: 'https://www.ecartelera.com/cines/54,0,1.html',
        api: 'https://www.yelmocines.es/now-playing.aspx/GetNowPlaying',
      }
    },
  },
    imdb: {
        base: 'https://www.imdb.com',
        get url() {
          return `${this.base}/find`
        }
    }
}
