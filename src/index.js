import React, { Component } from 'react';
import ModalSelect from './components/ModalSelect';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false
    };
  }

  modalSure = () => {};

  closeModal = () => {
    this.setState({
      isShow: false
    });
  };

  show = () => {
    this.setState({
      isShow: true
    });
  };

  hide = () => {
    this.setState({
      isShow: false
    });
  };

  render() {
    const data = [
      {
        ibm: 1,
        note: '世界1'
      },
      {
        ibm: 2,
        note: '世界2'
      },
      {
        ibm: 3,
        note: '世界3'
      }
    ];
    return (
      <div>
        <button type="button" onClick={this.show}>弹出</button>
        <button type="button" onClick={this.hide}>关闭</button>
        <ModalSelect dataSource={data} isShow={this.state.isShow} width={800} closeModal={this.closeModal} modalSure={this.modalSure} isMulti isSearch checkAll />
      </div>
    );
  }
}

export default App;
