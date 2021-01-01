import React, {useState, useEffect} from 'react';
import {withResizeDetector} from 'react-resize-detector';
import {Resizable, ResizableBox} from 'react-resizable';
import {log} from 'usewhat';

export const MyResizable = ({content}) => {
  const [state, setState] = useState({
    width: 600,
    // width: 'auto',
    height: 200
  });
  const onResize = (event, {element, size, handle}) => {
    log(size);
    setState({width: size.width, height: size.height});
  };

  return (
    <div>
      <Resizable
        className="box"
        height={state.height}
        width={state.width}
        onResize={onResize}
      >
        <div
          className="box"
          style={{
            width: state.width + 'px',
            height: state.height + 'px'
          }}
        >
          <span className="text">
            {/* {'Raw use of <Resizable> element. 200x200, all Resize Handles.'} */}
            <pre style={{height: state.height - 15}}>{content}</pre>
          </span>
          {/* <button onClick={onResetClick} style={{marginTop: '10px'}}>
            Reset this element's width/height
          </button> */}
        </div>
      </Resizable>
    </div>
  );
};
