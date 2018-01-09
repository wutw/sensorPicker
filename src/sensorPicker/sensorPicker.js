import $ from 'jquery';
import DEFAULTS from './defaults';
import SENSORINFO from './sensorInformations';
import { NAMESPACE, EVENT_CHANGE, EVENT_CLICK } from './constants';

const DEFAULT_CODE = '0000000000';
const MANUFACTURER = 'manufacturer'; //厂商
const SENSORTYPE = 'sensor'; //传感器类型
const MODELNUMBER = 'model'; //型号
const DATATYPE = 'type'; //数据类型
const DATAPARAMETER = 'parameter'; //参数

export default class sensorPicker {
    constructor(element, options) {
        this.$element = $(element);

        this.options = $.extend({}, DEFAULTS, $.isPlainObject(options) && options);
        //options多个对象合并，传入默认值参数更新，没有用定义好的
        this.placeholders = $.extend({}, DEFAULTS.selectDefalut);
        this.ready = false;
        this.init();
    }

    init() {
        const {options} = this;
        this.$company = $(options.companyClass);
        this.$rtu = $(options.rtuClass);
        const $selects = this.$element.find('.sensorPicker');

        const {length} = $selects; //select个数
        const data = {};

        $selects.each((i, select) => $.extend(data, $(select).data()));
        //data存储html默认值
        $.each([MANUFACTURER, SENSORTYPE, MODELNUMBER, DATATYPE], (i, type) => {
            if (data[type]) { //data存有manufacturer等
                options[type] = data[type];
                this[`$${type}`] = $selects.filter(`[data-${type}]`); //html写法
            //有data-的dom选定，表示为$MANUFACTURER
            } else {
                this[`$${type}`] = length > i ? $selects.eq(i) : null;
            } //没写data，按顺序

        });


        this.bind();

        // Reset all the selects (after event binding)
        this.reset(); //三级联动
        this.ready = true;
    }

    bind() {
        if (this.$manufacturer) {
            this.$manufacturer.on(EVENT_CHANGE, (this.onChangeManufacturer = $.proxy(() => {

                this.output(SENSORTYPE);

            }, this)));
        }
        //jQuery.proxy(),确保this指向
        //接受一个函数，然后返回一个新函数，
        //并且这个新函数始终保持了特定的上下文(context )语境。参数为函数，语境

        if (this.$sensor) {
            this.$sensor.on(EVENT_CHANGE, (this.onChangeSensorType = $.proxy(() => {

                this.output(MODELNUMBER);

            }, this)));
        }
        if (this.$model) {
            this.$model.on(EVENT_CHANGE, (this.onChangeModelNumber = $.proxy(() => {
                this.output(DATATYPE);
            /* this.output(DATAPARAMETER);*/
            },
                this)));
        }
        if (this.$type) {

            this.$type.on(EVENT_CHANGE, (this.onChangeDataType = $.proxy(() => {

                this.output(DATAPARAMETER);
            },
                this)));
        }
        if (this.$company) {
            this.$company.on(EVENT_CHANGE, (this.onChangeCompany = $.proxy(() => {
                this.queryRtu();
            }, this)));
        }
        if (this.$rtu) {
            this.$rtu.on(EVENT_CHANGE, (this.onChangeRtu = $.proxy(() => {
                this.queryTunnel();
            }, this)));
        }



    }


    unbind() {
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
            this.$rtu.off(EVENT_CHANGE, this.onChangeRtu );
        }

    }
    showOrHideWhenChange(initUuit, options) {
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

            $(options.uuidDIv).removeClass('none').find('input').prop('readonly','true');
            $(options.companyClass).children('option:first').prop('selected', 'true');
            $(options.rtuClass).html('').append('<option value="">请选择RTU</option>');
            $(options.tunnelDiv).addClass('none').find('input').val('');
        }
    }



    output(type) {
        const {options, placeholders} = this;
        let code;
        if (type == MANUFACTURER || type == SENSORTYPE || type == MODELNUMBER) {



            this.selectOutput(type, code, options, placeholders);

        } else if (type == DATATYPE) {
            this.dataTypeOutput(type, code, options, placeholders);
        } else if (type == DATAPARAMETER) {
            code = this.$type && (this.$type.find(':selected').data('code') || '');

            this.parameterOutput(code, options);
        }
    }
    selectOutput(type, code, options, placeholders) {
        const $select = this[`$${type}`];

        if (!$select || !$select.length) {
            return;
        } //判空
        const initUuit = options.hasUuid;


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


        const SensorInfos = this.getSensorInfos(code); //对象
        const valueDefault = options[type]; //用户给默认值枚举,或者汉字
        //const selectDefault = $select.val();
        const data = [];
        let matched = false;

        let obj1 = {
            manufacturer: 'P',
            sensor: 'T',
            model: 'S',
            type: 'D'
        };


        //option数据便利，根据用户指定初始值加selected
        if ($.isPlainObject(SensorInfos)) { //判断是否纯粹对象
            $.each(SensorInfos, (i, name) => { //便利对象
                if (i.indexOf('hasUuid') < 0) {


                    //将option每项value与数据库枚举对应，
                    let value = i.match(new RegExp(`${obj1[type]}\\d{2}`))[0];

                    let selected = (i.indexOf(valueDefault) >= 0) || (name.indexOf(valueDefault) >= 0
                    );

                    if (selected) {
                        matched = true;
                    }

                    data.push({
                        code: i, //code填入，以后根据这个找选中的code,格式[{},{}]
                        value,
                        name,
                        selected,
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
                selected: false,
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
    dataTypeOutput(type, code, options, placeholders) {
        code = this.$model && (this.$model.find(':selected').data('code') || '');
        const SensorInfos = this.getSensorInfos(code); //对象
        let initHasUuid = options.hasUuid;

        if ($.isPlainObject(SensorInfos)) { //判断是否纯粹对象
            const hasUuid = SensorInfos.hasUuid;

            /*   delete SensorInfos.hasUuid;*/
            if ((hasUuid && initHasUuid == null) || (hasUuid && initHasUuid)) {

                this.dataTypeLabelOutput(code, options, SensorInfos);
            } else if (hasUuid && (initHasUuid == false)) {

                layer.alert('该厂商、类型、型号下传感器有uuid,请重新选择', {

                    time: 2000
                });
                this.reset();

            } else if (!hasUuid && !initHasUuid) {
                $(options.uuidDIv).addClass('none').addClass('lack').find('input').val('');
                $(options.parameterLackUuid).removeClass('none')
                    .siblings('div').addClass('none');
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
    dataTypeLabelOutput(code, options, SensorInfos) {
        let $dataTypeDiv = $(options.parameterHasUuid);
        if (!$dataTypeDiv || !$dataTypeDiv.length) {
            return;
        }
        let data = [];

        $(options.uuidDIv).removeClass('none').addClass('has');

        $(options.parameterHasUuid).removeClass('none').html('')
            .siblings('div').addClass('none');


        $.each(SensorInfos, (i, name) => { //便利对象

            if (i.indexOf('hasUuid') < 0) {



                let value = i.match(new RegExp(`D\\d{2}`))[0];

                data.push({
                    code: i, //code填入，以后根据这个找选中的code,格式[{},{}]
                    value,
                    name,

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
    parameterOutput(data, options) {
        if (!data) {
            $(options.lackUuidParameter).html('');
            return;
        }
        if ($(options.uuidDIv).hasClass('lack')) {
            //无uuid
            let code = data;
            code = this.$type && (this.$type.find(':selected').data('code') || '');
            let {listHtml, data1} = this.getparamList(code);

            if (data1.length) {

                $(options.lackUuidParameter).html(listHtml);

            } else if (code == null) {
                $(options.lackUuidParameter).html('');
            } else {
                $(options.lackUuidParameter).html(`
            <div class='form-group'>
              <label class='control-label col-xs-4'></label>
              <div class='col-xs-8' style="color: #ff0f00;">
                无参数
              </div>
              </div>`);

            }

        } else if ($(options.uuidDIv).hasClass('has')) {
            //有uuid,展示所有参数
            $.each(data, (i, n) => {
                let code = n.code;

                let {listHtml, data1} = this.getparamList(code);
                if (data1.length) {

                    $(`.${data1.key}`).html(listHtml);

                } else {
                    const key = code.match(new RegExp(`D\\d{2}`))[0];
                    $(`.${key}`).html(`<div class='form-group'>
                <label class='control-label col-xs-4'></label>
                  <div class='col-xs-8' style="color: #ff0f00;">
                  无参数
                  </div>
                  </div>`);

                }


            });



        }
    }


    // eslint-disable-next-line class-methods-use-this
    getList(data) {
        const list = [];

        $.each(data, (i, n) => {
            const attrs = [
                `data-code="${n.code}"`,
                `data-text="${n.name}"`,
                `value="${n.value}"`,
            ];

            if (n.selected) {
                attrs.push('selected');
            }

            list.push(`<option ${attrs.join(' ')}>${n.name}</option>`);
        }); //拼接option

        return list.join('');
    }
    getdataTypeList(data) {
        const list = [];

        $.each(data, (i, n) => {
            const attrs = [
                `data-code="${n.code}"`,
                `data-text="${n.name}"`,
                `data-value="${n.value}"`,
            ];



            list.push(
                ` <div class="form-group dataTypeClass" ${attrs.join(' ')}>
                    <label  class="control-label col-xs-4"> 数据类型</label>
                    <div class="col-xs-8">
                        <label  class="control-label ">
                            ${n.name}
                        </label>
                    </div>
                </div> <div class=' ${n.value}'></div>`
            );
        }); //拼接option

        return list.join('');
    }
    getparamList(code) {

        const key = code.match(new RegExp(`D\\d{2}`))[0];
        const list = [];
        let data = [];
        const SensorInfos = this.getSensorInfos(code); //对象

        if (SensorInfos != null) {
            $.each(SensorInfos, (i, name) => { //便利对象

                let text = name.param;
                data.push({
                    key,
                    text
                });
            });
        }



        $.each(data, (i, n) => {

            list.push(` <div class="form-group"  >
                              <label class="control-label col-xs-4 col-md-4">${n.text}</label>

                                   <input class="form-control col-xs-8 col-md-8 js-example-basic-single param" placeholder="请输入参数" required='required' data-text=${n.text} name= parameterItem${i} />

                         </div>
                                   `);
        }); //拼接option
        return {
            listHtml: list.join(''),
            data1: data
        };

    }

    // eslint-disable-next-line class-methods-use-this
    getSensorInfos(code = DEFAULT_CODE) {
        return SENSORINFO[code] || null;
    }
    ajax({url='', data =null, async = true, }) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: url,
                async: true,
                send: data,
                success: function(result) {
                    resolve(result);

                }
            })
        })
    }
    //查Rtu下拉框
    queryRtu() {

        let {options} = this;
        $(options.tunnelDiv).addClass('none').find('input').val('');
        let self = this;
        if (!self.$company.val()) {
            return;
        }


        const sendData = {
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
      }).then(function(result) {
        if (!!result) {
          let resultObj = result;

          let list = resultObj.list;
          let list1 = [];
          list1[0] = `<option value=''>请选择RTU</option>`;
          //  let resultObj = JSON.parse(result);

          $.each(list, (i, name) => {
            let arr = [`value=${name.id}`, `data-type=${name.rtuAccessType}`, `data-sn=${name.snNumber}`];
            list1.push(`<option ${arr.join(' ')} >${name.rtuName}</option>`);
          });

          self.$rtu.html(list1.join(''));


        } else {
          layer.msg('请重试', {

            time: 2000
          })
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
    queryTunnel() {
        let {options} = this;
        let self = this;
        let rtuAccessType = self.$rtu.children('option:selected').data('type');

        if (!self.$rtu.val()) {
            return;
        }
        if (rtuAccessType == '10') {
            //有通道
            $(options.tunnelDiv).removeClass('none').find('input').val('');
        } else {
            $(options.tunnelDiv).addClass('none').find('input').val('');
        }

        const sendData = {
            id: self.$rtu.val(),
            rtuAccessType: rtuAccessType
        };

      self.ajax({

        url: options.tunnelUrl,
        data: sendData
      }).then(function(result) {
        if (!!result) {
          let resultObj = result;

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

    reset(deep = false) {
        if (!deep) {
            this.output(MANUFACTURER);

        } else if (this.$manufacturer) {
            this.$manufacturer.find(':first').prop('selected', true).end().trigger(EVENT_CHANGE);
        //默认第一项，重置初始状态
        }
    }

    destroy() {
        this.unbind();
        this.$element.removeData(NAMESPACE); //删除之前data设置的数据
    }

    static setDefaults(options) {
        $.extend(DEFAULTS, $.isPlainObject(options) && options);
    } //默认值修改
}
