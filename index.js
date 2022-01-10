const express = require("express")
const app = express()
const path = require('path');
const bodyParser = require("body-parser")
const fs = require("fs")

app.use(express.static("public"));
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Html', 'home.html'))
})

app.get("/termekek", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Html', 'termekek.html'))
})

app.get("/kapcsolat", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Html', 'kapcsolat.html'))
})

app.get("/rolunk", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Html', 'rolunk.html'))
})

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Html', 'admin.html'))
})

app.get("/datas",bodyParser.json(), (req, res) => {
    fs.readFile("./data/data.json", (err, file) => {
        res.send(JSON.parse(file))
    })
})

app.get("/datas/:egyediAzonosito", (req, res) => {
    const id = req.params.egyediAzonosito

    fs.readFile("./data/data.json", (err, file) => {
        const pelenkak = JSON.parse(file)
        const pelenkaById = pelenkak.find(pelenka => pelenkak.id === id)

        if(pelenkaById) {
            res.status(404)
            res.send({error: `id: ${id} not found`})
            return
        }


        res.send(pelenkaById)
    })    
})

app.put("/datas/:egyediAzonosito", bodyParser.json(), (req, res) => {
    const id = req.params.egyediAzonosito

    fs.readFile("./data/data.json", (err, file) => {
        const pelenkak = JSON.parse(file)
        const pelenkaIndexById = pelenkak.findIndex(pelenka => pelenka.id === id)

        if(pelenkaIndexById === -1) {
            res.status(404)
            res.send({error: `id: ${id} not found`})
            return
        }
        const updatedData = {
            id: id,
            cim: sanitizeString(req.body.cim),
            size: sanitizeString(req.body.size),
            stock: Number(req.body.stock),
        }
        pelenkak[pelenkaIndexById] = updatedData
        fs.writeFile("./data/data.json", JSON.stringify(pelenkak), (err) => {
            
        res.send(pelenkak)
        })
    })    
})

app.post("/datas", bodyParser.json(), (req, res) => {
    const newData = {
        id: uuidv4(),
        cim: sanitizeString(req.body.cim),
        size: sanitizeString(req.body.size),
        stock: Number(req.body.stock),
    }
    fs.readFile("./data/data.json", (err, file) => {
        const data = JSON.parse(file)
        data.push(newData)
        fs.writeFile("./data/data.json", JSON.stringify(data), (err) => {
            res.send("newData")
        })
    })    
})

app.delete("/datas/:egyediAzonosito", (req, res) => {
    const id = req.params.egyediAzonosito

    fs.readFile("./data/data.json", (err, file) => {
        const pelenkak = JSON.parse(file)
        const pelenkaIndexById = pelenkak.findIndex(pelenka => pelenka.id === id)

        if(pelenkaIndexById === -1) {
            res.status(404)
            res.send({error: `id: ${id} not found`})
            return
        }
        
        pelenkak.splice(pelenkaIndexById, 1)
        fs.writeFile("./data/data.json", JSON.stringify(pelenkak), (err) => {
            
        res.send({id: id})
        })
    })        
})

app.listen(3300);


function sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}  


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}