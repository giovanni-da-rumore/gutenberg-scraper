var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

function parseParagraph(paragraph, fullText) {
    if (!paragraph.text() || !paragraph.text().length) {
        return
    }
    fullText.push(paragraph.text())
    paragraph.text()
}


function writeTextFile() {
    var url = 'http://www.gutenberg.org/files/432/432-h/432-h.htm';
    var title = 'my_text.txt'
    request(url, function(error, response, html) {
        if (error) { console.log('fetching error occured', error); return }
        var $ = cheerio.load(html);
        var storyText = []
        // run through text and pass into an array, so that you can later add line breaks between paragraphs
        $('body').find('p').filter(function (idx, el) {
            parseParagraph($(el), storyText);
        });
        // determine the title from page if possible
        if ($('h1')[0]) {
            title = $($('h1')[0]).text().split(' ').join('_').toLowerCase() + '.txt'

        }
        console.log('title', title)
        // add line breaks to paragraphs
        var stringStory = storyText.join('\n\r\n\r')
        // output to file
        fs.writeFile(`files/james/${title}`, stringStory, function(err) {
            if (err) {
                console.log('an error occured while parsing your story')
                return console.log(err);
            }
            console.log("File successfully saved!");
        }); 
        
    });
}

writeTextFile()