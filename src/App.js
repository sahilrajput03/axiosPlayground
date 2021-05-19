/* eslint-disable no-eval, no-unused-vars */
import React, {useEffect, useState, useRef} from 'react'
import './styles.css'
import axios from 'axios'
// import {useLocalStorage} from './useLocalStorage'
import {log, useWhat, getWhat, useWhatPersistent} from 'usewhat'
import {useDebounce} from 'use-debounce'
import {v4} from 'uuid'
import {MyResizable} from './Testing.js'
import {Footer} from './Footer'
//new deployment @ https://csb-nljvu.netlify.app/

document.axios = axios
let postRefGlobal

const localDbUrl = 'https://e53e8cfe24ac.ngrok.io'
const prodDbUrl = 'https://jsonbackendserver.herokuapp.com'
const isProd = true

export default function App() {
  const [dbPrefix, setDbPrefix] = useWhatPersistent('dbprefix', isProd ? prodDbUrl : localDbUrl)

  // using useLocalStorage here throws warning that circular objects can't be converted ..blah blah.., dig it out...
  // const [allUnits, setAllUnits] = useState([<Unit key={Math.random()} />]);
  const [login, setLogin] = useWhatPersistent('login', 'guest')
  const [activeLogin, setActiveLogin] = useWhatPersistent('active-login', 'guest')
  const [sheet, setSheet] = useWhatPersistent('sheet', 'one')
  const [activeSheet, setActiveSheet] = useWhatPersistent('active-sheet', 'one')
  // const [db_localStorage, setDb_localStorage] = useLocalStorage('db', null);
  // if (db !== db_localStorage) setDb_localStorage(db);
  const [allUnits, setAllUnits] = useWhatPersistent('allUnits', [])
  // const [allUnits, setAllUnits] = useWhat("allUnits", []);
  const [count, setCount] = useState(1)
  let fetchRef = useRef()

  fetchRef = () => {
    log('fetchref executed')
    // log({sheet})
    axios
      .post(`${dbPrefix}/${login}_${sheet}`)
      .then(({data}) => {
        setAllUnits(data.allUnits instanceof Array ? data.allUnits : [])

        setActiveSheet(sheet)
        setActiveLogin(login) // ? Wow this is awesome!! 4 stage status of state implemented 🥳︎.
        log('#fetched from', login + sheet, data)
        // log('#fetched', data.allUnits);
      })
      .catch((e) => {})
  }

  postRefGlobal = (allUnitsNew) => {
    axios.post(`${dbPrefix}/${login}_${sheet}`, {allUnits: allUnitsNew}).catch((e) => {})
    log({allUnitsNew})
    // alert('saved...')
    const notificationEl = document.querySelector('.notification-message')
    if (notificationEl) {
      notificationEl.style.display = 'block'

      setTimeout(() => {
        notificationEl.style.display = 'none'
      }, 1500)

      // Purged Code....
      // notificationEl.innerText = 'Saved...'
      // notificationEl.style.backgroundColor = 'yellow'
      // notificationEl.innerText = ''
    }
    log('#posted to =>', login + '_' + sheet)
  }

  const ClearButton = (
    <button
      className='btn-blue'
      onClick={() => {
        setAllUnits([])
        // localStorage.clear() // 🛑︎🛑︎🛑︎did it a moment ago coz i think this not what i want..
        // below is 🔥︎ 🔥︎experimental code...
        postRefGlobal([])
      }}>
      Clear List
    </button>
  )

  useEffect(() => {
    fetchRef()
  }, [sheet, dbPrefix])

  const ChooseSheet = ({activeSheet}) =>
    ['one', 'two', 'three'].map((sheetNameValue, idx) => (
      <button
        className='btn-blue'
        style={activeSheet === sheetNameValue ? {backgroundColor: 'deeppink'} : {}}
        // style={ activeSheet === sheetNameValue ? }
        key={idx}
        onClick={() => {
          setSheet(sheetNameValue)
        }}>
        {sheetNameValue}
      </button>
    ))

  return (
    <div className='container'>
      <div className='notification-message'>Saved... 🚀︎</div>
      <header>
        <h1>Axios Playground</h1>
        <h4>100% ready for your offline needs for storing your axios requests and responses.</h4>
        <h5>
          <span className='emoji-medium'>🤠︎</span> FYI: All your request and request responses are persistent. Every 2 secs cache is saved to the server.
        </h5>
      </header>
      {/*  */}
      <section className='row space-between'>
        <div className='col'>
          <div className='flex-start row-centered'>
            <span class='emoji-medium'>🧑︎‍🚀︎</span> You - <b className='margin-left-6'>{activeLogin}</b>
          </div>
          {/*  */}
          <div className='flex-start height-30 row-centered'>
            <span className='emoji-medium'>📁︎ </span> Active sheet - <b className='margin-left-6'>{activeSheet}</b>
          </div>
        </div>
        {/*  */}
        <div className='col'>
          <div className='flex-end login-section row-centered'>
            <span className='emoji-medium'>📢︎ </span> Change user : <Login fetchRef={fetchRef} login={login} setLogin={setLogin} />
          </div>
          {/*  */}
          <div className='flex-end login-section row-centered'>
            <span className='emoji-medium'>📁︎</span> <span class='change-sheet-text'>Change sheet :</span>
            <ChooseSheet activeSheet={activeSheet} />
          </div>
        </div>
      </section>
      {/*  */}
      {/* <section className='db-buttons'></section> */}
      <br />
      <br />
      <br />
      {allUnits?.map((element) => (
        <Unit key={element.ID} ID={element.ID} inputCode={element.inputCode} result={element.result} requestName={element.requestName} />
      ))}
      <br />
      <br />
      <br />
      <button
        className='btn-blue'
        onClick={() => {
          const allUnitsNew = [...allUnits, {ID: v4(), requestName: `Request ${allUnits.length + 1}`}]
          setAllUnits(allUnitsNew)
          postRefGlobal(allUnitsNew)
        }}>
        Add a request
        {/* add a unit request... */}
      </button>
      {ClearButton}
      <br />
      <Footer />
      🔥︎🔥︎ TESTING: Input backend database url to use:
      <input value={dbPrefix} onChange={({target: {value}}) => setDbPrefix(value)} />
    </div>
  )
}

const Login = ({fetchRef, login, setLogin}) => (
  <form
    className='inline'
    onSubmit={(e) => {
      e.preventDefault()
      fetchRef()
    }}>
    <input className='input-change-user' value={login} onChange={({target: {value}}) => setLogin(value)} />
  </form>
)

function Unit({inputCode: inputCode_remote, ID, result: resul_remote, requestName}) {
  const [inputCode, setInputCode] = useState(inputCode_remote ?? "axios.get('https://reverberate.ml')")
  const [result, setResult] = useWhatPersistent(requestName, resul_remote ?? '') // ? Testing(Works perferctly fine for now!!) for storing result to local storage too.
  // const [result, setResult] = useState(resul_remote ?? "");
  const [allUnits, setAllUnits] = getWhat('allUnits')
  const [combinedDebounce] = useDebounce(inputCode + result, 2000)
  const [db] = getWhat('db')
  const [dbPrefix, _] = getWhat('dbprefix')

  useEffect(() => {
    let allUnitsNew = allUnits.map((e) => (e.ID === ID ? {...e, inputCode, result} : e))

    setAllUnits(allUnitsNew)
    postRefGlobal(allUnitsNew)
    //  eslint-disable-next-line
  }, [combinedDebounce])
  return (
    <fieldset className='App'>
      <legend>{requestName}</legend>
      <textarea
        value={inputCode}
        rows='1'
        // wow.. ^^ thats what I wanted...!!
        placeholder='Write some request with axios.'
        onChange={({target: {value}}) => {
          setInputCode(value)
        }}
      />
      <button
        className='btn--fire-request'
        onClick={() => {
          // Calling async function with 0 delay 🚀︎🚀︎🚀︎...
          setTimeout(async () => {
            try {
              let {data} = await eval('document.' + inputCode)
              if (typeof data === 'object') {
                setResult(JSON.stringify(data, null, 2))
              } else {
                setResult(data)
              }
            } catch (err) {
              log('#caught::', err)
              setResult(
                `REQUEST FALIED !\n Possible errors are - 1. Syntax errors, 2. Target doesn't supports 'CORS'. \n\n\n 🛑︎ Javascript compiler threw - \n    ${err.name} \n    ${err.message}`
              )
            } finally {
              let allUnitsNew = allUnits.map((e) => (e.ID === ID ? {...e, result} : e))

              setAllUnits(allUnitsNew)
              postRefGlobal(allUnitsNew)
            }
          })

          // riskyCode(, setResult)
        }}>
        🔥︎ Fire request
      </button>

      <br />
      {/* <textarea className="result-new">{result}</textarea> THIS DOESN'T WORK GOOD. */}
      <MyResizable content={result} />
      {/* <pre id="result">{result}</pre> */}
      <button
        className='btn--delete-request'
        onClick={() => {
          // ...😬︎😬︎😬︎😬︎😬︎
          // log({allUnits})
          let allUnitsNew = allUnits.filter((e) => e.ID !== ID)

          setAllUnits(allUnitsNew)
          postRefGlobal(allUnitsNew)
        }}>
        Delete
      </button>
    </fieldset>
  )
}
