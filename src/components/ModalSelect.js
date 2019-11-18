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
    dataSource: PropTypes.array.isRequired, // 展示的数据源
    defaultValue: PropTypes.string, // select 传值
    modalSure: PropTypes.func.isRequired, // 确定按钮的方法
    checkAll: PropTypes.bool, // 是否显示全选按钮
    isMulti: PropTypes.bool, // 是否多选
    isSearch: PropTypes.bool, // 是否显示搜索框
    title: PropTypes.string, // 弹窗的title
    selectCode: PropTypes.string, // value对应的key
    maxLength: PropTypes.number, // 可显示的最大数据量
    disAbleItem: PropTypes.array, // 禁止选择的项
    visible: PropTypes.bool.isRequired, // 弹窗是否显示
    closeModal: PropTypes.func.isRequired, // 关闭弹窗的方法
    itemSize: PropTypes.string, // 选择项的大小
    width: PropTypes.number, // 弹窗的宽度
    wrapClassName: PropTypes.string,
    bodyStyle: PropTypes.object,
    centered: PropTypes.bool,
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
    title: '',
    selectCode: '',
    maxLength: 100,
    disAbleItem: [],
    itemSize: 'normal',
    width: 600,
    wrapClassName: '',
    centered: false,
    style: {},
    maskStyle: {},
    bodyStyle: {},
    mask: true,
    maskClosable: true,
    keyboard: true,
    zIndex: 1000,
    forceRender: false,
    destroyOnClose: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      changFlag: false, // 是否全选 默认不全选
      defaultItem: [], // 默认值选中的项
      value: '', // 搜索框的value
    };
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    this.setState({
      defaultItem: defaultValue ? defaultValue.split(';') : [],
      changFlag: this.initFundChange(defaultValue ? defaultValue.split(';') : [])
    });
  }

  componentWillReceiveProps(nextProps) {
    const { defaultValue } = nextProps;
    this.setState({
      defaultItem: defaultValue ? defaultValue.split(';') : [],
      changFlag: this.initFundChange(defaultValue ? defaultValue.split(';') : [])
    });
  }
  
  
  // 根据maxLength和搜索框的内容过滤dataSource
  getNowArray=(props, value) => {
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

  // 选择项初始化 渲染选择项
  ListCreateHtml = (value, defaultItem) => {
    const { selectCode, disAbleItem } = this.props;
    const newCbm = selectCode;
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
            value={item[newCbm]}
            key={item[newCbm]}
            className={`
              ${styles.stepLi}
              ${_.indexOf(defaultItem, _.toString(item[newCbm])) > -1 ? styles.on : ''}
              ${_.indexOf(disAbleItem, _.toString(item[newCbm])) > -1 ? styles.disChange : ''}
            `}
            onClick={() => {
              return this.checkItem(item);
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

  // 根据不可选数据筛选出可选数据
  filterSelectData = (dataSource, disAbleItem, selectCode) => {
    const arrs = [];
    if (disAbleItem && dataSource) {
      for (let i = 0; i < dataSource.length; i++) {
        if (!_.includes(disAbleItem, _.toString(dataSource[i][selectCode]))) {
          arrs.push(dataSource[i]);
        }
      }
    }
    return arrs;
  };

  // 判断全选按钮是否选中
  initFundChange(value) {
    const { dataSource, disAbleItem, selectCode } = this.props;
    const selectArr = this.filterSelectData(dataSource, disAbleItem, selectCode);
    if (value.length >= selectArr.length) {
      return true;
    }
    return false;
  }

  // 全选操作
  handleSwitchChange = (value) => {
    const { disAbleItem, dataSource, isMulti, selectCode } = this.props;
    if (isMulti) {
      // 筛选出可选的
      const disArr = disAbleItem || [];
      const selectBleArr = this.filterSelectData(dataSource, disArr, selectCode);
      if (value.length > 0) {
        const valueArray = [];
        selectBleArr.map((item) => {
          return valueArray.push(_.toString(item[selectCode]));
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
  checkItem = (item) => {
    const { defaultItem } = this.state;
    const { isMulti, selectCode } = this.props;
    const newCbm = selectCode;
    const key = item[newCbm].toString();
    let newItem = _.cloneDeep(defaultItem);
    const index = _.indexOf(newItem, key);
    if (isMulti && !_.isEmpty(defaultItem)) {
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

  // 重置功能，清空已选值
  resetlBut = () => {
    this.setState({
      changFlag: false,
      defaultItem: '',
      value: ''
    });
  };

  sureBut = (e) => {
    // 确定
    e.preventDefault();
    const { selectCode, disAbleItem } = this.props;
    const { defaultItem, value } = this.state;
    let newItem = defaultItem;
    const newCbm = selectCode;

    const disArr = disAbleItem || [];
    const newArr = this.infoArrayCreat(value);
    if (!_.isEmpty(newArr) && newArr.length === 1) {
      if (!_.includes(disArr, _.toString(newArr[0][newCbm]))) {
        newItem = [_.toString(newArr[0][newCbm])];
      }
    }

    this.props.modalSure(newItem, newArr, selectCode);
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
      value: e.target.value
    });
  };

  render() {
    const {
      visible,
      checkAll,
      isSearch,
      title,
      itemSize,
      maxLength,
      dataSource,
      width,
      wrapClassName,
      bodyStyle,
      centered,
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
          visible={visible}
          footer={null}
          closable={false}
          wrapClassName={wrapClassName}
          onCancel={this.props.closeModal}
          width={width}
          bodyStyle={bodyStyle}
          centered={centered}
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
              <span>{title}</span>
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
