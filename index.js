const fetch = require('node-fetch')

/**
 * Gets the question's data
 * @param {String} url 
 * @returns {JSON} data
 */
async function getData(url) {
    const res = await fetch(url)
    const data = await res.json()

    if(!res.ok) {
        throw new Error(`${res.status}: ${data.message}`)
    }

    return data
}

/**
 * Sends data to the API
 * @param {String} url 
 * @param {Object} body
 * @returns {JSON} next url
 */
async function postData(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(body)
    })
    const data = await res.json()

    if(!res.ok) {
        const message = `${res.status}: ${data.message}`
        throw new Error(message)    
    }

    return data
}

/**
 * @param {JSON} rules 
 * @param {Array} numbers 
 * @returns {Object} answerObject
 */
function resolveTest(rules, numbers) {
    const finalResult = numbers.map(testedNumber => {
        let result=""
        rules.map(rule => {
            if(testedNumber % rule.number === 0) {
                result = result + rule.response
            }
        })
        return testedNumber = result === "" ? testedNumber : result
    })

    return { answer: finalResult.join(' ') }
}


async function resolveFizzbot() {
    const baseUrl = "https://api.noopschallenge.com"
    let body = {answer: "JS"}
    let path = "/fizzbot/questions/1"
    let isRunning = true

    while(isRunning) {
        console.log(`answer = ${JSON.stringify(body)}`)
        const {nextQuestion, message} = await postData(baseUrl + path, body).catch(e => console.log(e.message))
        console.log(message)
        
        if(nextQuestion) {
            path = nextQuestion
            const {rules, numbers} = await getData(baseUrl + path).catch(e => console.log(e.message))
            console.log(JSON.stringify(rules), numbers)
            body = resolveTest(rules, numbers)
        } else {
            isRunning = false
        }
    }    
}

resolveFizzbot()