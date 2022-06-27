const fs = require('fs')
const Jimp = require("jimp")

const LIGHT_GREEN = 0x9BBC0FFF
const MID_LIGHT_GREEN = 0x8BAC0FFF
const MID_DARK_GREEN = 0x306230FF
const DARK_GREEN = 0x0F380FFF

fs.readdir(__dirname, function (err, files) {
    if (err) {
        return console.log('Error scanning current dir: ' + err)
    }

    let bmpFiles = files.filter(file => file.endsWith(".bmp") && !file.includes("-gbstylized")) // so you can export bitmaps too if need be
    bmpFiles.forEach(function (file) {

        console.log("processing: " + file)

        Jimp.read(file, function (err, image) {
            if (err) {
                console.log("Error reading image: " + err)
            } else {
                for (let x = 0; x < 128; x++) {
                    for (let y = 0; y < 112; y++) {
                        let pixelColor = image.getPixelColor(x, y)
                        switch (pixelColor) {
                            case Jimp.rgbaToInt(255, 255, 255, 255):
                                image.setPixelColor(LIGHT_GREEN, x, y)
                                break;
                            case Jimp.rgbaToInt(192, 192, 192, 255):
                                image.setPixelColor(MID_LIGHT_GREEN, x, y)
                                break;
                            case Jimp.rgbaToInt(128, 128, 128, 255):
                                image.setPixelColor(MID_DARK_GREEN, x, y)
                                break;
                            case Jimp.rgbaToInt(0, 0, 0, 255):
                                image.setPixelColor(DARK_GREEN, x, y)
                                break;
                            default:
                                console.log("ummmmmm wtf")
                                process.exit(1);
                                break;
                        }
                    }
                }

                console.log("done processing image! " + file)

                image
                    .resize(256, 224)
                    .write(file.replace(".bmp", "-gbstylized.jpg"))
            }
        })
    })
})
