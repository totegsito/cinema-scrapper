const url = require('url');
const { cines, imdb } = require('./config');
const cheerio = require('cheerio');
const httpClient = require('./lib/http');

const getCinema = async (url) => {
    const { data: cinema } = await httpClient.get(url);
    return cinema;
}

const getIMDBCalification = async (name) => {
    const { data: search } = await httpClient.get(imdb.url, { params: { q: name, title_type: 'feature' } });
    const $ = cheerio.load(search);
    const [pelicula] = $('.findList .result_text a[href^="/title"]');
    const urlRelativaPelicula = pelicula?.attribs['href']
    if (!urlRelativaPelicula) {
        return '-'
    } else {
        const urlPelicula = url.resolve(imdb.base, urlRelativaPelicula)
        const { data: detalle } = await httpClient.get(urlPelicula);
        const detallePeliculaElement = cheerio.load(detalle);
        const rating = detallePeliculaElement('span[itemprop="ratingValue"]').text()
        return rating || '-'
    }
}

const main = async () => {
    const marcas = Object.keys(cines)
    const peliculasConNota = []
    for await (const marca of marcas) {
        const cinesConfig = Object.keys(cines[marca]);
        for await (const cine of cinesConfig) {
            const cinema = await getCinema(cines[marca][cine].url);
            const $ = cheerio.load(cinema);
            const peliculas = $('#listings .wcnt').find('.lfilmb img[src^="/carteles/"]');
            for await (const pelicula of peliculas) {
                const titulo = pelicula.attribs.alt
                const peliculaExistente = peliculasConNota.find(pelicula => titulo === pelicula.titulo)
                if (peliculaExistente) {
                    peliculaExistente.cines.push(`${marca} ${cine}`)
                } else {
                    const peliculaExtendida = {
                        titulo,
                        imdb: await getIMDBCalification(titulo),
                        cines: [`${marca} ${cine}`]
                    }
                    peliculasConNota.push(peliculaExtendida)
                }
            }
        }
    }
    return peliculasConNota
}

main().then(console.log).catch(ex => console.log(ex.message))

