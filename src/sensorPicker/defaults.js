export default {
  // Defines the initial value of select.
    selectDefalut: {
        manufacturer: '—— 选择厂商 ——',

        sensor: '—— 选择传感器类型 ——',

        model: '—— 选择传感器型号 ——',
        type: '--请选择数据类型--',
    },

    // Show placeholder.
    placeholder: true,
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

};
