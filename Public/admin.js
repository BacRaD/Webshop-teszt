const state = {
    pelenka: []
}

async function renderTermekek() {
    const response = await fetch("/datas");
    const datas = await response.json();
    
    state.pelenka = datas
    var termekekHTML = ''
        
     for(var data of state.pelenka) {
         termekekHTML += `
         <div class="card">
         <div class="img"></div>
            <div class="delete-card" data-productid="${data.id}">x</div>
            <div class="cards-text">
                <h1>${data.cim}</h1>
                <p>Méret: ${data.size}</p>                  
                <p>Raktáron: ${data.stock}db</p>
                    <div class="buttons">
                            <button class="edit-button" data-productid="${data.id}">Edit</button>
                    </div>
            </div>
        </div>
         `
     }

    document.getElementById("admin-cards").innerHTML = termekekHTML      
        
    for(var editBtn of document.querySelectorAll(".edit-button")) {
        editBtn.onclick = function (event) {       
            var index            
            var id = event.target.dataset.productid
            for(var i = 0; i < state.pelenka.length; i++) {
                if(state.pelenka[i].id === id) {
                    index = i          
                    event.path[3].innerHTML = `
                    <div class="img" ></div>                   
                    <form class="edit-card-ok" data-editid="${index}" action="submit">
                        <div style="margin-top: 10px;">
                            <label for="cim">Termék neve</label>
                            <input type="text" name="cim" value="${state.pelenka[index].cim}"> 
                        </div>                                                      
                        <div style="margin-top: 10px;">
                            <label for="size">Méret</label>
                            <input type="text" name="size" value="${state.pelenka[index].size}">
                        </div> 
                        <div style="margin-top: 10px;">
                            <label for="stock">Darab</label>
                            <input type="number" name="stock" value="${state.pelenka[index].stock}">   
                        </div>                                                                        
                        <button class="ok-button" style="width: 50px; height: 25px; margin-top: 10px;">Ok</button>                       
                    </form>  
                    `
                        for(var okEdit of document.querySelectorAll(".edit-card-ok")) {
                        okEdit.onsubmit = async function (event) {
                            event.preventDefault()                            
                            var editId = event.target.dataset.editid                                                 
                            var cim = event.target.elements.cim.value 
                            var size = event.target.elements.size.value
                            var stock = Number(event.target.elements.stock.value)                 
                            var dataJson = {
                                cim: cim,
                                size: size,
                                stock: stock
                            }                                    
                            const res2 = await fetch(`/datas/${state.pelenka[editId].id}`, {
                                method: "PUT",
                                headers: {
                                    "content-type": "application/json",
                                },                                        
                                body: JSON.stringify(dataJson),
                                })
                                if(res2.ok) {
                                    renderTermekek()
                                } else {
                                    alert("Server error")
                                }                                                        
                        }
                    }    
                }                
            }
        }    
    } 
    for(var delBtn of document.querySelectorAll(".delete-card")) {
        delBtn.onclick = async function (event){
            
            var index
            var dataset = event.target.dataset.productid            
            for(var i = 0; i < state.pelenka.length; i++) {
                if(state.pelenka[i].id === dataset) {
                    index = i
                    const res3 = await fetch(`/datas/${state.pelenka[index].id}`, {
                        method: "DELETE",
                        body: null,
                        headers: {
                            "content-type": "application/json",
                        },                
                    })
                    if(res3.ok) {
                        renderTermekek()
                    } else {
                        alert("Server error")
                    }
                    break
                }

            }
        }
    }
}   

window.onload = renderTermekek()

// create

document.getElementById("create-new-card").onsubmit = async function createNewCard (event) {
    event.preventDefault()
    console.log(event   )
    var cim = event.target.elements.cim.value
    var size = event.target.elements.size.value
    var stock = event.target.elements.stock.value
    var dataJson = {
        cim: cim,
        size: size,
        stock: stock
    } 

        const res = await fetch("/datas", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        
        body: JSON.stringify(dataJson),
    })
    if(res.ok) {
        renderTermekek()
    } else {
        alert("Server error")
    }
}


//edit


// delete

