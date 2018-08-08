const http = require('https')
const fs = require('fs')
const path = require('path')
const csv = require('csvtojson/v2')

const convert = (url = 'https://nodeprogram.com') => {
    console.log('downloading ', url)
    const fetchPage = (urlF, callback) => {
        http.get(urlF, (response) => {
            let buff = ''
            response.on('data', (chunk) => {
                buff += chunk
            })
            response.on('end', () => {
                callback(null, buff)
            })
        }).on('error', (error) => {
            console.error('Got error: ${error.message}')
            callback(error)
        })
    }
    
    fetchPage(url,(error,data) => {
        if (error) return console.log(error)
        csv().fromString(data).then((jsonObj) => {
            fs.writeFileSync(path.join(__dirname, 'customer-data.json'), JSON.stringify(jsonObj))
            fs.writeFileSync(path.join(__dirname, 'customer-data.csv'), data)
        })
    })
}

convert(process.argv[2])