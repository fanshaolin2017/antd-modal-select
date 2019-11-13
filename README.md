## antd-modal-select
基于 antd 二次封装的 弹出窗选择组件 适用于pc端项目

## 安装依赖
npm install 或者 yarn install
启动 yarn start
构建 yarn build

## 示例
 ```
 import AntdModalSelect from '@crm/bpc-antd-modal-select';
 
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

 <ModalSelect 
    dataSource={data} 
    isShow={this.state.isShow} 
    closeModal={this.closeModal} 
    modalSure={this.modalSure}
  />
 ```
## 支持属性

属性 | 说明 | 类型 | 默认值 | 是否必须
-|-|-|-|-
visible | 控制组件的显示与隐藏 | Boolean | false | Y
dataSource | 数据数组 | any[] |  [] | Y
defaultValue | 默认值 多选时以(,)分隔 | String | 空值 | Y 
selectCode | value对应的key值 | String | false | Y
closeModal | 关闭弹窗的回调 | function | 无 | Y
modalSure | 点击确定按钮的方法 | function(value, record, index) {} | false | Y
width | 弹窗的宽度 | number | 600 | N
itemSize | 每个可选数据的样式大小，可选范围（normal, large, superLarge） | String |  N
maxLength | 可显示的最大数据条数，大于此值的其它数据不显示，但是可以通过搜索框模糊查询 | Number | 100 | N
checkAll | 是否显示全选按钮 | Boolean | false | N
isMulti | 是否支持多选 | Boolean | false | N
isSearch | 是否显示搜索框 | Boolean | false | N
disAbleItem | 禁止选中的项([value1, value2, ...]) | String[] | [] | N

其他Modal属性参照 antd Modal属性使用