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
    hasCheckAll: PropTypes.bool, // 是否显示全选按钮
    isMultil: PropTypes.bool, // 是否多选
    hasSearch: PropTypes.bool, // 是否显示搜索框
    title: PropTypes.string, // 弹窗的title
    valueKey: PropTypes.object, // value对应的key
    maxLength: PropTypes.number, // 可显示的最大数据量
    disableItem: PropTypes.array, // 禁止选择的项
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
    hasCheckAll: false,
    isMultil: false,
    hasSearch: false,
    title: '',
    valueKey: {
      id: 'id',
      note: 'note'
    },
    maxLength: 100,
    disableItem: [],
    itemSize: 'small',
    width: 800,
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
    destroyOnClose: false
  };

  constructor(props) {
    super(props);
    const { defaultValue } = props;
    this.state = {
      checkedItem: defaultValue ? defaultValue.split(';') : [], // 默认值选中的项
      value: '' // 搜索框的value
    };
  }
  
  // 根据maxLength和搜索框的内容过滤dataSource
  getNowArray = (props, value) => {
    const { maxLength, dataSource, valueKey } = props;
    let arr =
      _.filter(dataSource, (item) => {
        return item[valueKey.note].indexOf(value) > -1;
      }) || dataSource;
    if (dataSource.length > maxLength) {
      arr = arr.slice(0, maxLength - 1);
    }
    return arr;
  };

  // 选择项初始化 渲染选择项
  ListCreateHtml = (value, checkedItem) => {
    const { valueKey, disableItem, itemSize } = this.props;
    const newCbm = valueKey.id;
    const newNote = valueKey.note;
    const showInfo = this.getNowArray(this.props, value);
    let menuStyle = itemSize;
    switch (itemSize) {
      case 'small':
        menuStyle = styles.smallStyle;
        break;
      case 'normal':
        menuStyle = styles.normalStyle;
        break;
      case 'large':
        menuStyle = styles.largeStyle;
        break;
      case 'superlarge':
        menuStyle = styles.superLargeStyle;
        break;
      default:
        menuStyle = styles.smallStyle;
    }
    if (_.isEmpty(showInfo)) {
      return (
        <li key="noKey">
          <i className={styles.stepYes} />
        </li>
      );
    }
    const country = [];
    showInfo.forEach((item) => {
      if (item[newNote].indexOf(value) > -1) {
        country.push(
          <li
            value={item[newCbm]}
            key={item[newCbm]}
            className={`
              ${styles.stepLi} ${menuStyle}
              ${_.indexOf(checkedItem, _.toString(item[newCbm])) > -1 ? styles.on : ''}
              ${_.indexOf(disableItem, _.toString(item[newCbm])) > -1 ? styles.disChange : ''}
            `}
            onClick={() => {
              return this.checkItem(item);
            }}
          >
            {item[newNote]}
            <i className={styles.stepYes} />
          </li>
        );
      }
      return country;
    });
    return country;
  };

  // 选择项数组
  infoArrayCreat = (value = '') => {
    const { dataSource } = this.props;
    if (_.isEmpty(dataSource)) {
      return [];
    }
    return dataSource.filter((item) => item.note.indexOf(value) > -1);
  };

  // 根据不可选数据筛选出可选数据
  filterSelectData = (dataSource, disableItem, valueKey) => {
    console.log('valueKey', valueKey);
    let arrs = [];
    if (disableItem && dataSource) {
      _.forEach(dataSource, (item) => {
        if (!_.includes(disableItem, _.toString(item[valueKey]))) {
          console.log('valueKey', item[valueKey]);
          arrs.push(item);
        }
      });
    }
    return arrs;
  };

  // 判断全选按钮是否选中
  initFundChange(checkedItem) {
    const { dataSource, disableItem, valueKey } = this.props;
    const selectArr = this.filterSelectData(dataSource, disableItem, valueKey.id);
    console.log(selectArr);
    // 如果已选项的数量与可选项的长度相同就默认勾选全选
    return checkedItem.length >= selectArr.length;
  }

  // 全选操作
  handleSwitchChange = (value) => {
    const { disableItem, dataSource, isMultil, valueKey } = this.props;
    if (isMultil) {
      // 筛选出可选的
      const disArr = disableItem || [];
      const selectBleArr = this.filterSelectData(dataSource, disArr, valueKey.id);
      if (value.length > 0) {
        const valueArray = [];
        _.forEach(selectBleArr, (item) => {
          valueArray.push(_.toString(item[valueKey.id]));
        });

        this.setState({
          // changeFlag: true,
          checkedItem: valueArray
        });
      } else {
        this.setState({
          // changeFlag: false,
          checkedItem: []
        });
      }
    }
  };

  // 选择操作
  checkItem = (item) => {
    const { checkedItem } = this.state;
    const { isMultil, valueKey } = this.props;
    const newCbm = valueKey.id;
    const key = item[newCbm].toString();
    let newItem = _.cloneDeep(checkedItem);
    const index = _.indexOf(newItem, key);
    if (isMultil && !_.isEmpty(checkedItem)) {
      // 多选
      index > -1 ? newItem.splice(index, 1) : newItem.push(key);
      newItem = newItem.sort((a, b) => {
        return a - b;
      });
    } else {
      index > -1 ? (newItem = []) : (newItem = [key]);
    }

    this.setState({
      checkedItem: newItem
      // changeFlag: this.initFundChange(newItem)
    });
  };

  // 重置功能，清空已选值
  resetlBut = () => {
    this.setState({
      // changeFlag: false,
      checkedItem: '',
      value: ''
    });
  };

  sureBut = (e) => {
    // 确定
    e.preventDefault();
    const { valueKey, disableItem } = this.props;
    const { checkedItem, value } = this.state;
    let newItem = checkedItem;
    const newCbm = valueKey.id;

    const disArr = disableItem || [];
    const newArr = this.infoArrayCreat(value);
    if (!_.isEmpty(newArr) && newArr.length === 1) {
      if (!_.includes(disArr, _.toString(newArr[0][newCbm]))) {
        newItem = [_.toString(newArr[0][newCbm])];
      }
    }

    this.props.modalSure(newItem, newArr, valueKey);
    this.props.closeModal();
    this.setState({
      value: ''
    });
  };

  closaBUt = () => {
    // 关闭
    const { defaultValue } = this.props;
    this.setState({
      checkedItem: defaultValue ? defaultValue.split(';') : [],
      // changeFlag: this.initFundChange(defaultValue ? defaultValue.split(';') : []),
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
      hasCheckAll,
      hasSearch,
      title,
      maxLength,
      isMultil,
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
    const { value, checkedItem } = this.state;
    const listHtml = this.ListCreateHtml(value, checkedItem);
    // 默认全选是否默认选中
    const changeFlag = this.initFundChange(checkedItem);
    const suffix = value && value !== 'reset' ? <span className={styles.searchClear} onClick={this.emitEmpty} /> : <span />;
    // 全选
    const allHTML = <CheckboxGroup value={changeFlag ? ['1'] : []} options={saveOpts} onChange={this.handleSwitchChange} />;
    // 搜索
    const searchHtml = (
      <div className={styles.searchBar}>
        <div className={styles.searchForm}>
          <Input
            placeholder="请输入搜索条件"
            value={value !== 'reset' ? value : ''}
            onChange={this.handleChange}
            ref={(node) => {
              this.searchInput = node;
            }}
            suffix={suffix}
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
              <div className={styles.modalSave}>{hasCheckAll && isMultil ? allHTML : ''}</div>
            </div>
            {hasSearch ? searchHtml : ''}
            {value === 'reset' ? (
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
                <div className={`${styles.fundUlBox} ${styles.selectUlBox}`}>
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
