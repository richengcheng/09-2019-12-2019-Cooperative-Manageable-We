import React from 'react';

 class Hello extends React.Component {

   constructor(props){
       super(props);
       this.state = {
          name : this.props.name,
          color: "black"
         }
         this.setColor = this.setColor.bind(this);
         this.revertColor = this.revertColor.bind(this); 
    }
    
    setColor(){
        this.setState({color:"green"});
        }
       
        revertColor(){
        this.setState({color:"black"});
        }
       
        render() {
         return <h1 onMouseEnter={this.setColor} onMouseLeave={this.revertColor} style={{
         color:this.state.color}}>Hello {this.props.name}</h1>;
          }
  }
 
 export default Hello;

