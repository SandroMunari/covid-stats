/*
MIT License

Copyright (c) 2021 Bris

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Bris 2021
*/


const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const server = express();
const fs = require('fs');
var port = 3000


server.get('/', async (req,res) => {
    var htmlpage = await fs.readFileSync('./index.html', 'utf-8')
    res.send(htmlpage)
})


server.get('/sondurumasi.json', async (req,res) => {
    try {
        await axios.get("https://covid19asi.saglik.gov.tr").then(
            result => {
                var $ = cheerio.load(result.data);
                $('g[id="turkiye"]').each(async (i, element) => {
                    var htmlResult = $(element).html().split('</defs>')[1].trim();
                    const Datacount = await htmlResult.match(/(?<=(<text.*?>))(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+?(?=(<\/text>))/g).map(a => parseInt(a.replace(' ', '').replace('.', ''))),
                          Datacity = await htmlResult.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/g).filter(a => a.includes("data-adi")).map(b => b.slice(10).replace('"', ''));
                    var json = {};
                    Datacity.forEach(async (city, count) => {
                        json[city] = Datacount[count]
                    });
                    
                    res.status(200).json({
                        author: "Bris (Hasan) brightsme.xyz",
                        github: "Soon",
                        source: "T.C Sağlık Bakanlığı (https://covid19asi.saglik.gov.tr)",
                        dayvaccinedata: json
                    })
                })
            }
        )
    } catch (error) {
        console.log(error)
    }
});

server.get('/sondurum.json', async (req,res) => {
    try{
        await axios.get("https://covid19.saglik.gov.tr/").then(
            result => {
                var html = result.data;
                var json = JSON.parse(html.split('var sondurumjson = [')[1].split('];//]]>')[0])
                res.status(200).json({
                    author: "Bris (Hasan) brightsme.xyz",
                    github: "Soon",
                    source: "T.C Sağlık Bakanlığı (https://covid19.saglik.gov.tr)",
                    daydata: json
                })
            }
        )
    } catch (error) {
        console.log(error)
    }
});


server.get('/geneldurumjson.json', async (req,res) => {
    try{
        await axios.get('https://covid19.saglik.gov.tr/TR-66935/genel-koronavirus-tablosu.html').then(
            result => {
                var html = result.data;
                var json = JSON.parse(html.split("var geneldurumjson =")[1].split(";//")[0].trim())
                res.status(200).json({
                    author: "Bris (Hasan) brightsme.xyz",
                    github: "Soon",
                    source: "T.C Sağlık Bakanlığı (https://covid19.saglik.gov.tr)",
                    daydata: json
                })
            }
        )
    } catch (error) {
        console.log(error)
    }
});

/*server.get('/ctiytotal.json', async (req, res) => {
    try {
        await axios.get("https://covid19.saglik.gov.tr").then(
            result => {
                var html = result.data;
                var $ = cheerio.load(html)
                $('tbody').each(async (index, element) => {
                    var tbody = $(element).html().trim()
                    var sehirler = tbody.replace(/<|>|[0-9]|td|tr|SiteAgacDallar|--|\/|,/g, "").trim()
                    var değerler = tbody.replace(/|>|[a-zA-Z]|[^A-Za-z0-9]|td|tr|SiteAgacDallar|--|\/|:1.0.0.0/g, "").trim();
                    console.log(sehirler)
                })
            }
        )

    } catch (error) {
        console.log(error)
    }
})*/

server.listen(port, () => {
    console.log(`${port} sayılı port dinleniyor...`)
});