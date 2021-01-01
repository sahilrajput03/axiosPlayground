// export class Testing2 extends React.Component {
//   state = {width: 200, height: 200};

//   onResize = (event, {element, size}) => {
//     this.setState({width: size.width, height: size.height});
//   };

//   render() {
//     return (
//       <div>
//         <div className="layoutRoot">
//           <hr />
//           <Resizable
//             className="box"
//             height={this.state.height}
//             width={this.state.width}
//             onResize={this.onResize}
//           >
//             <div
//               className="box"
//               style={{
//                 width: this.state.width + 'px',
//                 height: this.state.height + 'px'
//               }}
//             >
//               <span className="text">
//                 {'Raw use of <Resizable> element. 200x200, no constraints.'}
//               </span>
//             </div>
//           </Resizable>
//         </div>
//       </div>
//     );
//   }
// }
