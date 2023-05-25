require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// Require spotify-web-api-node package here:
const SpotifyWebApi = require ('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// Setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
// Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Error when retrieving the access token', error))

// Our routes go here:
app.get('/', async(request, response)=>{
    response.render('home')
}) 

app.get('/artist-search', async(request, response)=>{
    const {artistSearched} = request.query
    console.log(artistSearched)
    spotifyApi
  .searchArtists(artistSearched)
  .then(data => {
    console.log('recieved Data API: ', data.body)

    const artistArray = data.body.artists.items
    console.log('artistas', artistArray[0])
    response.render('artist-search-results', {artistArray})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))

})

app.get('/albums/:artistId', async(request, response, next)=>{
    try{
        const {artistId} = request.params
        const data = await spotifyApi.getArtistAlbums(artistId)
        const albumsArray = data.body.items
        console.log('albums', albumsArray)
        response.render('album', {albumsArray})        
    }
    catch(error){
        console.log(error)
    }
}) 

app.get('/tracks/:albumId', async(request, response, next)=>{
    try{
        const {albumId} = request.params
        const data = await spotifyApi.getAlbumTracks(albumId)
        const tracksArray = data.body.items
        console.log('tracks', tracksArray)
        response.render('track', {tracksArray})
    }
    catch(error){
        console.log(error)
    }
}) 

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))