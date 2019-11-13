/**
 * @file search/searchTop.js
 * @author zzc
 */
import React, { Component } from 'react';

import { Button, Modal, Checkbox, Input } from 'antd';

import PropTypes from 'prop-types';

import _ from 'lodash';

import styles from './modalSelect.less';

const CheckboxGroup = Checkbox.Group;
const saveOpts = [{ label: '全选', value: '1' }];

export default class ModalSelect extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    defaultValue: PropTypes.string, // select 传值
    modalSure: PropTypes.func.isRequired,
    checkAll: PropTypes.bool, // 可以选择全部
    isMulti: PropTypes.bool, // 可以多选
    isSearch: PropTypes.bool, // 可以搜索
    isSure: PropTypes.bool, // 是否必选
    modalTitle: PropTypes.string, // select 类别
    selectCode: PropTypes.string, // select 类别代码
    resetValue: PropTypes.string, // 重置value
    maxLength: PropTypes.string, // 最大数据量，多的不展示
    disAbleItem: PropTypes.array, // 禁止修改的选项
    isShow: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    itemSize: PropTypes.string, // 选择项的大小
    width: PropTypes.number,
    wrapClassName: PropTypes.string,
    afterClose: PropTypes.func,
    bodyStyle: PropTypes.object,
    centered: PropTypes.bool,
    closeIcon: PropTypes.object,
    destroyOnClose: PropTypes.bool,
    forceRender: PropTypes.bool,
    keyboard: PropTypes.bool,
    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    maskStyle: PropTypes.object,
    style: PropTypes.object,
    zIndex: PropTypes.number
  };

  static defaultProps = {
    defaultValue: '',
    checkAll: false,
    isMulti: false,
    isSearch: false,
    isSure: true,
    modalTitle: '证件类别',
    selectCode: '',
    resetValue: '',
    maxLength: 100,
    disAbleItem: [],
    itemSize: 'normal',
    width: 600,
    wrapClassName: '',
    closeIcon: {},
    centered: false,
    style: {},
    maskStyle: {},
    bodyStyle: {},
    mask: true,
    maskClosable: true,
    keyboard: false,
    zIndex: 9,
    forceRender: false,
    destroyOnClose: false,
    afterClose: () => {}
  };

  constructor(props) {
    super(props);

    const { defaultValue, dataSource } = props;
    this.state = {
      changFlag: false,
      defaultItem: [],
      value: '',
      selectContent: this.getNote(defaultValue, dataSource),
      newNum: parseInt(Math.random() * 1000000 + 1, 10)
    };
  }

  componentWillMount() {
    const { defaultValue, dataSource } = this.props;
    this.setState({
      defaultItem: defaultValue ? defaultValue.split(';') : [],
      changFlag: this.initFundChange(defaultValue ? defaultValue.split(';') : []),
      selectContent: this.getNote(defaultValue, dataSource),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { defaultValue, dataSource } = nextProps;
    this.setState({
      defaultItem: defaultValue ? defaultValue.split(';') : [],
      changFlag: this.initFundChange(defaultValue ? defaultValue.split(';') : []),
      selectContent: this.getNote(defaultValue, dataSource),
    });
  }

  getNowArray(props, value) {
    const { maxLength, dataSource } = props;
    let arr = _.cloneDeep(
      value
        ? _.filter(dataSource, (item) => {
            return item.note.indexOf(value) > -1;
          })
        : dataSource
    );
    if (maxLength && !isNaN(_.parseInt(maxLength)) && dataSource.length > _.parseInt(maxLength)) {
      arr = arr.slice(0, _.parseInt(maxLength) - 1);
    }
    return arr;
  }

  // 传值 note

  getNote = (value, dataSource) => {
    if (!value) {
      return '';
    }
    if (!_.isEmpty(dataSource)) {
      const valueLi = value ? value.split(';') : [];
      const txtArr = [];
      for (let i = 0; i < valueLi.length; i++) {
        const objFund = _.find(dataSource, { ibm: parseInt(valueLi[i], 10) }) || _.find(dataSource, { ibm: valueLi[i] }) || {};
        txtArr.push(objFund.note ? objFund.note : valueLi[i]);
      }
      return txtArr.length > 0 ? txtArr.join('；') : '';
    }
    return '';
  };

  // 选择项初始化
  ListCreateHtml = (value, defaultItem) => {
    const { selectCode, disAbleItem } = this.props;
    const { newNum } = this.state;
    const newCbm = 'ibm';
    const showInfo = this.getNowArray(this.props, value);

    if (_.isEmpty(showInfo)) {
      return (
        <li key="noKey" className={styles.stepLi}>
          <span>无</span>
          <i className={styles.stepYes} />
        </li>
      );
    }
    const country = [];
    showInfo.forEach((item) => {
      if (item.note.indexOf(value) > -1) {
        country.push(
          <li
            id={`li_${item[newCbm]}_${newNum}_${selectCode}`}
            value={item[newCbm]}
            key={item[newCbm]}
            className={`
              ${styles.stepLi}
              ${_.indexOf(defaultItem, _.toString(item[newCbm])) > -1 ? styles.on : ''}
              ${_.indexOf(disAbleItem, _.toString(item[newCbm])) > -1 ? styles.disChange : ''}
            `}
            onClick={() => {
              return this.checkItem2(item);
            }}
          >
            <span>{item.note}</span>
            <i className={styles.stepYes} />
          </li>
        );
      }
      return country;
    });
    return country;
  };

  // 选择项数组
  infoArrayCreat = (value) => {
    const { dataSource } = this.props;
    if (_.isEmpty(dataSource)) {
      return [];
    }
    let newArr = [];
    if (value) {
      dataSource.map((item) => {
        if (item.note.indexOf(value) > -1) {
          newArr.push(item);
        }
        return newArr;
      });
    } else {
      newArr = _.cloneDeep(dataSource);
    }
    return newArr;
  };

  // 筛选出可选数据
  filterSelectData = (dataSource, disAbleItem) => {
    const arrs = [];
    if (disAbleItem && dataSource) {
      for (let i = 0; i < dataSource.length; i++) {
        if (!_.includes(disAbleItem, _.toString(dataSource[i].ibm))) {
          arrs.push(dataSource[i]);
        }
      }
    }
    return arrs;
  };

  // 全选初始化
  initFundChange(value) {
    const { dataSource, disAbleItem } = this.props;
    const selectArr = this.filterSelectData(dataSource, disAbleItem);
    if (value.length >= selectArr.length) {
      return true;
    }
    return false;
  }

  // 全选操作
  handleSwitchChange = (value) => {
    const { disAbleItem, dataSource, isMulti } = this.props;
    if (isMulti) {
      // 筛选出可选的
      const disArr = disAbleItem || [];
      const selectBleArr = this.filterSelectData(dataSource, disArr);
      if (value.length > 0) {
        const valueArray = [];
        selectBleArr.map((item) => {
          return valueArray.push(_.toString(item.ibm));
        });

        this.setState({
          changFlag: true,
          defaultItem: valueArray
        });
      } else {
        this.setState({
          changFlag: false,
          defaultItem: []
        });
      }
    }
  };

  // 选择操作
  checkItem2 = (item) => {
    const { defaultItem } = this.state;
    const { isMulti } = this.props;
    const newCbm = 'ibm';
    const key = item[newCbm].toString();
    let newItem = _.cloneDeep(defaultItem);
    const index = _.indexOf(newItem, key);
    if (isMulti) {
      // 多选
      if (index > -1) {
        newItem.splice(index, 1);
      } else {
        newItem.push(key);
      }
      newItem = newItem.sort(this.sortNumber);
    } else if (index > -1) {
      // 单选
      newItem = [];
    } else {
      newItem = [key];
    }

    this.setState({
      defaultItem: newItem,
      changFlag: this.initFundChange(newItem)
    });
  };

  // 数组排序

  sortNumber = (a, b) => {
    return a - b;
  };

  // 弹框显示

  resetlBut = () => {
    // 重置
    const { dataSource, isSure, resetValue, disAbleItem } = this.props;
    const newCbm = 'ibm';
    // 筛选出可选的数组

    const disArr = disAbleItem || [];
    const seletAbleArr = this.filterSelectData(dataSource, disArr);

    let value = _.isEmpty(seletAbleArr) ? [] : [`${seletAbleArr[0][newCbm]}` || ''];
    if (resetValue) {
      if (resetValue === '-999') {
        value = [];
      } else {
        value = resetValue.split(';');
      }
    }
    if (!isSure) {
      value = [];
    }
    this.setState({
      value: '-----弹框重置（reset）------'
    });

    setTimeout(() => {
      this.setState({
        changFlag: false,
        defaultItem: value,
        value: ''
      });
    }, 1);
  };

  sureBut = (e) => {
    // 确定
    e.preventDefault();
    const { selectCode, isSure, disAbleItem } = this.props;
    const { defaultItem, selectContent, value } = this.state;
    let newItem = defaultItem;
    const newCbm = 'ibm';

    const disArr = disAbleItem || [];
    const newArr = this.infoArrayCreat(value);
    if (!_.isEmpty(newArr) && newArr.length === 1 && isSure) {
      if (!_.includes(disArr, _.toString(newArr[0][newCbm]))) {
        newItem = [_.toString(newArr[0][newCbm])];
      }
    }

    this.props.modalSure(newItem, selectContent, selectCode);
    this.props.closeModal();
    this.setState({
      value: ''
    });
  };

  closaBUt = () => {
    // 关闭
    const { defaultValue } = this.props;
    this.setState({
      defaultItem: defaultValue ? defaultValue.split(';') : [],
      changFlag: this.initFundChange(defaultValue ? defaultValue.split(';') : []),
      value: ''
    });
    this.props.closeModal();
  };

  // 搜索
  emitEmpty = () => {
    this.searchInput.focus();
    this.setState({ value: '' });
  };

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const {
      isShow,
      checkAll,
      isSearch,
      modalTitle,
      itemSize,
      maxLength,
      dataSource,
      width,
      wrapClassName,
      afterClose,
      bodyStyle,
      centered,
      closeIcon,
      destroyOnClose,
      forceRender,
      keyboard,
      mask,
      maskClosable,
      maskStyle,
      style,
      zIndex,
      closeModal
    } = this.props;
    const { value, changFlag, defaultItem } = this.state;
    const listHtml = this.ListCreateHtml(value, defaultItem);
    

    // 全选
    const allHTML = <CheckboxGroup value={changFlag ? ['1'] : []} options={saveOpts} onChange={this.handleSwitchChange} />;
    // 搜索
    const searchHtml = (
      <div className={styles.searchBar}>
        <div className={styles.searchForm}>
          <Input
            placeholder="请输入搜索条件"
            value={value !== '-----弹框重置（reset）------' ? value : ''}
            onChange={this.handleChange}
            ref={(node) => {
              this.searchInput = node;
            }}
            maxLength="20"
          />
        </div>
      </div>
    );
    // 省略
    const overTipHtml = (
      <div className={styles.overTip}>
        <span />
        因数据太多，未展示所有结果，请输入内容模糊查找
      </div>
    );

    let menuStyle = '';
    switch (itemSize) {
      case 'large':
        menuStyle = styles.bigClass;
        break;
      case 'superLarge':
        menuStyle = styles.bigClass2;
        break;
      case 'normal':
        menuStyle = styles.selfClass;
        break;

      default:
        menuStyle = '';
    }
    return (
      <div>
        <Modal
          visible={isShow}
          footer={null}
          closable={false}
          wrapClassName={wrapClassName}
          onCancel={this.props.closeModal}
          width={width}
          afterClose={afterClose}
          bodyStyle={bodyStyle}
          centered={centered}
          closeIcon={closeIcon}
          destroyOnClose={destroyOnClose}
          forceRender={forceRender}
          keyboard={keyboard}
          mask={mask}
          maskClosable={maskClosable}
          maskStyle={maskStyle}
          style={style}
          zIndex={zIndex}
        >
          <div className={styles.fundModalBox}>
            <div className={styles.modalTitle}>
              <span>{modalTitle}</span>
              <div className={styles.modalClose} onClick={closeModal}></div>
              <div className={styles.modalSave}>{checkAll ? allHTML : ''}</div>
            </div>
            {isSearch ? searchHtml : ''}
            {value === '-----弹框重置（reset）------' ? (
              <p className={styles.resetBox}>.</p>
            ) : (
              <div>
                {maxLength &&
                !_.isNaN(_.parseInt(maxLength)) &&
                (value
                  ? _.filter(dataSource, (item) => {
                      return item.note.indexOf(value) > -1;
                    })
                  : dataSource
                ).length > _.parseInt(maxLength)
                  ? overTipHtml
                  : ''}
                <div className={`${styles.fundUlBox} ${styles.selectUlBox} ${menuStyle}`}>
                  <ul className={styles.stepUl}>
                    <li id="top" />
                    {listHtml}
                  </ul>
                </div>
              </div>
            )}
            <div className={styles.buttBox}>
              <Button type="primary" className={styles.butt} onClick={this.resetlBut}>
                重置
              </Button>
              <Button type="primary" className={styles.butt} onClick={this.sureBut}>
                确认
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
