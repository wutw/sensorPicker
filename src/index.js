import $ from  'jquery';
import sensorPicker from './sensorPicker/sensorPicker';
import BindSensor from './sensorBind/sensorBind';
import { NAMESPACE, WINDOW, } from './sensorPicker/constants';


//sensorPicker入口
if ($.fn) {
    const AnotherSensorPicker = $.fn.sensorPicker;

    $.fn.sensorPicker = function jQuerySensorPicker(option, ...args) {
        let result;
        //对应的每个dispicker
            this.each((i,element) =>{
            const $element = $(element);
            let data = $element.data(NAMESPACE); //取数据

            if (!data) { //已存对象，传destory，返回
                if (/destroy/.test(option)) {
                    return;
                }

                const options = $.extend({}, $element.data(), $.isPlainObject(option) && option);
                //参数合并为对象，对象(有/空)，默认值

                data = new sensorPicker(element, options); //得到对象
                $element.data(NAMESPACE, data); //NAMESPACE为当前对象
            }

            if (typeof option === 'string') {
                const fn = data[option]; //调用对象方法，比如$().sensorPicker('reset', true);

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

  $.bindSensor = function jQueryBindSensor (options) {

      //参数合并为对象，对象(有/空)，默认值

    return new BindSensor(options); //得到对象

  }

}



if (WINDOW.document) {
    $(() => {
        $(`[data-toggle="${NAMESPACE}"]`).sensorPicker(); //默认初始化
    });

}
//方法写入jquery原型方法中，也可这样初始化$("#sensorPicker1").sensorPicker();
