import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {languages} from './languages'
import { clsx } from "clsx"
import { getFarewellText } from "./utils"
import { randWord } from './utils'
import Confetti from "react-confetti"

export default function AssemblyEndgame() {
  

  const [currentWord,setcurrentWord]=useState(()=>randWord())
  console.log(randWord())
  const [guess,setguess]=useState([])
  const wrongGuesscount=guess.filter(letter=> !currentWord.includes(letter)).length
  const won=currentWord.split("").every(letter=>guess.includes(letter))
  const lost=wrongGuesscount>=languages.length-1
  const over= won || lost
  const lastGuessedletter=guess[guess.length-1]
  const isLastGuessIncorrect=lastGuessedletter && !currentWord.includes(lastGuessedletter)

  const alphabet = "abcdefghijklmnopqrstuvwxyz"
   function addGuess(letter){
    setguess(prevletters=>
      prevletters.includes(letter)?prevletters:[...prevletters,letter]
    )
   }

   function startNewgame(){
    setcurrentWord(randWord())
    setguess([])
   }
  
  const langElements=languages.map(
    (lang,index)=>{
      const isLost= index<wrongGuesscount
      const styles={
        backgroundColor:lang.backgroundColor,
        color:lang.color,
        
      }
      const className=clsx("chip",isLost && "lost")
      return(
      <span 
        key={lang.name}
        style={styles}
        className={className}>
        {lang.name}
      </span>
      )
    
    }
  )
  const letterElements=currentWord.split("").map(
    (word,index)=>{
      const reveal=lost || guess.includes(word)
      return(<span key={index}>{reveal? word.toUpperCase():""}</span>)}
  )

  const keyboard=alphabet.split("").map(letter=>{
    const isGuessed=guess.includes(letter)
    const isCorrect=isGuessed && currentWord.includes(letter)
    const isWrong=isGuessed && !currentWord.includes(letter)
    const className=clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return(<button className={className}
      onClick={()=>addGuess(letter)} key={letter} disabled={over}>
        {letter}
      </button>)
  })

 const gameStatClassName=clsx("game_stat",{
  won:won, lost:lost, farewell: !over && isLastGuessIncorrect
 })

 function renderGameStatus(){
  if(!over && isLastGuessIncorrect){
    return(
      <p className="farewell-messsage">
        {getFarewellText(languages[wrongGuesscount-1].name)}
      </p>
    )
  }
  if(won){
    return(
      <>
        <h2>You win!</h2>
        <p>Well done! 🎉</p>
      </>
    )
  }
  if(lost){
    return(
      <>
      <h2>Game over!</h2>
      <p>You lose! Better start learning Assembly 😭</p>
      </>
    )
  }
  return null
 }

  return (
    
    <main>
      {
                won && 
                    <Confetti
                        recycle={false}
                        numberOfPieces={1000}
                    />
            }
    <header>
      <h1>Assembly: Endgame</h1>
      <p className='desc'>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
    </header>
    <section className={gameStatClassName}>
      {renderGameStatus()}
    </section>
    <section className='lang_chips'>
      {langElements}
    </section>
    <section className='word'>
      {letterElements}
    </section>
    <section className='keyboard'>
        {keyboard}
      </section>
      {over && <button className="new-game" onClick={startNewgame}>New Game</button>}
    
      
    </main>
    
  )
}


