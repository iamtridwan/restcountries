//https://restcountries.eu/rest/v2/region/{region}
//https://restcountries.eu/rest/v2/name/aruba?fullText=true

window.addEventListener('DOMContentLoaded', () => {
    getCountryData('https://restcountries.eu/rest/v2/all?fields=name;capital;currencies;flag;population;region;borders;languages;subregion;topLevelDomain;nativeName');
    
})



let input = document.querySelector('input');
input.addEventListener('keypress', event =>{
    if(event.key == 'Enter'){
        event.preventDefault();
        let backBtn = document.querySelector('.backBtn');
        let inputValue = input.value
        getTargetCountry(inputValue)
        input.value = '';
        let inputArea = document.querySelector('.input-area');
        inputArea.classList.add('show-form')
        backBtn.style.display = 'flex';
}
})
//select documnet elements
let backBtn = document.querySelector('.backBtn');
let arrow = document.getElementById('arrow');
let selectField = document.querySelector('.select-field');
let option = document.getElementById('option');
let optionlist = document.querySelectorAll('li');
let click = 0;
//working with select field
selectField.addEventListener('click', event => {
    click++;
    if(click % 2 == 0){
        arrow.style.transform = "rotate(360deg)";
        option.style.display = 'none';
    }
    else{
        arrow.style.transform = "rotate(180deg)";
        option.style.display = 'block';
    }
    
})

// working with back button 
backBtn.addEventListener('click', () => {
    getCountryData('https://restcountries.eu/rest/v2/all?fields=name;capital;currencies;flag;population;region;borders;languages;subregion;topLevelDomain;nativeName')
    let inputArea = document.querySelector('.input-area');
    inputArea.classList.remove('show-form');
    backBtn.style.display = 'none';
})

//clicking each items of the select list performs these operations
optionlist.forEach( option => {
    option.addEventListener('click', event => {
    let selectContent = document.querySelector('.select-field p');
    currentContent = event.currentTarget.textContent; // obtaining value to look for in our data
    selectContent.textContent = currentContent;
    arrow.style.transform = 'rotate(360deg)'; // changing the style of the arrow icon
    let option = document.getElementById('option');
    option.style.display = 'none';
    //perform fetch operation
    fetch(`https://restcountries.eu/rest/v2/region/${currentContent}`)
    .then(res => res.json())
    .then(data => {
        let output = ``;
        data.map(d => {
            output+= `<article>
            <section class="img">
                <img src=${d.flag} alt="${d.name} flag">
            </section>
            <section class="info">
                <h4 class="name">${d.name}</h4>
                <div class="description">
                    <p>Population:${d.population}</p>
                    <p>Region:${d.region}</p>
                    <p>Capital:${d.capital}</p>
                </div>
            </section>
        </article>`
        })
        let countrySection = document.querySelector('.country-data');
        countrySection.innerHTML = output; 
        getArticles(); 
        
    })
    .catch( e => {
        let countrySection = document.querySelector('.country-data');
        countrySection.innerHTML = `<h1>Unable to Fetch Data</h1>`
    })
    })
})
// get country data function
function getCountryData(path){
fetch(path)
.then(res => res.json())
.then(data => {
    let countryPos =[]
    while(countryPos.length <= 19){
        let randomNumber = Math.floor(Math.random() * 250);
        if(!countryPos.includes(randomNumber)){  // prevent repeation of a particular country 
            countryPos.push(randomNumber)
        }
    }
    let output = ``
    countryPos.forEach(num => {
        output += `<article>
            <section class="img">
                <img src=${data[num].flag} alt="${data[num].name} flag">
            </section>
            <section class="info">
                <h4 class="name">${data[num].name}</h4>
                <div class="description">
                    <p>Population: ${data[num].population}</p>
                    <p>Region: ${data[num].region}</p>
                    <p>Capital: ${data[num].capital}</p>
                </div>
            </section>
        </article>`
    })
    let countrySection = document.querySelector('.country-data');
    countrySection.innerHTML = output;
    getArticles();   
}).catch( e => {
    let countrySection = document.querySelector('.country-data');
    countrySection.innerHTML = `<h1>Unable to Fetch Data</h1>`
})
}
// function to get a specific country
function getTargetCountry(name){
    fetch(`https://restcountries.eu/rest/v2/all`)
        .then(res => res.json())
        .then(data => { 
            let country = data.filter(d => d.name.toLowerCase() == name.toLowerCase());
            let output = ``;
             country.map( c => {
                output += `<div class='detail'>
                    <section class="flag">
                        <img src=${c.flag} alt="${c.name} flag">
                    </section>
                    <section class="country-info">
                        <h1 class="name">${c.name}</h1>
                        <div class="description">
                            <div class='left'>
                                <p>Native Name: <span id="span">${c.nativeName}<span></p>
                                <p>Population: <span id="span">${c.population}<span></p>
                                <p>Region: <span id="span">${c.region}<span></p>
                                <p>Sub Region: <span id="span">${c.subregion}<span></p>
                                <p>Capital: <span id="span">${c.capital}<span></p>
                            </div>
                            <div class='right'>
                                <p>Top Level Domain: <span>${c.topLevelDomain}<span></p>
                                <p>Currencies: <span>${c.currencies[0].name}<span></p>
                                <p>Languages: <span>${c.languages[0].name}<span></p>
                            </div>                    
                        </div>
                        <div class='borders'>
                        <p>Border Countries: </p>
                        <div class='btns'>
                        </div>
                        </div>
                    </section>
                </div>`
                
            
             })
        
        let countrySection = document.querySelector('.country-data');
        countrySection.innerHTML = output; 
        let btns = document.querySelector('.btns')
        let inputArea = document.querySelector('.input-area');
        inputArea.classList.add('show-form');
        backBtn.style.display = 'flex';
        let countryName = data.filter(d => d.name.toLowerCase() == name.toLowerCase());
        let borders = countryName[0].borders.slice(0, 3);
        let code = data.map( d => d.alpha3Code);
        borders.forEach( name => {
            let button = document.createElement('button');
            button.textContent = data[code.indexOf(name)].name
            btns.appendChild(button)
            
        })
        buttons = document.querySelectorAll('button');
        buttons.forEach( button => {
            button.addEventListener('click', e => {
                let country = e.currentTarget.textContent
                getTargetCountry(country);
            })
        } )



    }).catch( e => {
    let countrySection = document.querySelector('.country-data');
    countrySection.innerHTML = `<h1>Unable to Fetch Data</h1>`;
})
}
// get data for detail page
function getArticles(){
    let articles = document.querySelectorAll('article');
    articles.forEach( article => {
        article.addEventListener('click', (e) => {
           let countryName = e.currentTarget.children[1].firstElementChild.textContent;
           getTargetCountry(countryName);
           
            
        })
    })

}

//Theme changer

function changeTheme(pos){
    let setUp = [{
        bodyColor: "hsl(207, 26%, 17%)",
        textColor: "hsl(0, 0%, 100%)",
        elements : "hsl(209, 23%, 22%)",
        expand : './images/expand_more_white_24dp.svg',
        back :'./images/west_white_24dp.svg',
        search : "./images/search_white_24dp.svg",
        mode : "./images/nightlight_round_black_24dp.svg"

    }, 
    
    {
        bodyColor: "hsl(0, 0%, 98%)",
        textColor: "hsl(200, 15%, 8%)",
        elements : "hsl(0, 0%, 100%)",
        back: './images/west_black_24dp.svg',
        expand : './images/expand_more_black_24dp.svg',
        search : "./images/search_black_24dp.svg",
        mode : "./images/nightlight_round_white_24dp.svg"
    }
]

    let body = document.querySelector('body');
    let articles = document.querySelectorAll('article');
    let buttons = document.querySelectorAll('button');
    let back = document.getElementById('back');
    let search = document.getElementById('search');
    let input = document.querySelector('input');
    let top = document.querySelector('.top');
    let para =  document.querySelector('.select-field p');
    let optionlist = document.querySelectorAll('li');
    let h1 = document.querySelector('h1');
    let countryInfo = document.querySelector('.country-info');
    let h4 = document.querySelector('h4');
    let moonIcon = document.getElementById('moon');
    body.style.backgroundColor = setUp[pos].bodyColor;
    body.style.color = setUp[pos].textColor
    articles.forEach( article =>
        {article.style.backgroundColor = setUp[pos].bodyColor});
    buttons.forEach(button => button.style.backgroundColor = setUp[pos].elements);
    back.src = setUp[pos].back;
    arrow.src = setUp[pos].expand; 
    search.src = setUp[pos].search;
    input.style.backgroundColor = setUp[pos].elements;
    input.style.color = setUp[pos].textColor;
    top.style.backgroundColor = setUp[pos].elements;
    selectField.style.backgroundColor = setUp[pos].elements;
    para.style.color = setUp[pos].textColor;
    option.style.backgroundColor = setUp[pos].elements;
    optionlist.forEach( li => li.style.color = setUp[pos].textColor);
    backBtn.style.backgroundColor = setUp[pos].elements;
    h1.style.color = setUp[pos].textColor;
    countryInfo.style.color = setUp[pos].textColor;
    h4.style.color = setUp[pos].textColor;
    moonIcon.src = setUp[pos].mode; 

}

let mode = document.querySelector('.icon');
let clicked = 0
// mode.addEventListener('click', () => {
//     clicked++
//     changeTheme(clicked % 2)
    
// })