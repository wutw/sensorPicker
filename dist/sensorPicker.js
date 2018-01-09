/*!
 * sensorPicker v1.0.0
 * https://github.com/wutw/sensorPicker
 *
 * Copyright (c) 2014-2018 wtw
 * Released under the  license
 *
 * Date: 2018-01-09T01:43:35.014Z
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery'), require('jquery-validation')) :
	typeof define === 'function' && define.amd ? define(['jquery', 'jquery-validation'], factory) :
	(factory(global.jQuery));
}(this, (function ($) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

var DEFAULTS = {
    // Defines the initial value of select.
    selectDefalut: {
        manufacturer: '—— 选择厂商 ——',

        sensor: '—— 选择传感器类型 ——',

        model: '—— 选择传感器型号 ——',
        type: '--请选择数据类型--'
    },

    // Show placeholder.
    placeholder: true,
    hasUuid: null, //新增为null，修改有uuid为true，无uuid为false

    uuidDIv: '.uuidItem', //uuid的div
    companyClass: '.companySelect', //企业 select框
    rtuClass: '.RtuSelect', //rtu select框
    tunnelDiv: '.tunnelInput', //通道输入框

    lackUuidParameter: '.parameter', //无uuid参数div
    parameterHasUuid: '.hasUuid', //有uuid的数据类型div
    parameterLackUuid: '.lackUuid', //无uuid的数据类型div


    rtuUrl: './rtu.json',
    tunnelUrl: './tunnel.json'

};

var SENSORINFO = {
    "0000000000": {
        P0100000000: '天宝',
        P0200000000: '司南',
        P0300000000: '基康',
        P0400000000: '阳光',
        P0500000000: '易周'

    },
    P0100000000: {
        P01T01000000: '北斗'

    },
    P0200000000: {
        P02T01000000: '北斗'

    },
    P0300000000: {

        P03T02000000: '岩土'

    },
    P0400000000: {

        P04T03000000: '气象'

    },
    P0500000000: {

        P05T03000000: '气象'

    },

    P01T01000000: {
        P01T01S00000: '默认型号'
    },
    P02T01000000: {
        P02T01S00000: '默认型号'
    },
    P03T02000000: {
        P03T02S00000: '默认型号'
    },
    P04T03000000: {
        P04T02S00000: '默认型号'
    },
    P05T03000000: {
        P05T03S00000: '默认型号'
    },
    P01T01S00000: {
        hasUuid: true,
        P01T01S00D01: "北斗数据"
    },
    P02T01S00000: {
        hasUuid: true,
        P02T01S00D01: "北斗数据"
    },
    P03T02S00000: {
        hasUuid: false,
        P03T02S00D02: "测斜",
        P03T02S00D03: "裂缝",
        P03T02S00D04: "渗压"

    },
    P04T02S00000: {
        hasUuid: false,
        P04T02S00D05: "气象数据"

    },
    P05T03S00000: {
        hasUuid: true,
        P05T03S00D06: "风速",
        P05T03S00D07: "风向",
        P05T03S00D08: "大气气压",
        P05T03S00D09: "蒸发",
        P05T03S00D10: "雨量",
        P05T03S00D11: "空气温度",
        P05T03S00D12: "空气湿度",
        P05T03S00D13: "土壤温度",
        P05T03S00D14: "土壤湿度"
    },
    P03T02S00D02: [{
        param: '参数G'
    }, {
        param: '仪器长度'
    }, {
        param: '初始读数值'
    }],
    P03T02S00D04: [{
        param: '参数G'
    }, {
        param: '温补系数K'
    }, {
        param: '温补初值'
    }, {
        param: '初始读数值'
    }]

};

var WINDOW = typeof window !== 'undefined' ? window : {};
var NAMESPACE = 'sensorPicker';
var EVENT_CHANGE = 'change';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_CODE = '0000000000';
var MANUFACTURER = 'manufacturer'; //厂商
var SENSORTYPE = 'sensor'; //传感器类型
var MODELNUMBER = 'model'; //型号
var DATATYPE = 'type'; //数据类型
var DATAPARAMETER = 'parameter'; //参数

var sensorPicker = function () {
    function sensorPicker(element, options) {
        _classCallCheck(this, sensorPicker);

        this.$element = $(element);

        this.options = $.extend({}, DEFAULTS, $.isPlainObject(options) && options);
        //options多个对象合并，传入默认值参数更新，没有用定义好的
        this.placeholders = $.extend({}, DEFAULTS.selectDefalut);
        this.ready = false;
        this.init();
    }

    _createClass(sensorPicker, [{
        key: 'init',
        value: function init() {
            var _this = this;

            var options = this.options;

            this.$company = $(options.companyClass);
            this.$rtu = $(options.rtuClass);
            var $selects = this.$element.find('.sensorPicker');

            var length = $selects.length; //select个数

            var data = {};

            $selects.each(function (i, select) {
                return $.extend(data, $(select).data());
            });
            //data存储html默认值
            $.each([MANUFACTURER, SENSORTYPE, MODELNUMBER, DATATYPE], function (i, type) {
                if (data[type]) {
                    //data存有manufacturer等
                    options[type] = data[type];
                    _this['$' + type] = $selects.filter('[data-' + type + ']'); //html写法
                    //有data-的dom选定，表示为$MANUFACTURER
                } else {
                    _this['$' + type] = length > i ? $selects.eq(i) : null;
                } //没写data，按顺序
            });

            this.bind();

            // Reset all the selects (after event binding)
            this.reset(); //三级联动
            this.ready = true;
        }
    }, {
        key: 'bind',
        value: function bind() {
            var _this2 = this;

            if (this.$manufacturer) {
                this.$manufacturer.on(EVENT_CHANGE, this.onChangeManufacturer = $.proxy(function () {

                    _this2.output(SENSORTYPE);
                }, this));
            }
            //jQuery.proxy(),确保this指向
            //接受一个函数，然后返回一个新函数，
            //并且这个新函数始终保持了特定的上下文(context )语境。参数为函数，语境

            if (this.$sensor) {
                this.$sensor.on(EVENT_CHANGE, this.onChangeSensorType = $.proxy(function () {

                    _this2.output(MODELNUMBER);
                }, this));
            }
            if (this.$model) {
                this.$model.on(EVENT_CHANGE, this.onChangeModelNumber = $.proxy(function () {
                    _this2.output(DATATYPE);
                    /* this.output(DATAPARAMETER);*/
                }, this));
            }
            if (this.$type) {

                this.$type.on(EVENT_CHANGE, this.onChangeDataType = $.proxy(function () {

                    _this2.output(DATAPARAMETER);
                }, this));
            }
            if (this.$company) {
                this.$company.on(EVENT_CHANGE, this.onChangeCompany = $.proxy(function () {
                    _this2.queryRtu();
                }, this));
            }
            if (this.$rtu) {
                this.$rtu.on(EVENT_CHANGE, this.onChangeRtu = $.proxy(function () {
                    _this2.queryTunnel();
                }, this));
            }
        }
    }, {
        key: 'unbind',
        value: function unbind() {
            if (this.$manufacturer) {
                this.$manufacturer.off(EVENT_CHANGE, this.onChangeManufacturer);
            }

            if (this.$sensor) {
                this.$sensor.off(EVENT_CHANGE, this.onChangeSensorType);
            }
            if (this.$model) {
                this.$model.off(EVENT_CHANGE, this.onChangeModelNumber);
            }
            if (this.$type) {
                this.$type.off(EVENT_CHANGE, this.onChangeDataType);
            }

            if (this.$company) {
                this.$company.off(EVENT_CHANGE, this.onChangeCompany);
            }
            if (this.$rtu) {
                this.$rtu.off(EVENT_CHANGE, this.onChangeRtu);
            }
        }
    }, {
        key: 'showOrHideWhenChange',
        value: function showOrHideWhenChange(initUuit, options) {
            $('.message1').remove();
            $(options.uuidDIv).removeClass('lack').removeClass('has');
            $(options.parameterHasUuid).addClass('none');
            $(options.parameterLackUuid).addClass('none');
            if (initUuit == null) {

                $(options.uuidDIv).addClass('none').find('input').val('');
                $(options.tunnelDiv).addClass('none').find('input').val('');
                $(options.companyClass).children('option:first').prop('selected', 'true');
                $(options.rtuClass).html('').append('<option value="">请选择RTU</option>');
            } else if (initUuit == false) {
                $(options.uuidDIv).addClass('none').find('input').val('');
                $(options.companyClass).prop('disabled', 'disabled');
                $(options.rtuClass).prop('disabled', 'disabled');
                $(options.tunnelDiv).removeClass('none').find('input').prop('readonly', 'true');
            } else {

                $(options.uuidDIv).removeClass('none').find('input').prop('readonly', 'true');
                $(options.companyClass).children('option:first').prop('selected', 'true');
                $(options.rtuClass).html('').append('<option value="">请选择RTU</option>');
                $(options.tunnelDiv).addClass('none').find('input').val('');
            }
        }
    }, {
        key: 'output',
        value: function output(type) {
            var options = this.options,
                placeholders = this.placeholders;

            var code = void 0;
            if (type == MANUFACTURER || type == SENSORTYPE || type == MODELNUMBER) {

                this.selectOutput(type, code, options, placeholders);
            } else if (type == DATATYPE) {
                this.dataTypeOutput(type, code, options, placeholders);
            } else if (type == DATAPARAMETER) {
                code = this.$type && (this.$type.find(':selected').data('code') || '');

                this.parameterOutput(code, options);
            }
        }
    }, {
        key: 'selectOutput',
        value: function selectOutput(type, code, options, placeholders) {
            var $select = this['$' + type];

            if (!$select || !$select.length) {
                return;
            } //判空
            var initUuit = options.hasUuid;

            switch (type) {
                case MANUFACTURER:
                    code = DEFAULT_CODE;

                    break;

                case SENSORTYPE:
                    code = this.$manufacturer && (this.$manufacturer.find(':selected').data('code') || '');
                    this.showOrHideWhenChange(initUuit, options);
                    break; //选中省的code属性

                case MODELNUMBER:
                    code = this.$sensor && (this.$sensor.find(':selected').data('code') || '');

                    break;

                case DATATYPE:
                    code = this.$model && (this.$model.find(':selected').data('code') || '');

                    break;

            }

            var SensorInfos = this.getSensorInfos(code); //对象
            var valueDefault = options[type]; //用户给默认值枚举,或者汉字
            //const selectDefault = $select.val();
            var data = [];
            var matched = false;

            var obj1 = {
                manufacturer: 'P',
                sensor: 'T',
                model: 'S',
                type: 'D'
            };

            //option数据便利，根据用户指定初始值加selected
            if ($.isPlainObject(SensorInfos)) {
                //判断是否纯粹对象
                $.each(SensorInfos, function (i, name) {
                    //便利对象
                    if (i.indexOf('hasUuid') < 0) {

                        //将option每项value与数据库枚举对应，
                        var value = i.match(new RegExp(obj1[type] + '\\d{2}'))[0];

                        var selected = i.indexOf(valueDefault) >= 0 || name.indexOf(valueDefault) >= 0;

                        if (selected) {
                            matched = true;
                        }

                        data.push({
                            code: i, //code填入，以后根据这个找选中的code,格式[{},{}]
                            value: value,
                            name: name,
                            selected: selected
                        }); //select需要的数据，用于数据回显
                    }
                });
            }

            if (!matched) {

                // Save the unmatched value as a placeholder at the first output
                if (!this.ready && valueDefault) {
                    placeholders[type] = valueDefault; //没有给定值显示默认值
                }
            }

            // Add placeholder option
            if (options.placeholder) {
                data.unshift({
                    code: '',
                    value: '',
                    name: placeholders[type],
                    selected: false
                });
            } //默认给placeholder--选择厂商--

            if (data.length) {
                $select.html(this.getList(data)); //插入select里
            } else {
                $select.empty();
            }

            $select.trigger(EVENT_CHANGE); //触发监听
        }

        //找到数据类型数据

    }, {
        key: 'dataTypeOutput',
        value: function dataTypeOutput(type, code, options, placeholders) {
            code = this.$model && (this.$model.find(':selected').data('code') || '');
            var SensorInfos = this.getSensorInfos(code); //对象
            var initHasUuid = options.hasUuid;

            if ($.isPlainObject(SensorInfos)) {
                //判断是否纯粹对象
                var hasUuid = SensorInfos.hasUuid;

                /*   delete SensorInfos.hasUuid;*/
                if (hasUuid && initHasUuid == null || hasUuid && initHasUuid) {

                    this.dataTypeLabelOutput(code, options, SensorInfos);
                } else if (hasUuid && initHasUuid == false) {

                    layer.alert('该厂商、类型、型号下传感器有uuid,请重新选择', {

                        time: 2000
                    });
                    this.reset();
                } else if (!hasUuid && !initHasUuid) {
                    $(options.uuidDIv).addClass('none').addClass('lack').find('input').val('');
                    $(options.parameterLackUuid).removeClass('none').siblings('div').addClass('none');
                    this.selectOutput(type, code, options, placeholders);
                } else if (!hasUuid && initHasUuid) {
                    layer.alert('该厂商、类型、型号下传感器无uuid,请重新选择', {

                        time: 2000
                    });
                    this.reset();
                }
            } else if (initHasUuid == null && !$.isPlainObject(SensorInfos)) {
                $(options.parameterLackUuid).addClass('none').siblings('div').addClass('none');
            }
        }

        //有uuid数据类型输出

    }, {
        key: 'dataTypeLabelOutput',
        value: function dataTypeLabelOutput(code, options, SensorInfos) {
            var $dataTypeDiv = $(options.parameterHasUuid);
            if (!$dataTypeDiv || !$dataTypeDiv.length) {
                return;
            }
            var data = [];

            $(options.uuidDIv).removeClass('none').addClass('has');

            $(options.parameterHasUuid).removeClass('none').html('').siblings('div').addClass('none');

            $.each(SensorInfos, function (i, name) {
                //便利对象

                if (i.indexOf('hasUuid') < 0) {

                    var value = i.match(new RegExp('D\\d{2}'))[0];

                    data.push({
                        code: i, //code填入，以后根据这个找选中的code,格式[{},{}]
                        value: value,
                        name: name

                    });
                }
            });
            if (data.length) {
                $dataTypeDiv.html(this.getdataTypeList(data));
            } else {
                $dataTypeDiv.empty();
            }
            this.parameterOutput(data, options);
        }
    }, {
        key: 'parameterOutput',
        value: function parameterOutput(data, options) {
            var _this3 = this;

            if (!data) {
                $(options.lackUuidParameter).html('');
                return;
            }
            if ($(options.uuidDIv).hasClass('lack')) {
                //无uuid
                var code = data;
                code = this.$type && (this.$type.find(':selected').data('code') || '');

                var _getparamList = this.getparamList(code),
                    listHtml = _getparamList.listHtml,
                    data1 = _getparamList.data1;

                if (data1.length) {

                    $(options.lackUuidParameter).html(listHtml);
                } else if (code == null) {
                    $(options.lackUuidParameter).html('');
                } else {
                    $(options.lackUuidParameter).html('\n            <div class=\'form-group\'>\n              <label class=\'control-label col-xs-4\'></label>\n              <div class=\'col-xs-8\' style="color: #ff0f00;">\n                \u65E0\u53C2\u6570\n              </div>\n              </div>');
                }
            } else if ($(options.uuidDIv).hasClass('has')) {
                //有uuid,展示所有参数
                $.each(data, function (i, n) {
                    var code = n.code;

                    var _getparamList2 = _this3.getparamList(code),
                        listHtml = _getparamList2.listHtml,
                        data1 = _getparamList2.data1;

                    if (data1.length) {

                        $('.' + data1.key).html(listHtml);
                    } else {
                        var key = code.match(new RegExp('D\\d{2}'))[0];
                        $('.' + key).html('<div class=\'form-group\'>\n                <label class=\'control-label col-xs-4\'></label>\n                  <div class=\'col-xs-8\' style="color: #ff0f00;">\n                  \u65E0\u53C2\u6570\n                  </div>\n                  </div>');
                    }
                });
            }
        }

        // eslint-disable-next-line class-methods-use-this

    }, {
        key: 'getList',
        value: function getList(data) {
            var list = [];

            $.each(data, function (i, n) {
                var attrs = ['data-code="' + n.code + '"', 'data-text="' + n.name + '"', 'value="' + n.value + '"'];

                if (n.selected) {
                    attrs.push('selected');
                }

                list.push('<option ' + attrs.join(' ') + '>' + n.name + '</option>');
            }); //拼接option

            return list.join('');
        }
    }, {
        key: 'getdataTypeList',
        value: function getdataTypeList(data) {
            var list = [];

            $.each(data, function (i, n) {
                var attrs = ['data-code="' + n.code + '"', 'data-text="' + n.name + '"', 'data-value="' + n.value + '"'];

                list.push(' <div class="form-group dataTypeClass" ' + attrs.join(' ') + '>\n                    <label  class="control-label col-xs-4"> \u6570\u636E\u7C7B\u578B</label>\n                    <div class="col-xs-8">\n                        <label  class="control-label ">\n                            ' + n.name + '\n                        </label>\n                    </div>\n                </div> <div class=\' ' + n.value + '\'></div>');
            }); //拼接option

            return list.join('');
        }
    }, {
        key: 'getparamList',
        value: function getparamList(code) {

            var key = code.match(new RegExp('D\\d{2}'))[0];
            var list = [];
            var data = [];
            var SensorInfos = this.getSensorInfos(code); //对象

            if (SensorInfos != null) {
                $.each(SensorInfos, function (i, name) {
                    //便利对象

                    var text = name.param;
                    data.push({
                        key: key,
                        text: text
                    });
                });
            }

            $.each(data, function (i, n) {

                list.push(' <div class="form-group"  >\n                              <label class="control-label col-xs-4 col-md-4">' + n.text + '</label>\n\n                                   <input class="form-control col-xs-8 col-md-8 js-example-basic-single param" placeholder="\u8BF7\u8F93\u5165\u53C2\u6570" required=\'required\' data-text=' + n.text + ' name= parameterItem' + i + ' />\n\n                         </div>\n                                   ');
            }); //拼接option
            return {
                listHtml: list.join(''),
                data1: data
            };
        }

        // eslint-disable-next-line class-methods-use-this

    }, {
        key: 'getSensorInfos',
        value: function getSensorInfos() {
            var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CODE;

            return SENSORINFO[code] || null;
        }
    }, {
        key: 'ajax',
        value: function ajax(_ref) {
            var _ref$url = _ref.url,
                url = _ref$url === undefined ? '' : _ref$url,
                _ref$data = _ref.data,
                data = _ref$data === undefined ? null : _ref$data,
                _ref$async = _ref.async;

            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: 'POST',
                    url: url,
                    async: true,
                    send: data,
                    success: function success(result) {
                        resolve(result);
                    }
                });
            });
        }
        //查Rtu下拉框

    }, {
        key: 'queryRtu',
        value: function queryRtu() {
            var options = this.options;

            $(options.tunnelDiv).addClass('none').find('input').val('');
            var self = this;
            if (!self.$company.val()) {
                return;
            }

            var sendData = {
                ownerId: self.$company.val(),
                hasUuid: null
            };

            if ($(options.uuidDIv).hasClass('lack')) {
                sendData.hasUuid = false;
            } else if ($(options.uuidDIv).hasClass('has')) {
                sendData.hasUuid = true;
            } else {
                layer.msg('请按顺序完成表单!', {

                    time: 2000
                });
                $(options.companyClass).children('option:first').prop('selected', 'true');
                return;
            }
            self.ajax({

                url: options.rtuUrl,
                data: sendData
            }).then(function (result) {
                if (!!result) {
                    var resultObj = result;

                    var list = resultObj.list;
                    var list1 = [];
                    list1[0] = '<option value=\'\'>\u8BF7\u9009\u62E9RTU</option>';
                    //  let resultObj = JSON.parse(result);

                    $.each(list, function (i, name) {
                        var arr = ['value=' + name.id, 'data-type=' + name.rtuAccessType, 'data-sn=' + name.snNumber];
                        list1.push('<option ' + arr.join(' ') + ' >' + name.rtuName + '</option>');
                    });

                    self.$rtu.html(list1.join(''));
                } else {
                    layer.msg('请重试', {

                        time: 2000
                    });
                }
            });
            /* let orgListRequest = $.post(YHu.util.ctxPath('/rtu/queryOwnerRtuList'), sendData);
              orgListRequest.done(function(jsonResult) {
                 if (jsonResult.success) {
                     let list = jsonResult.data;
                     let list1 = [];
                     list1[0] = `<option value=''>请选择RTU</option>`;
                     //  let resultObj = JSON.parse(result);
                      $.each(list, (i, name) => {
                         let arr = [`value=${name.id}`, `data-type=${name.rtuAccessType}`, `data-sn=${name.snNumber}`];
                         list1.push(`<option ${arr.join(' ')} >${name.rtuName}</option>`);
                     });
                      self.$rtu.html(list1.join(''));
                   } else {
                     layer.msg(jsonResult.message, {
                          time: 2000
                     })
                 }
             })*/
        }
        //查询通道有无及占用情况

    }, {
        key: 'queryTunnel',
        value: function queryTunnel() {
            var options = this.options;

            var self = this;
            var rtuAccessType = self.$rtu.children('option:selected').data('type');

            if (!self.$rtu.val()) {
                return;
            }
            if (rtuAccessType == '10') {
                //有通道
                $(options.tunnelDiv).removeClass('none').find('input').val('');
            } else {
                $(options.tunnelDiv).addClass('none').find('input').val('');
            }

            var sendData = {
                id: self.$rtu.val(),
                rtuAccessType: rtuAccessType
            };

            self.ajax({

                url: options.tunnelUrl,
                data: sendData
            }).then(function (result) {
                if (!!result) {
                    var resultObj = result;

                    if (rtuAccessType == '10') {
                        //有通道
                        $('.message1').remove();
                        $(options.tunnelDiv).append('<span class="message1" style="color:red">' + resultObj.message + '</span>');
                    } else {
                        layer.msg(resultObj.message, {

                            time: 2000
                        });
                    }
                } else {
                    layer.msg('请重新选择', {

                        time: 2000
                    });
                }
            });

            /*  let orgListRequest = $.post(YHu.util.ctxPath('/rtu/queryRtuIsBindTunnelList'), sendData);
               orgListRequest.done(function(jsonResult) {
                  if (jsonResult.success) {
                      let resultObj = jsonResult;
                      if (rtuAccessType == '10') {
                          //有通道
                          $('.message1').remove();
                          $(options.tunnelDiv).append(`<span class="message1" style="color:red">${resultObj.message}</span>`);
                        } else {
                          layer.msg(resultObj.message, {
                               time: 2000
                          })
                      }
                   } else {
                      layer.msg('请重新选择', {
                           time: 2000
                      });
                   }
              });
            */
        }
    }, {
        key: 'reset',
        value: function reset() {
            var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!deep) {
                this.output(MANUFACTURER);
            } else if (this.$manufacturer) {
                this.$manufacturer.find(':first').prop('selected', true).end().trigger(EVENT_CHANGE);
                //默认第一项，重置初始状态
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.unbind();
            this.$element.removeData(NAMESPACE); //删除之前data设置的数据
        }
    }], [{
        key: 'setDefaults',
        value: function setDefaults(options) {
            $.extend(DEFAULTS, $.isPlainObject(options) && options);
        } //默认值修改

    }]);

    return sensorPicker;
}();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BindSensor = function () {
    function BindSensor(sensorCondition) {
        _classCallCheck$1(this, BindSensor);

        this.obj = sensorCondition;

        this.leftListSub = sensorCondition.leftList.list;
        //数据备份
        this.rightListSub = sensorCondition.rightList.list;

        this.initEvent(this.leftListSub, this.rightListSub, this.obj.leftTableId, this.obj.rightTableId, this.obj.addArrowId, this.obj.removeArrowId, this.obj.selectDivId, this.obj.confirmBtn);
        this.renderTable(this.leftListSub, this.obj.leftTableId, this.obj.rightTableId, this.rightListSub);
    }

    _createClass$1(BindSensor, [{
        key: 'renderTable',
        value: function renderTable(leftList, leftTableId, rightTableId, rightList) {
            if (leftList != null && leftList != undefined) {
                this.renderLeftTable(leftList, leftTableId);
            }
            if (rightList != null && rightList != undefined) {
                this.renderRightTable(rightList, rightTableId);
            }
        }

        //数据处理后渲染

    }, {
        key: 'renderLeftTable',
        value: function renderLeftTable(leftList, leftTableId) {
            var self = this;
            var tbody = [];
            if (leftList.length == 0) {
                tbody.push('无传感器');
            } else if (self.obj.hasTunnel == 'true') {
                leftList.forEach(function (item, i) {
                    item.sensorModel = item.sensorModel || '--';
                    var td = '<tr >\n        <td><input type=\'radio\'  name="radio" data-id= ' + i + ' />' + item.sensorName + '</td>\n        <td>' + item.sensorModel + '</td>\n        <td>' + item.productName + '</td></tr>';
                    tbody.push(td);
                });
            } else {
                leftList.forEach(function (item, i) {
                    item.sensorModel = item.sensorModel || '--';
                    var td = '<tr>\n        <td><input type=\'checkbox\' data-id= ' + i + ' />' + item.sensorName + '</td>\n        <td>' + item.sensorModel + '</td>\n        <td>' + item.productName + '</td></tr>';
                    tbody.push(td);
                });
            }
            var tbodyHtml = tbody.join('');
            $(leftTableId).html(tbodyHtml);
        }
    }, {
        key: 'renderRightTable',
        value: function renderRightTable(rightList, rightTableId) {
            var tbody = [];
            var self = this;
            if (rightList.length == 0) {
                tbody.push('无传感器');
            } else if (self.obj.hasTunnel == 'true') {

                rightList.forEach(function (item, i) {
                    var td = '<tr>\n        <td><input type=\'checkbox\'  data-id= ' + i + ' />' + item.sensorName + '</td>\n        <td>' + item.tunnelNumber + '</td>\n        <td>' + item.uuid + '</td></tr>';
                    tbody.push(td);
                });
            } else {

                rightList.forEach(function (item, i) {
                    var td = '<tr>\n        <td><input type=\'checkbox\'  data-id= ' + i + ' />' + item.sensorName + '</td>\n\n        <td>' + item.uuid + '</td></tr>';
                    tbody.push(td);
                });
            }
            var tbodyHtml = tbody.join('');
            $(rightTableId).html(tbodyHtml);
        }
    }, {
        key: 'initEvent',
        value: function initEvent(leftList, rightList, leftTableId, rightTableId, addArrowId, removeArrowId, selectDivId, cancelBtn, confirmBtn) {

            var self = this;
            $(addArrowId).on('click', self.addBindedData.bind(self)); //添加绑定数据
            $(removeArrowId).on('click', self.removeBindedData.bind(self)); //移除绑定数据
            $(selectDivId).on('change', 'select', self.selectContentChange.bind(self)); //选择框内容改变

            $(confirmBtn).on('click', self.confirmChoice.bind(self));
        }
    }, {
        key: 'unbind',
        value: function unbind(leftList, rightList, leftTableId, rightTableId, addArrowId, removeArrowId, selectDivId, cancelBtn, confirmBtn) {

            $(addArrowId).off(); //添加绑定数据
            $(removeArrowId).off(); //移除绑定数据
            $(selectDivId).off(); //选择框内容改变

            $(confirmBtn).off();
        }

        /**
         addBindedData 有通道号要填通道号，然后移右边
         **/

    }, {
        key: 'addBindedData',
        value: function addBindedData(e) {

            var self = this;

            //左侧表选中的input
            var targetList = $(self.obj.leftTableId).children('tr').children('td').children('input:checked');
            var targetLength = targetList.length;
            if (targetLength === 0) {
                return; //未选中
            }

            for (var i = targetLength - 1; i >= 0; i--) {

                var dataId = $(targetList[i]).attr('data-id'); //input的data-id，表格位置

                var removedData = this.leftListSub[dataId];
                this.leftListSub.splice(dataId, 1);

                if (this.obj.hasTunnel == 'true') {
                    self.addTunnelNumber.call(self, this.obj.tunnelLayerId, removedData);
                    return;
                }

                self.rightListSub.push(removedData); //左侧数据到右侧

            }

            self.renderTable(this.leftListSub, self.obj.leftTableId, self.obj.rightTableId, self.rightListSub);
            //渲染表格

        }

        /**
         添加通道号
         **/

    }, {
        key: 'addTunnelNumber',
        value: function addTunnelNumber(tunnelLayerId, removedData) {
            //写通道号,4位
            var self = this;
            //有通道，查
            $(tunnelLayerId).children('form').find('input').val('');
            layer.open({
                type: 1,
                title: '填写通道',
                area: 'auto',
                shade: [0.8, '#fafafa'],
                shadeClose: false,
                content: $(tunnelLayerId),
                btn: ['确定', '取消'],
                yes: function yes(index, layero) {
                    var value = $(tunnelLayerId).children('form').find('input').val();
                    //   if ($(` ${tunnelLayerId}Form`).valid()) {
                    //查重

                    var judge = void 0;
                    self.rightListSub.forEach(function (element, index) {
                        if (element.tunnelNumber == value) {
                            judge = false;
                        }
                    });
                    if (judge == false) {
                        layer.msg('该通道号已存在，请重新填写', {
                            icon: 2,
                            time: 1000
                        });
                    } else {

                        removedData.tunnelNumber = value;
                        layer.closeAll();
                        self.rightListSub.push(removedData);
                        self.renderTable(self.leftListSub, self.obj.leftTableId, self.obj.rightTableId, self.rightListSub);
                    }
                }
                // }
            });
        }

        /**
         移除绑定传感器*/

    }, {
        key: 'removeBindedData',
        value: function removeBindedData(e) {

            var self = this;

            //表选中的input
            var targetList = $(self.obj.rightTableId).children('tr').children('td').children('input:checked');
            var targetLength = targetList.length;
            if (targetLength === 0) {
                return; //未选中
            }

            //移除可选多个，有uuid移左边，无uuid直接删
            for (var i = targetLength - 1; i >= 0; i--) {
                var dataId = $(targetList[i]).attr('data-id'); //input的data-id，表格位置

                var removedData = self.rightListSub[dataId];
                if (removedData.uuid != undefined && removedData.uuid != '' && removedData.uuid != null) {
                    this.leftListSub.push(removedData); //有uuid，右侧数据到左侧
                }
                self.rightListSub.splice(dataId, 1);
            }

            self.renderTable(this.leftListSub, self.obj.leftTableId, self.obj.rightTableId, self.rightListSub);
            //渲染表格

        }

        //select默认为空，联动，只考虑选中值，option的value与text相同

    }, {
        key: 'selectContentChange',
        value: function selectContentChange(e) {
            var self = this;
            var element = $(e.currentTarget);
            var selectDivId = self.obj.selectDivId;
            var dataType = element.data();
            var filterList1 = void 0,
                filterList2 = void 0,
                filterList3 = void 0;

            var dataValue = e.currentTarget.value;
            if (Reflect.has(dataType, 'manufacturer')) {
                //厂商选项改变
                filterList3 = self.selectFilter(self.leftListSub, 'productNameEnum', dataValue);
            } else if (Reflect.has(dataType, 'sensor')) {
                filterList1 = self.selectFilter(self.leftListSub, 'productNameEnum', $(selectDivId).children('div').find('select').eq(0).val());

                filterList3 = self.selectFilter(filterList1, 'sensorTypeEnum', dataValue);

                //传感器类型选项改变
            } else if (Reflect.has(dataType, 'model')) {
                //型号选项改变
                filterList1 = self.selectFilter(self.leftListSub, 'productNameEnum', $(selectDivId).children('div').find('select').eq(0).val());

                filterList2 = self.selectFilter(filterList1, 'sensorTypeEnum', $(selectDivId).children('div').find('select').eq(1).val());

                filterList3 = self.selectFilter(filterList2, 'sensorModelEnum', dataValue);
            }
            self.renderLeftTable(filterList3, self.obj.leftTableId);
            //渲染左侧表格

        }

        //根据选择项过滤左侧数据

    }, {
        key: 'selectFilter',
        value: function selectFilter(leftList, selectType, dataValue) {
            leftList = leftList.filter(function (element) {
                if (dataValue == null || dataValue == '') {
                    return true;
                } else if (element[selectType] == dataValue) {
                    return true;
                }
            });
            return leftList;
        }

        //确认返回数据

    }, {
        key: 'confirmChoice',
        value: function confirmChoice(e) {
            var sendList = [];
            this.rightListSub.forEach(function (element) {
                var obj = {
                    id: null,
                    uuid: null,

                    tunnelNumber: null

                };
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.entries(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _ref = _step.value;

                        var _ref2 = _slicedToArray(_ref, 2);

                        var key = _ref2[0];
                        var value = _ref2[1];

                        if (key in element) {
                            obj[key] = element[key];
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                sendList.push(obj);
            });
            return sendList;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.unbind(this.leftListSub, this.rightListSub, this.obj.leftTableId, this.obj.rightTableId, this.obj.addArrowId, this.obj.removeArrowId, this.obj.selectDivId, this.obj.confirmBtn);
        }
    }]);

    return BindSensor;
}();

if ($.fn) {
    var AnotherSensorPicker = $.fn.sensorPicker;

    $.fn.sensorPicker = function jQuerySensorPicker(option) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        var result = void 0;
        //对应的每个dispicker
        this.each(function (i, element) {
            var $element = $(element);
            var data = $element.data(NAMESPACE); //取数据

            if (!data) {
                //已存对象，传destory，返回
                if (/destroy/.test(option)) {
                    return;
                }

                var options = $.extend({}, $element.data(), $.isPlainObject(option) && option);
                //参数合并为对象，对象(有/空)，默认值

                data = new sensorPicker(element, options); //得到对象
                $element.data(NAMESPACE, data); //NAMESPACE为当前对象
            }

            if (typeof option === 'string') {
                var fn = data[option]; //调用对象方法，比如$().sensorPicker('reset', true);

                if ($.isFunction(fn)) {
                    result = fn.apply(data, args);
                } //给方法传参，调用相应方法,data为对象
            }
        });
        return typeof result === 'undefined' ? this : result;
        //有数据返回数据，无数据链式调用
    };

    $.fn.sensorPicker.Constructor = sensorPicker;
    $.fn.sensorPicker.setDefaults = sensorPicker.setDefaults;

    $.fn.sensorPicker.noConflict = function noConflict() {
        $.fn.sensorPicker = AnotherSensorPicker;
        return this; //其它插件，同样命名空间
    };
}

if ($) {

    $.bindSensor = function jQueryBindSensor(options) {

        //参数合并为对象，对象(有/空)，默认值

        return new BindSensor(options); //得到对象
    };
}

if (WINDOW.document) {
    $(function () {
        $('[data-toggle="' + NAMESPACE + '"]').sensorPicker(); //默认初始化
    });
}
//方法写入jquery原型方法中，也可这样初始化$("#sensorPicker1").sensorPicker();

})));
//# sourceMappingURL=sensorPicker.js.map
