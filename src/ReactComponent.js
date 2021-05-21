import React from 'react'

function ReactComponent() {
  const [state1, setState1] = useState('good state')

  const staticObject = useRef()

  // usage: staticObject.current = ALWAYS CONSTANT, IT DOESN"T RE-render on when we change the staticObejce.

  //
  const [] = useMemo()
  const [] = useCallback()

  useEffect(() => {
    setState('')
  }, [state1])

  return <div></div>
}

export default ReactComponent
