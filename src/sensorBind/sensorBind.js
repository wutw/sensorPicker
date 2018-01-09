import $ from 'jquery';

import 'jquery-validation';

//进入绑定页面，先渲染，事件触发后返回处理数据，再渲染
export default class BindSensor {

    constructor(sensorCondition) {
        this.obj = sensorCondition;

        this.leftListSub = sensorCondition.leftList.list;
        //数据备份
        this.rightListSub = sensorCondition.rightList.list;



        this.initEvent(this.leftListSub, this.rightListSub, this.obj.leftTableId,
            this.obj.rightTableId,
            this.obj.addArrowId, this.obj.removeArrowId,
            this.obj.selectDivId,
            this.obj.confirmBtn);
        this.renderTable(this.leftListSub, this.obj.leftTableId,
            this.obj.rightTableId, this.rightListSub);
    }

    renderTable(leftList, leftTableId, rightTableId, rightList) {
        if (leftList != null && leftList != undefined) {
            this.renderLeftTable(leftList, leftTableId);

        }
        if (rightList != null && rightList != undefined) {
            this.renderRightTable(rightList, rightTableId);
        }
    }

    //数据处理后渲染
    renderLeftTable(leftList, leftTableId) {
        let self = this;
        let tbody = [];
        if (leftList.length == 0) {
            tbody.push('无传感器')
        } else if (self.obj.hasTunnel == 'true') {
            leftList.forEach((item, i) => {
                item.sensorModel = item.sensorModel || '--';
                let td = `<tr >
        <td><input type='radio'  name="radio" data-id= ${i} />${item.sensorName}</td>
        <td>${item.sensorModel}</td>
        <td>${item.productName}</td></tr>`;
                tbody.push(td);
            });

        } else {
            leftList.forEach((item, i) => {
                item.sensorModel = item.sensorModel || '--';
                let td = `<tr>
        <td><input type='checkbox' data-id= ${i} />${item.sensorName}</td>
        <td>${item.sensorModel}</td>
        <td>${item.productName}</td></tr>`;
                tbody.push(td);
            });
        }
        let tbodyHtml = tbody.join('');
        $(leftTableId).html(tbodyHtml);


    }

    renderRightTable(rightList, rightTableId) {
        let tbody = [];
        let self = this;
        if (rightList.length == 0) {
            tbody.push('无传感器')
        } else if (self.obj.hasTunnel == 'true') {

            rightList.forEach((item, i) => {
                let td = `<tr>
        <td><input type='checkbox'  data-id= ${i} />${item.sensorName}</td>
        <td>${item.tunnelNumber}</td>
        <td>${item.uuid}</td></tr>`;
                tbody.push(td);
            });


        } else {

            rightList.forEach((item, i) => {
                let td = `<tr>
        <td><input type='checkbox'  data-id= ${i} />${item.sensorName}</td>

        <td>${item.uuid}</td></tr>`;
                tbody.push(td);
            });


        }
        let tbodyHtml = tbody.join('');
        $(rightTableId).html(tbodyHtml);
    }

    initEvent(leftList, rightList, leftTableId, rightTableId, addArrowId, removeArrowId, selectDivId, cancelBtn, confirmBtn) {

      let self = this;
        $(addArrowId).on('click', self.addBindedData.bind(self)); //添加绑定数据
        $(removeArrowId).on('click', self.removeBindedData.bind(self)); //移除绑定数据
        $(selectDivId).on('change', 'select', self.selectContentChange.bind(self)); //选择框内容改变

        $(confirmBtn).on('click', self.confirmChoice.bind(self));
    }
  unbind(leftList, rightList, leftTableId, rightTableId, addArrowId, removeArrowId, selectDivId, cancelBtn, confirmBtn) {

    $(addArrowId).off(); //添加绑定数据
    $(removeArrowId).off(); //移除绑定数据
    $(selectDivId).off(); //选择框内容改变

    $(confirmBtn).off();
  }

    /**
     addBindedData 有通道号要填通道号，然后移右边
     **/
    addBindedData(e) {

        let self = this;

        //左侧表选中的input
        let targetList = $(self.obj.leftTableId).children('tr').children('td').children('input:checked');
        let targetLength = targetList.length;
        if (targetLength === 0) {
            return; //未选中
        }

        for (let i = targetLength - 1; i >= 0; i--) {

            let dataId = $(targetList[i]).attr('data-id'); //input的data-id，表格位置

            let removedData = this.leftListSub[dataId];
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
    addTunnelNumber(tunnelLayerId, removedData) {
        //写通道号,4位
        let self = this;
        //有通道，查
        $(tunnelLayerId).children('form').find('input').val('')
        layer.open({
            type: 1,
            title: '填写通道',
            area: 'auto',
            shade: [0.8, '#fafafa'],
            shadeClose: false,
            content: $(tunnelLayerId),
            btn: ['确定', '取消'],
            yes: function(index, layero) {
                let value = $(tunnelLayerId).children('form').find('input').val();
             //   if ($(` ${tunnelLayerId}Form`).valid()) {
                    //查重

                    let judge;
                    self.rightListSub.forEach((element, index) => {
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
        })



    }

    /**
     移除绑定传感器*/
    removeBindedData(e) {

        let self = this;


        //表选中的input
        let targetList = $(self.obj.rightTableId).children('tr').children('td').children('input:checked');
        let targetLength = targetList.length;
        if (targetLength === 0) {
            return; //未选中
        }


        //移除可选多个，有uuid移左边，无uuid直接删
        for (let i = targetLength - 1; i >= 0; i--) {
            let dataId = $(targetList[i]).attr('data-id'); //input的data-id，表格位置

            let removedData = self.rightListSub[dataId];
            if (removedData.uuid != undefined && removedData.uuid != '' && removedData.uuid != null) {
                this.leftListSub.push(removedData); //有uuid，右侧数据到左侧
            }
            self.rightListSub.splice(dataId, 1);


        }

        self.renderTable(this.leftListSub, self.obj.leftTableId, self.obj.rightTableId, self.rightListSub);
        //渲染表格


    }

    //select默认为空，联动，只考虑选中值，option的value与text相同
    selectContentChange(e) {
        let self = this;
        let element = $(e.currentTarget);
        let selectDivId = self.obj.selectDivId;
        let dataType = element.data();
        let filterList1,
            filterList2,
            filterList3;

        let dataValue = e.currentTarget.value;
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
    selectFilter(leftList, selectType, dataValue) {
        let self = this;

        leftList = leftList.filter((element) => {
            if (dataValue == null || dataValue == '') {
                return true;
            } else if (element[selectType] == dataValue) {
                return true;
            }

        });
        return leftList;





    }



    //确认返回数据

    confirmChoice(e) {
        let sendList = [];
        this.rightListSub.forEach((element) => {
            let obj = {
                id: null,
                uuid: null,

                tunnelNumber: null,



            };
            for ( let [key, value] of Object.entries(obj) ) {
                if (key in element) {
                    obj[key] = element[key];
                }


            }
            sendList.push(obj);


        });
        return sendList;

    }
  destroy (){
   this.unbind(this.leftListSub, this.rightListSub, this.obj.leftTableId,
     this.obj.rightTableId,
     this.obj.addArrowId, this.obj.removeArrowId,
     this.obj.selectDivId,
     this.obj.confirmBtn);

   }
}




