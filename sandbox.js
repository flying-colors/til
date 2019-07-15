(function () {
    "use strict";
    class Modal {
        constructor() {
            this.init();
        }

        init() {
            this.$modal = $('.modal');
            this.$modalInner = $('.modal__inner');
            this.$modalTrigger = $('[data-open-modal=trigger]');
            this.$sendBtn = $('[data-send=btn]');
            this.$closeBtn = $('[data-close-modal=btn]');
            this.$cancelBtn = $('[data-cancel=btn]');
            this.userName = $('[name=userName]');
            this.userAddr = $('[name=userAddr]');
            this.userTel = $('[name=userTel]');
            this.inputMemory = {
                userName: '',
                userAddr: '',
                userTel: ''
            }
            this.bindEvents();
        }
        openModal() {
            this.$modal.fadeIn();
        }
        closeModal() {
            this.$modal.fadeOut();
        }
        uncloseModal() {
            return false;
        }
        // 入力内容を保存
        saveInputMemory() {
            this.inputMemory.userName = this.userName.val();
            this.inputMemory.userAddr = this.userAddr.val();
            this.inputMemory.userTel = this.userTel.val();
        }
        // 前回入力内容を復元
        getInputMemory() {
            this.userName.val(this.inputMemory.userName);
            this.userAddr.val(this.inputMemory.userAddr);
            this.userTel.val(this.inputMemory.userTel);
        }
        clearInputMemory() {
            this.inputMemory = {};
        }
        // イベントをバインド
        bindEvents() {
            // モーダルを開く
            this.$modalTrigger.on('click', (e) => {
                e.preventDefault();
                this.getInputMemory();
                this.openModal();
            });
            // モーダルの外側をクリックしたら閉じる
            this.$modal.on('click', () => {
                this.closeModal();
            });
            // モーダルの内側をクリックしても何もしない
            this.$modalInner.on('click', (e) => {
                e.stopPropagation();
                this.uncloseModal();
            });
            // 送信ボタン
            this.$sendBtn.on('click', (e) => {
                e.stopPropagation();
                this.closeModal();
            });
            // 閉じるボタン
            this.$closeBtn.on('click', (e) => {
                e.stopPropagation();
                this.closeModal();
                this.clearInputMemory();
            });
            // キャンセルボタン
            this.$cancelBtn.on('click', (e) => {
                e.stopPropagation();
                this.saveInputMemory();
                this.closeModal();
            });
        }
    }
    const revisitorsModal = new Modal();
    const key = 'visitCount_' + $('[name="key"]').data('school');
    const initData = {
        visitCount: 1,
        expire: ''
    }
    const initDataList = () => {
        localStorage.setItem(key, JSON.stringify(initData));
    }
    const dispSetting = {
        firstTime: 2,
        secondTime: 4,
        thirdTime: 8
    }

    if (!localStorage.getItem(key)){
        initDataList();
    } else {
        let data = localStorage.getItem(key);
        data = JSON.parse(data);
        data.visitCount++;

        const visitCount = data.visitCount;
        
         if (visitCount === dispSetting.firstTime) {
             revisitorsModal.openModal();
         } else if (visitCount === dispSetting.secondTime) {
             revisitorsModal.openModal();
         } else if (visitCount === dispSetting.thirdTime) {
             revisitorsModal.openModal();
         }

        localStorage.setItem(key, JSON.stringify(data));
    }

    const clearData = ()=>{
        localStorage.removeItem(key);
    }

    const $checkbox = $('[data-shiryo="select"]'),
          $submit = $('.submit'),
          $clear = $('.js-clearData');

    $checkbox.on('change',()=>{
        if (!$checkbox.prop('checked')){
            $('.errorMsg').show().text('どれか選択してください')
        } else {
            $('.errorMsg').hide();
        }
    });

    $submit.on('click',()=>{
        if (!$checkbox.prop('checked')) {
            return false;
        } else {
            $('#form').submit();
        }
    });

    $clear.on('click',()=>{
        clearData();
        return false;
    });
})();
