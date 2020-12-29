/* eslint-disable no-eval, no-unused-vars */
import React, {useEffect, useState, useRef} from 'react';
import './styles.css';
import axios from 'axios';
import {useLocalStorage} from './useLocalStorage';
import {riskyCode} from './riskyCode';
import {useWhat, getWhat, useWhatPersistent} from 'usewhat';
import {useDebounce} from 'use-debounce';
import {v4} from 'uuid';
//new deployment @ https://csb-nljvu.netlify.app/
let log = console.log;
document.axios = axios;

let postRef;

export default function App() {
  // const dbPrefix = 'https://jsonbackendserver.herokuapp.com';
  const [dbPrefix, setDbPrefix] = useWhatPersistent(
    'dbprefix',
    'https://e53e8cfe24ac.ngrok.io'
  );
  // using useLocalStorage here throws warning that circular objects can't be converted ..blah blah.., dig it out...
  // const [allUnits, setAllUnits] = useState([<Unit key={Math.random()} />]);
  const [login, setLogin] = useWhatPersistent('login', 'guest');
  const [db, setDb] = useWhatPersistent('db', 'one');
  // const [db_localStorage, setDb_localStorage] = useLocalStorage('db', null);
  // if (db !== db_localStorage) setDb_localStorage(db);
  const [allUnits, setAllUnits] = useWhat('allUnits', []);
  const [count, setCount] = useState(1);
  let fetchRef = useRef();

  fetchRef = () => {
    log('fetchref executed');
    axios.post(`${dbPrefix}/${login}_${db}`).then(({data}) => {
      setAllUnits(data.allUnits instanceof Array ? data.allUnits : []);
      log('#fetched from', login + db, data);
      // log('#fetched', data.allUnits);
    });
  };

  postRef = (allUnitsNew) => {
    axios.post(`${dbPrefix}/${login}_${db}`, {allUnits: allUnitsNew});
    log(allUnitsNew);
    log('#posted to =>', login + '_' + db);
  };

  const ClearButton = (
    <button
      onClick={() => {
        setAllUnits([]);
        localStorage.clear();
      }}
    >
      Clear List
    </button>
  );

  useEffect(() => {
    fetchRef();
  }, [db, dbPrefix]);

  const dbsetbuttons = ['one', 'two', 'three'].map((dbName, idx) => (
    <button
      key={idx}
      onClick={() => {
        setDb(dbName);
      }}
    >
      Set db to {dbName}
    </button>
  ));

  const Login = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        fetchRef();
      }}
    >
      <input value={login} onChange={({target: {value}}) => setLogin(value)} />
    </form>
  );

  return (
    <div>
      → Enter your desired username to login - {Login}
      <br />→ Current db: <b>{db}</b> <br />
      {dbsetbuttons} <br />
      {allUnits?.map((element) => (
        <Unit
          key={element.ID}
          ID={element.ID}
          inputCode={element.inputCode}
          result={element.result}
          requestName={element.requestName}
        />
      ))}
      <br />
      <br />
      <br />
      <button
        onClick={() => {
          const allUnitsNew = [
            ...allUnits,
            {ID: v4(), requestName: `Request ${allUnits.length + 1}`}
          ];
          setAllUnits(allUnitsNew);
          postRef(allUnitsNew);
        }}
      >
        Add request (unit)
      </button>
      {ClearButton}
      <br />
      <br />→ Logged in as <b>{login}</b>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <b>Disclaimer:</b>
      <br /> 1. No signup required <br /> 2. For now there's no securitey to any
      account.
      <br /> 3. Tip: Press enter to login. or `sahil`).
      <br />
      4. Tip: For testing use either `sahil` or `guest`.
      <br />
      Happy Hacking!
      <br />
      <br />
      Input backend database url to use:
      <input
        value={dbPrefix}
        onChange={({target: {value}}) => setDbPrefix(value)}
      />
    </div>
  );
}

function Unit({
  inputCode: inputCode_remote,
  ID,
  result: resul_remote,
  requestName
}) {
  const [inputCode, setInputCode] = useState(
    inputCode_remote ?? "axios.get('https://reverberate.ml')"
  );
  const [result, setResult] = useState(resul_remote ?? '');
  const [allUnits, setAllUnits] = getWhat('allUnits');
  const [combinedDebounce] = useDebounce(inputCode + result, 2000);
  const [db] = getWhat('db');

  useEffect(() => {
    let allUnitsNew = allUnits.map((e) =>
      e.ID === ID ? {...e, inputCode, result} : e
    );

    setAllUnits(allUnitsNew);
    postRef(allUnitsNew);
    //  eslint-disable-next-line
  }, [combinedDebounce]);
  return (
    <fieldset className="App">
      <legend>{requestName}</legend>
      <textarea
        value={inputCode}
        placeholder="Write some request with axios, say get/delete/post whatever you like."
        onChange={({target: {value}}) => {
          setInputCode(value);
        }}
      />
      <button
        onClick={() => {
          riskyCode(async () => {
            let {data} = await eval('document.' + inputCode);
            if (typeof data === 'object')
              setResult(JSON.stringify(data, null, 2));
            else {
              setResult(data);
            }
          }, setResult);
        }}
      >
        Fire request !!
      </button>
      <br />
      <pre id="result">{result}</pre>
    </fieldset>
  );
}
