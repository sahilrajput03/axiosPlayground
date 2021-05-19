/* eslint-disable no-eval, no-unused-vars */
import React, {useEffect, useState, useRef} from 'react'
import './styles.css'
import axios from 'axios'
import {useLocalStorage} from './useLocalStorage'
import {riskyCode} from './riskyCode'
import {log, useWhat, getWhat, useWhatPersistent} from 'usewhat'
import {useDebounce} from 'use-debounce'
import {v4} from 'uuid'
import {MyResizable} from './Testing.js'
import {Footer} from './Footer'
//new deployment @ https://csb-nljvu.netlify.app/

document.axios = axios
let postRef

const localDbUrl = 'https://e53e8cfe24ac.ngrok.io'
const prodDbUrl = 'https://jsonbackendserver.herokuapp.com'
const isProd = true

export default function App() {
  const [dbPrefix, setDbPrefix] = useWhatPersistent('dbprefix', isProd ? prodDbUrl : localDbUrl)

  // using useLocalStorage here throws warning that circular objects can't be converted ..blah blah.., dig it out...
  // const [allUnits, setAllUnits] = useState([<Unit key={Math.random()} />]);
  const [login, setLogin] = useWhatPersistent('login', 'guest')
  const [db, setDb] = useWhatPersistent('db', 'one')
  // const [db_localStorage, setDb_localStorage] = useLocalStorage('db', null);
  // if (db !== db_localStorage) setDb_localStorage(db);
  const [allUnits, setAllUnits] = useWhatPersistent('allUnits', [])
  // const [allUnits, setAllUnits] = useWhat("allUnits", []);
  const [count, setCount] = useState(1)
  let fetchRef = useRef()

  fetchRef = () => {
    log('fetchref executed')
    axios
      .post(`${dbPrefix}/${login}_${db}`)
      .then(({data}) => {
        setAllUnits(data.allUnits instanceof Array ? data.allUnits : [])
        log('#fetched from', login + db, data)
        // log('#fetched', data.allUnits);
      })
      .catch((e) => {})
  }

  postRef = (allUnitsNew) => {
    axios.post(`${dbPrefix}/${login}_${db}`, {allUnits: allUnitsNew}).catch((e) => {})
    log(allUnitsNew)
    log('#posted to =>', login + '_' + db)
  }

  const ClearButton = (
    <button
      className='btn-blue'
      onClick={() => {
        setAllUnits([])
        localStorage.clear()
      }}>
      Clear List
    </button>
  )

  useEffect(() => {
    fetchRef()
  }, [db, dbPrefix])

  const DbButtons = () =>
    ['one', 'two', 'three'].map((dbName, idx) => (
      <button
        className='btn-blue'
        key={idx}
        onClick={() => {
          setDb(dbName)
        }}>
        Set db to {dbName}
      </button>
    ))

  const Login = (
    <form
      className='inline'
      onSubmit={(e) => {
        e.preventDefault()
        fetchRef()
      }}>
      <input className='input-change-user' value={login} onChange={({target: {value}}) => setLogin(value)} />
    </form>
  )

  return (
    <div className='container'>
      <header>
        <h1>Axios Playground</h1>
        <h4>100% ready for your offline needs for storing your axios requests and responses.</h4>
        <h5>
          <span className='emoji-medium'>🤠︎</span> FYI: All your request and request responses are persistent. Every 2 secs cache is saved to the server.
        </h5>
      </header>
      {/*  */}
      <section>
        <span class='emoji-medium'>🧑︎‍🚀︎</span> You: <b>{login}</b>
      </section>
      {/*  */}
      <section className='login-section'>
        <span className='emoji-medium'>🔨︎</span> Change user 📢︎ {Login}
      </section>
      {/*  */}
      <section className='height-30'>
        <span className='emoji-medium'>🔨︎</span> Active db: <b className='db-name'>{db}</b>
      </section>
      {/*  */}
      <section className='db-buttons'>
        <DbButtons />
      </section>
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
          postRef(allUnitsNew)
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
    postRef(allUnitsNew)
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
          riskyCode(async () => {
            let {data} = await eval('document.' + inputCode)
            if (typeof data === 'object') setResult(JSON.stringify(data, null, 2))
            else {
              setResult(data)
            }
          }, setResult)
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
          riskyCode(async () => {
            // let {data} = await eval('document.' + inputCode)
            // if (typeof data === 'object') setResult(JSON.stringify(data, null, 2))
            // else {
            //   setResult(data)
            // }
          }, setResult)
        }}>
        Delete
      </button>
    </fieldset>
  )
}
