const dino = document.querySelector(".dino") //Dínó DOM elem kijelölése
const gameOverZone = document.querySelector('.gameOverZone') //GameOver DOM elem
let isStarted = false, isEnded = false //státusz változók a játék állapotáról

const record = document.querySelector('.record') //rekord mutató DOM eleme
const zfill = (number, nOfZeros) => { //5 hosszú karakter lánc hiányzó elemeit kiegészíti 0-kal -> zero fill
    let output = ''
    for(let i=0; i<nOfZeros-number.toString().length; i++)
        output += '0'
    return output+number
}
//Lap betöltésekor localStorage letöltése
if(localStorage.getItem('record') != null){
    record.textContent = zfill(localStorage.getItem('record'), 5)
}

const Main = () => {
    let isGameOver = false //státusz változó, a játék állapotáról -> true: ha vége a játéknak / false: ha a játék folyamatban van

    const place = document.querySelector(".placeToMove") //DOM elem kijelölse -> ide generál kaktuszokat, és a dínó is itt fut

    //#region JÁTÉK KOMPONENSEKKEL KAPCSOLATOS VÁLTOZÓK LÉTREHOZÁSA
    const dinoBgs = ['./pics/balLabas.png', './pics/jobbLabas.png'] //A dínó animáció képei
    let leg = 0 //láb számláló -> 0: bal láb / 1: jobb láb
    let jump = false //ugrás állapot jelző

    const cactusBgs = [ //Kaktusz háttérképek, mindegyikből valószínűség arányosan -> [háttér, szélesség, magasság, típusID]
                        ['./pics/cactus1_1.png', 23, 46, 11], ['./pics/cactus1_1.png', 23, 46, 11], ['./pics/cactus1_1.png', 23, 46, 11],
                        ['./pics/cactus1_2.png', 22, 46, 12], ['./pics/cactus1_2.png', 22, 46, 12], ['./pics/cactus1_2.png', 22, 46, 12],['./pics/cactus1_2.png', 22, 46, 12],
                        ['./pics/cactus1_3.png', 15, 33, 13], ['./pics/cactus1_3.png', 15, 33, 13], 
                        ['./pics/cactus2.png', 32, 33, 21], ['./pics/cactus2.png', 32, 33, 21], ['./pics/cactus2.png', 32, 33, 21],
                        ['./pics/cactus2.png', 49, 50, 22], ['./pics/cactus2.png', 49, 50, 22], ['./pics/cactus2.png', 49, 50, 22], 
                        ['./pics/cactus3.png', 49, 33, 30], ['./pics/cactus3.png', 49, 33, 30], ['./pics/cactus3.png', 49, 33, 30], 
                        ['./pics/cactus4.png', 73, 48, 40], ['./pics/cactus4.png', 73, 48, 40], ['./pics/cactus4.png', 73, 48, 40], ['./pics/cactus4.png', 73, 48, 40], ['./pics/cactus4.png', 73, 48, 40]
                    ]

    //#endregion

    //#region DÍNÓ MOZGATÁSA
    let stepInterval //interval változó, a lépés animációért felel
    const step = () => {
        stepInterval = setInterval(()=>{
            if(leg == 0 && !jump)
            {
                leg++
                dino.style.backgroundImage = `url(${dinoBgs[leg]})`
            }
            else if (leg == 1 && !jump){
                leg--
                dino.style.backgroundImage = `url(${dinoBgs[leg]})`
            }
        },150)
    }

    window.addEventListener('keydown', (event) => {
        if(event.key == " " && !jump && !isGameOver){
            jump = true            

            dino.style.backgroundImage = "url('./pics/mind2.png')"

            dino.classList.add('jump')
            
            setTimeout(
                () => dino.classList.remove('jump'),
                300
            )
            setTimeout(
                () => jump = false, 
                600
            )
        }
    })
    //#endregion

    //#region PÁLYA SZIMULÁCIÓ / KAKTUSZ GENERÁLÁS
    //Random időköz generálása, adott inntervalummon belül -> [min, max] -> ebben az időközben hozz létre kaktuszt
    const GetRandomInterval = (min, max) => {
        let random = Math.floor(Math.random() * (max-min+1))+min     
        // console.log(random) 
        return random
    }

    //Random kaktusz típus generálása -> [min, max[
    const GetRandomCactus = (min, max) => {
        let random = Math.floor(Math.random() * (max-min))+min
        // console.log(random) 
        return random
    }

    const simulation = () => {
        if(!isGameOver){
            console.log('új iteráció')

            //node létrehozása, osztálynév adása, háttérképpel való ellátása, beméretezése, DOM-hoz hozzáadása
            let e = document.createElement('div')
            e.className = 'cactus'
            let bgN = GetRandomCactus(0, cactusBgs.length)
            e.style.backgroundImage = `url(${cactusBgs[bgN][0]})`
            e.style.width = cactusBgs[bgN][1] + 'px'
            e.style.height = cactusBgs[bgN][2] + 'px'

            //Szensorok hozzáadása
            switch(cactusBgs[bgN][3]){
                case 11:
                    e.innerHTML = `<div class="sensors">
                        <div class="sensorCac" style="width: 100%;height: 74%;bottom: 0%;"></div>
                        <div class="sensorCac" style="width: 34%;height: 30%;left: 30%;"></div>
                    </div>`
                    break
                case 12:
                    e.innerHTML = `<div class="sensors">
                        <div class="sensorCac" style="width: 100%;height: 74%;bottom: 0%;"></div>
                        <div class="sensorCac" style="width: 34%;height: 30%;left: 30%;"></div>
                    </div>`
                    break
                case 13:
                    e.innerHTML = `<div class="sensors">
                        <div class="sensorCac" style="width: 100%;height: 74%;bottom: 0%;"></div>
                        <div class="sensorCac" style="width: 34%;height: 30%;left: 30%;"></div>
                        <div class="sensorCac" style="right: 0;bottom: 0;width: 30%;height: 90%;"></div>
                    </div>`
                    break
                case 21:
                    e.innerHTML = `<div class="sensors">
                        <div class="sensorCac" style="width: 100%; height: 75%; bottom: 0;"></div>
                        <div class="sensorCac" style="width: 78.8%;height: 25%;transform: translateX(-50%);left: 50%;"></div>
                        <div class="sensorCac" style="right: 0;bottom: 0;width: 30%;height: 90%;"></div>
                    </div>`
                    break
                case 22:
                    e.innerHTML = `<div class="sensors">
                        <div class="sensorCac" style="width: 100%; height: 75%; bottom: 0;"></div>
                        <div class="sensorCac" style="width: 78.8%;height: 25%;transform: translateX(-50%);left: 50%;"></div>
                        <div class="sensorCac" style="right: 0;bottom: 0;width: 30%;height: 90%;"></div>
                    </div>`
                    break
                case 30:
                    e.innerHTML = `<div class="sensors">
                        <div class="sensorCac" style="width: 100%; height: 75%; bottom: 0;"></div>
                        <div class="sensorCac" style="width: 78.8%;height: 25%;transform: translateX(-50%);left: 50%;"></div>
                        <div class="sensorCac" style="right: 0;bottom: 0;width: 30%;height: 90%;"></div>
                    </div>`
                    break
                case 40:
                    e.innerHTML = `<div class="sensors">
                        <div class="sensorCac" style="width: 100%; height: 75%; bottom: 0;"></div>
                        <div class="sensorCac" style="width: 78.8%;height: 25%;transform: translateX(-50%);left: 50%;"></div>
                    </div>`
                    break
            }

            place.appendChild(e)

            console.log('kaktusz hozzáadva DOMHOZ')

            //play class hozzáadása, ellenőrzése, hogy a kaktusz elhagyta-e a pályát
            setTimeout(() => {
                document.querySelectorAll('.cactus').forEach(
                    (cactus) => {

                        if (cactus.offsetLeft + cactus.offsetWidth == 0)
                            cactus.remove()
                    }
                )
            }, 1)

            //rekurzió
            let random = GetRandomInterval(800,1600)
            console.log('rekurzió:', random)
        
            setTimeout(simulation, random)
        }
    }
    //#endregion

    //#region SZÁMLÁLÓ LÉTREHOZZÁSA
    let clock //interval változó
    const actualScore = document.querySelector('.actualScore') //aktuális score DOM eleme
    
    const timer = () => {
        let time = 0
        clock = setInterval(()=>{
            // console.log(zfill(time, 5))
            actualScore.textContent = zfill(time, 5)
            time++
        }, 100)
    }
    //#endregion

    //#region VALIDÁLÓ
    let validator //innteval változó
    const validate = () => {
        validator = setInterval(()=>{
            let cactuses = document.querySelectorAll('.cactus')
            cactuses.forEach((cactus)=>{
                let dProps = dino.getBoundingClientRect() //dino tulajdonságai
                let cProps = cactus.getBoundingClientRect() //cactus tulajdonságai

                if((dProps.right >= cProps.left && dProps.bottom>=cProps.top && dProps.right<=cProps.right) 
                    || (dProps.right>cProps.right && dProps.left<=cProps.right && dProps.bottom>=cProps.top))
                {
                    
                    let isSensorInit = false //ha a szenzor a kaktuszhoz hozzáér
                    let sensors = document.querySelectorAll('.sensor') //dínó szenzorjai
                    let sensorsCac = cactus.querySelector('.sensors').querySelectorAll('.sensorCac') //kaktusz szenzorjai

                    //szenzorok metszésének ellenőrzése
                    for(let sensor of sensors){
                        let sProps = sensor.getBoundingClientRect()
                        if((sProps.bottom>=cProps.top && sProps.right < cProps.left) || (sProps.bottom < cProps.top) || (sProps.bottom>=cProps.top && sProps.left>cProps.right)){
                            continue
                        }
                        else{ //ha a kaktusz node elemehez a dínó szenzor hozzáér, akkor ellenőrzi, hogy kaktusz szenzorhoz is hozzáé-e
                            for(let sensorCac of sensorsCac){
                                let scProps = sensorCac.getBoundingClientRect()
                                //ha nem metszik egymást
                                if((sProps.bottom>=scProps.top && sProps.right < scProps.left) || (sProps.bottom<scProps.top) || (sProps.bottom>=scProps.top && sProps.left>scProps.right))
                                    continue
                                //ha metszik egymást
                                else{
                                    isSensorInit = true
                                    break
                                }
                            }
                        }
                    }

                    
                    console.log(`Dino sensor: ${isSensorInit}`)

                    if(isSensorInit){
                        //dino.style.outline = "4px solid red"

                        dino.style.top = dino.offsetTop + "px"
                        isGameOver = true
                        //Kaktuszok fixálása
                        cactuses.forEach((cac)=>{
                            cac.classList.remove('.play')
                            cac.style.left = cac.offsetLeft + "px"
                        })

                        //intervalok leállítása
                        clearInterval(stepInterval)
                        clearInterval(clock)
                        clearInterval(validator)

                        //rekord eredmény mentése/frissítése
                        if(Number(localStorage.getItem('record')) < Number(actualScore.textContent))
                        {
                            localStorage.setItem('record', Number(actualScore.textContent).toString())
                            record.textContent = zfill(actualScore.textContent, 5)
                        }
                        gameOverZone.style.display = 'block'

                        //újrakezdés késleltetése
                        isEnded = true
                        setTimeout(()=>{
                            if(isStarted && isEnded)
                            {
                                isStarted = false
                                isEnded = false
                            }
                            
                        }, 1000)
                    }
                }
            })
        }, 5)
    }
    //#endregion

    //funkciók meghívása
    const Session = () => {
        step()
        simulation()
        validate()
        timer()
    }

    Session()
}

const Start = () => {
    isStarted = true, isEnded = false
    console.log("start") 
    
    dino.setAttribute('style', '')
    document.querySelectorAll('.cactus').forEach((cactus)=>{
        cactus.remove()
    })
    gameOverZone.style.display = 'none'
    Main()
}

window.addEventListener('keydown', (event)=>{
    if(!isStarted && !isEnded && event.key == " "){
        Start()
    }
})





////////////////EZ egy debug funkció, hogy a dínó hozzáér-e a kaktuszhoz//////////////////
const check = () => {
    let cactuses = document.querySelectorAll('.cactus')
            cactuses.forEach((cactus)=>{
                let dProps = dino.getBoundingClientRect() //dino tulajdonságai
                let cProps = cactus.getBoundingClientRect() //cactus tulajdonságai

                if((dProps.right >= cProps.left && dProps.bottom>=cProps.top && dProps.right<=cProps.right) 
                    || (dProps.right>cProps.right && dProps.left<=cProps.right && dProps.bottom>=cProps.top))
                {
                    
                    let isSensorInit = false
                    let sensors = document.querySelectorAll('.sensor')
                    let sensorsCac = cactus.querySelector('.sensors').querySelectorAll('.sensorCac')
                    for(let sensor of sensors){
                        let sProps = sensor.getBoundingClientRect()
                        if((sProps.bottom>=cProps.top && sProps.right < cProps.left) || (sProps.bottom < cProps.top) || (sProps.bottom>=cProps.top && sProps.left>cProps.right)){
                            continue
                        }
                        else{
                            for(let sensorCac of sensorsCac){
                                let scProps = sensorCac.getBoundingClientRect()
                                if((sProps.bottom>=scProps.top && sProps.right < scProps.left) || (sProps.bottom<scProps.top) || (sProps.bottom>=scProps.top && sProps.left>scProps.right))
                                    continue
                                else{
                                    isSensorInit = true
                                    break
                                }
                            }
                        }
                    }

                    
                    console.log(`Dino sensor: ${isSensorInit}`)
                }})
}