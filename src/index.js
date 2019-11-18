import React, { Component } from 'react';
import ModalSelect from './components/ModalSelect';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false
    };
  }

  modalSure = (value, record, key) => {
    console.log('value,selectContent,key', value, record, key);
  };

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
        <button type="button" onClick={this.show}>
          弹出
        </button>
        <button type="button" onClick={this.hide}>
          关闭
        </button>
        <ModalSelect
          dataSource={data}
          defaultValue="3"
          title="证件类别"
          valueKey={{
            id: 'ibm',
            note: 'note'
          }}
          visible={this.state.isShow}
          width={1000}
          closeModal={this.closeModal}
          modalSure={this.modalSure}
          isMultil
          hasSearch
          hasCheckAll
          disableItem={['1']}
          itemSize="small"
        />
      </div>
    );
  }
}

export default App;
