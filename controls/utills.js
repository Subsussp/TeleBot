const axios  = require('axios')

let chocies = 'abcd'
let Cchocies = 'ABCD'

const getSeparated = (data,letternum) =>{
    let page = data
    let questions = []
    let answers = []
    let last = 0;
    let cond = letternum ? letternum + 1 : 1
    let letter
    for(let i = 1 * cond;i < 100;i++){
        let indexofquestion = page.indexOf(`${i}.`)
        if(indexofquestion != -1){
            let substr = page.slice(indexofquestion)
            let index = substr.indexOf('a)') == -1 ? substr.indexOf('A)') : substr.indexOf('a)')
            letter = substr.indexOf('a)') == -1 ? 'C' : 'S'
            let subanswer = substr.slice(index,(substr.indexOf(`${i+1}.`) == -1 ? -1 : (substr.indexOf(`${i+1}.`) - 2))).replaceAll('\n','').replaceAll('\\','')
            substr = substr.slice(0,index).replaceAll('\n','').replaceAll('\\','')
            answers.push(subanswer)
            questions.push(substr)
            page = page.slice(page.indexOf(`${i + 1}.`) == -1 ? -1 : (page.indexOf(`${i + 1}.`) - 2 ))
            last = i
        }
    }
    
    return [questions,getAnswers(answers,letter),last]
}
const getAnswers = (data,letter) =>{
    let arrayofarrays = [] 
    for(let i = 0;i < data.length;i++){
        let array = []
        for(let g = 0;g < 4;g++){
            array.push(data[i].slice(data[i].indexOf(`${letter == 'C' ? Cchocies[g] : chocies[g]})`),data[i].indexOf(`${letter == 'C' ? Cchocies[g + 1]:chocies[g + 1]})`)))
        }
        arrayofarrays.push(array)
    }
    return arrayofarrays
}

const postpoll =async (question,answers) =>{
    let chociee = 'abcd'
    console.log('Timer')
    let Correct = answers[3].slice(answers[3].indexOf('Correct answer:') == -1 ? answers[3].indexOf('Answer:') : answers[3].indexOf('Correct answer:') )
    answers[3] = answers[3].slice(0,answers[3].search('Correct answer:')== -1 ?  answers[3].search('Answer:'):answers[3].search('Correct answer:')) 
    let indexofcorrect;
    for(let i =0;i< 4;i++){
        Correct.includes(`${chociee[i]})`) ? indexofcorrect = (i) : ''
        Correct.includes(`${chociee[i].toUpperCase()})`) ? indexofcorrect = (i) : ''
    }
    let config = {
      'chat_id' : -1002485702431,
      'question': question,
      'options': JSON.stringify(answers),
      'correct_option_id': indexofcorrect,
      "type":"quiz"
    }
    await axios.get('https://api.telegram.org/bot7929845354:AAG7Dop1Vaekyc5gV0tbS13LKJ_ttC3WDGQ/sendpoll',{data:config}).catch((err)=>console.log(err))

}

module.exports = {getSeparated,postpoll}