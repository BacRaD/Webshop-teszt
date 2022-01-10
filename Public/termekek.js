var state = {
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
            <div class="img">
            </div>
            <div class="cards-text">
                <h1>${data.cim}</h1>
                <p>Méret: ${data.size}</p>                  
                <p>Raktáron: ${data.stock}db</p>        
            </div>
        </div>
         `
     }

     document.getElementById("termekek").innerHTML = termekekHTML


}  

//Find

window.onload = renderTermekek()