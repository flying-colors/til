var $ = require('jquery');

$(function () {
    // カウントダウン文言
    class Popup {
        constructor() {
            this.countAddSchool = 0;
            this.init();
        }
        init() {
            this.setPopup();
            this.getRemainNum();
            this.bindEvent();
        }
        setPopup(){
            if($('.output').length){
                $('.popup').show().insertAfter('.output:last');
            }
        };
        getRemainNum() {
            this.countRemainNum = 7;

            const arrShiryoCd = [];

            addedShiryoCd = $('[name="addedShiryoCd"]').val().split(',');

            console.log(addedShiryoCd);
            
            $('[data-shiryocd]').each((index,elm)=>{
                const shiryoCd = $(elm).data('shiryocd').toString();
                if($(elm).data('yuryoflag') === 0){
                    arrShiryoCd.push(shiryoCd);
                }
                arrShiryoCd.push(addedShiryoCd);
            });
                        
            const setShiryoCd = new Set(arrShiryoCd);
            console.log(setShiryoCd);
            
            if(this.countRemainNum > 0){
                $('.js-countDown').text(this.countRemainNum - setShiryoCd.size);
            } else {
                $('.js-countDown').text('0');
                $('.popup').addClass('is-full');
                return false;
            }
        };
        bindEvent(){
            $('.js-addSchool').on('click',()=>{
                if($('.input').val() === ''){
                    return false;
                }
            });
        }
    }
    new Popup();
});
