# sensorPicker

>Two plugins based on jquery for binding sensors,  filtering sensors.
>两个插件，一个是绑定传感器，一个是传感器类型筛选

案例：< https://wutw.github.io/sensorPicker/>

## Table of contents

- [Main](#main)
- [Getting started](#getting-started)
- [Introduction](#introduction)
- [example](#example)


## Main

```text
dist/
├── sensorPicker.js        (UMD)
├── sensorPicker.min.js    (UMD, compressed)
├── sensorPicker.common.js (CommonJS, default)
└── sensorPicker.esm.js    (ES Module)
```

## Getting started
docs目录下为使用案例
### Install

Include files:

```html
<script src="/path/to/jquery.js"></script><!-- jQuery is required -->
<script src="/path/to/layer.js"></script><!-- layer is required -->
<script src="/path/to/sensorPicker.js"></script>
```

### Introduction

1. 绑定传感器：
  + 应用场景
  网关新增/修改时绑定传感器
  + 需求
  传感器需要绑定网关才能上传数据，一个网关可绑多个传感器，网关分有通道与无通道，
  传感器绑定有通道的网关一次选一个传感器，需填写通道号，传感器绑无通道的网关，
  可一次选多个，取消绑定一次可选多个传感器，有uuid的传感器取消可回到待绑定传感器里，
  无uuid传感器取消绑定直接删除，
  + 功能实现思路
  待绑定的传感器可根据厂商、型号、传感器类型筛选，
  根据传入的sensorCondition里的hasTunnel="true/false"，待绑定的传感器
  展示为单/多选，单选需填通道号，sensorCondition里格式内容见docs/js/sensorData.js，
  点取消后需销毁实例，重新初始化bindSensor，点确定得到绑定的传感器数据

2. 传感器筛选
  + 应用场景
  传感器新增、修改
  + 需求
  传感器分为有uuid及无uuid，有uuid传感器可直接绑定网关，无uuid传感器
  需接入网关通道才能上传数据，不同传感器有不同数据类型，根据不同数据类型下
  的参数值可计算得到一个常量，进而计算得到实时数据。
  + 功能实现思路
  根据厂商、类型、型号的联动选择确定传感器，判断传感器有无uuid，
  有uuid必填uuid，无uuid必填通道号，有uuid可不填通道号，
  根据所需企业查询rtu,选择rtu后展示有无通道及通道占用情况。有uuid
  的传感器数据类型及参数全部展示，无uuid传感器只选择展示一种数据类型，
  不同数据类型下有不同参数。


## Example

## sensorPicker 用法
传感器筛选使用案例
### 初始化
1. html里用属性 `data-toggle="sensorPicker"` 初始化



```html
<div data-toggle="sensorPicker">
  <select data-manufacturer="---- 选择传感器厂商 ----"></select>
  <select data-sensor="---- 选择传感器类型 ----"></select>
  <select data-district="---- 选择传感器型号 ----"></select>
</div>
```



2.用方法 `$.fn.sensorPicker` 初始化

Basic

```js
$('#target').sensorPicker();
```


### Options

- 初始化改变默认配置项 `$().sensorpicker(options)`.
- 用setDefaults方法改变默认配置项 `$.fn.sensorpicker.setDefaults(options)`.

- 默认配置项，
```js
$('#target').sensorPicker({
  selectDefalut: {
        manufacturer: '—— 选择厂商 ——',

        sensor: '—— 选择传感器类型 ——',

        model: '—— 选择传感器型号 ——',
        type: '--请选择数据类型--',
    },


    placeholder: true,  // 展示 placeholder.
    hasUuid: null,//新增为null，修改有uuid为true，无uuid为false

    uuidDIv: '.uuidItem',//uuid的div
    companyClass: '.companySelect',//企业 select框
    rtuClass: '.RtuSelect',//rtu select框
    tunnelDiv: '.tunnelInput',//通道输入框

    lackUuidParameter:'.parameter',//无uuid参数div
    parameterHasUuid: '.hasUuid',//有uuid的数据类型div
    parameterLackUuid: '.lackUuid',//无uuid的数据类型div


    rtuUrl: './rtu.json',
    tunnelUrl: './tunnel.json'

    });
```
- 也可在html用`data-*`直接配置option里selectDefalut


### Methods


#### reset([deep])

- **deep** (optional):
  - 类型: `Boolean`
  - 默认: `false`
  - 重置选择框.

```js
$().sensorPicker('reset');
$().sensorPicker('reset', true);
```

### destroy()

销毁实例，选择值不变，reset可重置选择框值


### 数据回显
修改需回显设置好的数

```
$('#sensorPicker2').sensorPicker('destroy');//先销毁之前实例
$('#sensorPicker2').sensorPicker({
        hasUuid:false,
        tunnelDiv:'#modifyTunnel',
        uuidDIv: '#modifyUuidItem',//uuid的div
        companyClass: '#modifyOrg',
        rtuClass: '#modifyOrgRtu',



    });//新建实例
$("#a").val(data).trigger("change");//回显
```
## No conflict

If you have to use other plugin with the same namespace, just call the `$.fn.sensorpicker.noConflict` method to revert to it.


```html
<script src="other-plugin.js"></script>
<script src="sensorPicker.js"></script>
<script>
  $.fn.sensorPicker.noConflict();

</script>
```


## bindSensor 用法
传感器绑定使用案例
### 初始化
```
$.bindSensor({ leftList: leftList,
               rightList: leftList,
               selectDivId: '#sensorSearch', //select外div
               addArrowId: '#addBindSensor', //绑定
               removeArrowId: "#removeBindSensor", //解绑
               leftTableId: '#restSensor', //左侧表
               rightTableId: '#bindedSensor', //右侧表
               hasTunnel: 'true', //是否有通道
               tunnelLayerId: '#tunnelId',//通道弹出层Id
               confirmBtn: '.confirmBindSensor',//绑定传感器页面确定按钮});

```
$.bindSensor会返回实例对象

### 使用
```
(function(){
    var sensorBind;//定义绑定对象

    //销毁之前实例
    try{
      if( sensorBind.destroy && typeof( sensorBind.destroy) == "function"){
        sensorBind.destroy();
      }
    }catch(e){

    }

    //绑定实例
    sensorBind = $.bindSensor(sensorCondition);

    //页面点确定时得到绑定传感器数据
    $('.confirmBindSensor').on('click',function(e){
      var data = sensorBind.confirmChoice(e);
    })

  })()
```
[⬆ back to top](#table-of-contents)

