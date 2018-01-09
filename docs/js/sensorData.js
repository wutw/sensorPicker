var sensorCondition =  {
    leftList: {
        list: [{
            id: '111',
            uuid: '1',
            sensorName: '传感器1',
            productName: '天宝',
            sensorType: '温度传感器',
            productNameEnum: '1',

            sensorTypeEnum: '1',
            sensorModelEnum: '1',
            sensorModel: 'P11'
        },
            {
                id: '112',
                uuid: '11',
                sensorName: '传感器1',
                productName: '嵇康',
                sensorType: '温度传感器',
                sensorModel: 'P11',
                productNameEnum: '2',

                sensorTypeEnum: '1',
                sensorModelEnum: '1',
            },
            {
                id: '113',
                uuid: '',
                sensorName: '传感器1',
                productName: '嵇康',
                sensorType: '温度传感器',
                sensorModel: 'P11',
                productNameEnum: '2',

                sensorTypeEnum: '1',
                sensorModelEnum: '1',
            },
            {
                id: '114',
                uuid: '1111',
                sensorName: '传感器3',
                productName: '天宝',
                sensorType: '湿度传感器',
                sensorModel: 'P13',
                productNameEnum: '1',

                sensorTypeEnum: '2',
                sensorModelEnum: '3',
            },
            {
                id: '115',
                uuid: '11111',
                sensorName: '传感器3',
                productName: '天宝',
                sensorType: '湿度传感器',
                sensorModel: 'P13',
                productNameEnum: '1',

                sensorTypeEnum: '2',
                sensorModelEnum: '3',
            },
            {
                id: '116',
                uuid: '',
                sensorName: '传感器3',
                productName: '天宝',
                sensorType: '湿度传感器',
                sensorModel: 'P13',
                productNameEnum: '1',

                sensorTypeEnum: '2',
                sensorModelEnum: '3',
            }]
    },
    rightList: {
        list: [{

            id: '1',
            uuid: '2',
            sensorName: '传感器1',
            productName: '天宝',
            tunnelNumber: '1111',
            sensorType: '速度传感器',
            sensorModel: 'P21',
            productNameEnum: '1',

            sensorTypeEnum: '3',
            sensorModelEnum: '4',
        },
            {
                id: '2',
                uuid: '',
                sensorName: '传感器2',
                productName: '司南',
                tunnelNumber: '2111',
                sensorType: '湿度传感器',
                sensorModel: 'P31',
                productNameEnum: '3',

                sensorTypeEnum: '2',
                sensorModelEnum: '5',
            },
            {
                id: '3',
                uuid: '3',
                tunnelNumber: '3111',
                sensorName: '传感器3',
                productName: '天宝',
                sensorType: '温度传感器',
                sensorModel: 'P11',
                productNameEnum: '1',

                sensorTypeEnum: '1',
                sensorModelEnum: '1',
            },
        ]
    },

    selectDivId: '#sensorSearch', //select外div
    addArrowId: '#addBindSensor', //绑定
    removeArrowId: "#removeBindSensor", //解绑
    leftTableId: '#restSensor', //左侧表
    rightTableId: '#bindedSensor', //右侧表
    hasTunnel: 'true', //是否有通道
    tunnelLayerId: '#tunnelId',//通道弹出层Id
    confirmBtn: '.confirmBindSensor',//绑定传感器页面确定按钮






}
