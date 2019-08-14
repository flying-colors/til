"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * サイト閲覧の際にローカルストレージに値を保存する
 */
function setItem(key, value) {
  try {
    return localStorage.setItem(key, value);
  } catch (e) {
    return null;
  }
}

function getItem(key) {
  try {
    return localStorage.getItem(key) || null;
  } catch (e) {
    return null;
  }
}

if ("#{track_state_changed}" === 'true') {
  widget.option({
    track_state_changed: true
  });
}

widget.show(); // サイカタを送るコードだけを実行したいので、見た目を以下の手順で無効化している。
// ・テンプレートは「最小化-クーポン（クーポンコード） 」
// ・画像ボタンを使用する をチェックOFF にしてアイコン自体を非表示
// ・×ボタン設定 で 縮小:表示/非表示 をチェックOFF にして×アイコン自体を非表示
// ・カルテ側のログは飛ばさないとならないので、widget.show()自体は残す
// ABテスト区分を送信

var sendProp25 = function sendProp25(customLink, p25) {
  // バックアップ
  var ltv = s.linkTrackVars,
      lte = s.linkTrackEvents;
  var p25bk = s.prop25; // 送信処理

  s.prop25 = p25;
  s.linkTrackVars = "prop25";
  s.linkTrackEvents = "None";
  s.tl(this, 'o', customLink); //カスタムリンクで送信
  // 復元

  s.linkTrackVars = ltv;
  s.linkTrackEvents = lte;
  s.prop25 = p25bk;
}; // Aパターン
// モーダル表示機能なし
// Bパターン
// モーダル表示機能あり
// ・再来訪モーダルが表示されるときにバナーモーダルを表示しない
// ・さんちゃんカルテが表示された場合バナーモーダルを表示しない
// ・キャンペーンLPを閲覧した場合初回来訪時にログを飛ばす
// ・初回来訪時にログを飛ばす


(function ($, s) {
  $('body').addClass('karte-ENH_KARTE_campaignBanner');
  var s2 = s_gi(s_account);

  var OcKarteModal =
  /*#__PURE__*/
  function () {
    function OcKarteModal(pattern, ABtest) {
      _classCallCheck(this, OcKarteModal);

      this.setParameter(pattern, ABtest);
      this.setStyle();
      this.initModal();
      this.setElement();
      this.bindEvent();
    }

    _createClass(OcKarteModal, [{
      key: "setParameter",
      value: function setParameter(pattern, ABtest) {
        this.pattern = pattern;
        this.ABtest = ABtest;
        this.bodyScrollTop = 0;
        this.linkButtonURL = this.setLinkURL();
        this.openClassName = 'is-modal-open';
        this.activeClassName = 'is-active';
        this.storageKey = 'karte_firstVisit';
        this.sanchanKey = 'karte_modal';
        this.window = $(window);
        this.head = $('head');
        this.body = $('body');
        this.contents = this.patterns();
        this.logId = "Ocs_CpnModal_2019_".concat(this.ABtest);
        this.modalLayout = "\n\t\t\t\t<div class=\"oc-karte-modal js-karte-modal\">\n\t\t\t\t\t<div class=\"oc-karte-modal__overlay js-karte-modal-overlay\"></div>\n\t\t\t\t\t<div class=\"oc-karte-modal__content\">\n\t\t\t\t\t\t".concat(this.contents.content, "\n\t\t\t\t\t\t<button type=\"button\" class=\"oc-karte-modal__close js-karte-modal-close\" onclick=\"var s2=s_gi(s_account);s2.tl(this,'o','").concat(s2.prop4, "_karte_ocs_modal_close')\">\u9589\u3058\u308B</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<a href=\"").concat(this.linkButtonURL, "\" class=\"oc-karte-modal__banner js-karte-trigger-banner js-karte-banner\" target=\"_blank\" onclick=\"var s2=s_gi(s_account);s2.tl(this,'o','").concat(s2.prop4, "_karte_ocs_banner')\"><img src=\"").concat(this.contents.bannerImage, "\"></a>\n\t\t\t");
      }
    }, {
      key: "setStyle",
      value: function setStyle() {
        var style = "<style>body.is-modal-open{position:fixed;left:0;width:100%;z-index:9998}.oc-karte-modal{position:fixed;left:0;top:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;width:100%;height:100%;padding:20px 0;font-family:'\u30D2\u30E9\u30AE\u30CE\u89D2\u30B4 ProN W6', 'Hiragino Kaku Gothic ProN', 'HiraKakuProN-W6', sans-serif;-webkit-transition:.3s;-o-transition:.3s;transition:.3s;opacity:0;visibility:hidden;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:auto;-webkit-overflow-scrolling:touch;z-index:9999;pointer-events:none}@media (orientation: landscape){.oc-karte-modal{-webkit-box-orient:initial;-webkit-box-direction:initial;-webkit-flex-direction:initial;-ms-flex-direction:initial;flex-direction:initial;-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start}}body.is-modal-open .oc-karte-modal{opacity:1;visibility:visible;pointer-events:inherit}.oc-karte-modal *{-webkit-box-sizing:border-box;box-sizing:border-box}.oc-karte-modal img{max-width:100%;vertical-align:bottom}.oc-karte-modal__banner{position:fixed;left:0;bottom:0;display:block;width:100%;cursor:pointer;text-align:center;-webkit-transition:.3s ease-out;-o-transition:.3s ease-out;transition:.3s ease-out;-webkit-transform:translateY(105%);-ms-transform:translateY(105%);transform:translateY(105%);z-index:29}.oc-karte-modal__banner img{max-width:100%;vertical-align:bottom}.oc-karte-modal__banner.is-active{-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0)}.oc-karte-modal__banner:focus{outline:0}.oc-karte-modal__overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:#e9ecf0;opacity:0.95}.oc-karte-modal__box{position:relative;padding-bottom:16px;background:#ffffff;border-radius:4px;overflow:hidden;text-align:center;-webkit-box-shadow:0 3px 6px 0 rgba(0,0,0,0.16);box-shadow:0 3px 6px 0 rgba(0,0,0,0.16)}@media screen and (max-width: 320px){.oc-karte-modal__box{padding-bottom:10px}}.oc-karte-modal__inner{padding:0 5.99%}.oc-karte-modal__close{position:relative;display:block;margin:20px auto 0;padding-left:22px;background:0;border:0;color:#24243f;font-size:16px}@media screen and (max-width: 320px){.oc-karte-modal__close{margin-top:10px}}.oc-karte-modal__close:focus{outline:0}.oc-karte-modal__close::before,.oc-karte-modal__close::after{position:absolute;left:0;top:50%;margin-right:5px;width:16px;height:2px;background:#24243f;margin-top:-1px;content:''}.oc-karte-modal__close::before{-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.oc-karte-modal__close::after{-webkit-transform:rotate(-45deg);-ms-transform:rotate(-45deg);transform:rotate(-45deg)}.oc-karte-modal__heading{padding:15px 0 14px;background:#e7f6ff;color:#0b41a0;font-size:20px;line-height:1.2}@media screen and (max-width: 320px){.oc-karte-modal__heading{padding:10px 0;font-size:18px}}.oc-karte-modal__heading-block{display:block}.oc-karte-modal__heading-block+.oc-karte-modal__heading-block{margin-top:10px;padding-top:0;font-size:24px}.oc-karte-modal__heading-sub{display:block;margin-bottom:5px;font-size:12px}.oc-karte-slider__title{position:relative;margin:25px 0 16px;padding:16px 0 10px;background:#e7f6ff;color:#0b41a0;font-size:15px;line-height:1.2}@media screen and (max-width: 320px){.oc-karte-slider__title{margin:15px 0 10px}}.oc-karte-slider__title-icon{position:absolute;left:50%;top:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;height:18px;padding:0 8px;background:#3ec1bd;border-radius:9px;color:#ffffff;font-size:10px;-webkit-transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);transform:translate(-50%, -50%)}.oc-karte-modal__button{display:block;margin-top:18px;padding:12px 0;border-radius:6px;background:#0ca5e6;color:#ffffff;font-size:16px;text-decoration:none}@media screen and (max-width: 320px){.oc-karte-modal__button{margin-top:10px;padding:5px 0;font-size:13px}}.oc-karte-modal__content{-webkit-flex-basis:100%;-ms-flex-preferred-size:100%;flex-basis:100%;width:100%;z-index:100;max-width:700px}.oc-karte-slider{width:100%}.oc-karte-slider .swiper-container{padding:10px 0}.oc-karte-slider__carousel{position:relative}.oc-karte-slider__inner{padding:0 20px;text-align:center}.oc-karte-slider__slide{padding:0 6px}.oc-karte-slider__content{margin-top:20px}@media screen and (max-width: 320px){.oc-karte-slider__content{margin-top:10px}}.oc-karte-slider__about{margin-top:10px;cursor:pointer}.oc-karte-slider__about-arrow{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.oc-karte-slider__about-arrow:before,.oc-karte-slider__about-arrow:after{display:inline-block;border-top:1px solid #24243f;border-right:1px solid #24243f;-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg);width:6px;height:6px;content:''}.oc-karte-slider__about-arrow:after{margin-left:-3px}.oc-karte-slider__img{width:100%}.oc-karte-slider-images{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;list-style-type:none;margin:0 auto -5px}.oc-karte-slider-images__item{-webkit-flex-basis:46.875%;-ms-flex-preferred-size:46.875%;flex-basis:46.875%}.oc-karte-slider-images__caption{margin-top:2px;color:#808d96;font-size:12px;line-height:1.2}.oc-karte-slider__comment{margin-top:12px;font-size:0;line-height:1.4}.oc-karte-slider__comment span{display:inline-block;font-size:14px}@media screen and (max-width: 320px){.oc-karte-slider__comment span{font-size:12px}}.oc-karte-slider__comment-head{margin-bottom:5px;font-weight:bold}.oc-karte-slider__pager{position:static;margin-top:2px;font-size:0}.oc-karte-slider__pager .swiper-pagination-bullet{width:7px;height:7px;margin:0 4px !important;background:#f8f9f9;opacity:1}.oc-karte-slider__pager .swiper-pagination-bullet.swiper-pagination-bullet-active{background:#1c80e7}.oc-karte-modal__l-b{margin-left:-20px;margin-right:-20px;padding:0}.oc-karte-modal__l-b img{width:100%}.oc-karte-summary{background:#f2faff}.oc-karte-summary__title{position:relative;margin-bottom:12px;color:#0b41a0;font-size:16px}.oc-karte-summary__title-inner{position:relative}.oc-karte-summary__title-inner:before{position:absolute;bottom:0;left:0;width:100%;height:8px;background:#ffd6fa;z-index:0;content:''}.oc-karte-summary__title-inner span{position:relative}.oc-karte-book-card{position:relative}.oc-karte-book-card__img{position:absolute;top:-7px;right:0;width:121px}.oc-karte-book-card__text{position:relative;font-size:20px;letter-spacing:-.03em;text-align:left;line-height:1.5}@media screen and (max-width: 320px){.oc-karte-book-card__text{font-size:16px}}.oc-karte-book-card__button{margin-top:25px}.oc-karte__paragraph{margin-top:10px;font-size:14px;line-height:1.4}.oc-karte__paragraph+.oc-karte__paragraph{margin-top:6px}.oc-karte__paragraph+.oc-karte-slider__about{margin-top:8px;line-height:1}.oc-karte__paragraph+.oc-karte-slider__about--strong{margin-top:30px}.oc-karte__paragraph .font-l{font-size:16px}.oc-karte__inline-block{display:inline-block;vertical-align:middle}.oc-karte__bold{font-weight:bold}.oc-karte__ta-l{text-align:left}.oc-karte__c-photo-l{margin:37px 0 35px}.karte-campaignBanner-sp,.karte-campaignlabel-sp{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox}.karte-campaignlabel-sp{font-size:11px;font-weight:700;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:146px;height:27px;margin-bottom:12px;color:#de30ca;border-radius:calc(27px / 2);background-color:#fceafa;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.karte-campaignlabel-sp.is-close{font-size:10px;width:130px;height:20px;margin-bottom:0}.karte-campaignBanner-sp{position:fixed;z-index:10;bottom:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;-webkit-transition-duration:.3s;-o-transition-duration:.3s;transition-duration:.3s}.karte-campaignBanner-sp.is-hide{opacity:0}.karte-campaignBanner-sp.is-close{border-top:none}.karte-campaignBanner-sp__image{width:100%;vertical-align:bottom}.karte-campaignBanner-sp__left{-webkit-box-align:stretch;-webkit-align-items:stretch;-ms-flex-align:stretch;align-items:stretch;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.karte-campaignBanner-sp__left.is-close{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-sizing:border-box;box-sizing:border-box;background:#1fa8b2;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.karte-campaignBanner-sp__right{position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:83px;border:1px solid #4abbd0;-webkit-box-align:stretch;-webkit-align-items:stretch;-ms-flex-align:stretch;align-items:stretch;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.karte-campaignBanner-sp__right.is-close{width:90px}.karte-campaignBanner-sp__link{font-size:11px;line-height:1.2;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;padding-left:10px;text-align:right;text-decoration:none;background:#fff;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.karte-campaignBanner-sp__link--ocTop:after,.karte-campaignBanner-sp__link:after{display:inline-block;width:6px;height:6px;border-top:1px solid;border-right:1px solid}.karte-campaignBanner-sp__link:after{margin-right:8px;margin-left:2px;content:\"\";-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg);vertical-align:1px}.karte-campaignBanner-sp__link.is-close{font-size:10px;padding-left:0}.karte-campaignBanner-sp__link.is-close:after{margin:0}.karte-campaignBanner-sp__link--ocTop:after,.karte-campaignBanner-sp__trigger:after{margin-right:8px;margin-left:2px;content:\"\";vertical-align:1px}.karte-campaignBanner-sp__link--ocTop{color:#ffd800}.karte-campaignBanner-sp__link--ocTop:after{-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.karte-campaignBanner-sp__text{font-size:10px;text-align:right;color:#fff}.karte-campaignBanner-sp__trigger{position:absolute;z-index:-1;top:-4px;left:50%;display:block;width:50px;height:50px;content:\"\";-webkit-transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);transform:translate(-50%, -50%);border-radius:25px;background:#1fa8b2}.karte-campaignBanner-sp__trigger:after{position:absolute;top:5px;left:17px;display:inline-block;width:10px;height:10px;-webkit-transform:rotate(135deg);-ms-transform:rotate(135deg);transform:rotate(135deg);border-top:2px solid #ffd800;border-right:2px solid #ffd800}.karte-campaignBanner-sp__trigger.is-close{top:5px}.karte-campaignBanner-sp__trigger.is-close:after{top:12px;-webkit-transform:rotate(-45deg);-ms-transform:rotate(-45deg);transform:rotate(-45deg)}.karte-campaignBanner-sp--top{display:block}.karte-campaignBanner-sp__wrapA{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.karte-campaignBanner-sp__wrapB{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;display:none;width:100%}.karte-campaignBanner-sp.is-short{border-top:0}.karte-campaignBanner-sp.is-short .karte-campaignBanner-sp__trigger{top:4px}.karte-campaignBanner-sp.is-short .karte-campaignBanner-sp__trigger:after{top:11px;-webkit-transform:rotate(-45deg);-ms-transform:rotate(-45deg);transform:rotate(-45deg)}.karte-campaignBanner-sp.is-short .karte-campaignBanner-sp__wrapA{display:none}.karte-campaignBanner-sp.is-short .karte-campaignBanner-sp__wrapB{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%}</style>";
        $('body').append(style);
      }
    }, {
      key: "initModal",
      value: function initModal() {
        this.body.append(this.modalLayout);
      }
    }, {
      key: "setElement",
      value: function setElement() {
        this.modal = $('.js-karte-modal');
        this.modalOverlay = $('.js-karte-modal-overlay');
        this.closeButton = $('.js-karte-modal-close');
        this.openButton = $('.js-karte-modal-open');
        this.banner = $('.js-karte-banner');
        this.slider = $('.js-karte-slider');
        this.karteTriggerBanner = $('.js-karte-trigger-banner');
        this.campaign = $('.js-modal-campaign');
        this.footer = $('footer');
        $('.searchBox__condition__row__change').addClass("js-karte-panel-openBtn");
        this.panelOpen = $('.js-karte-panel-openBtn');
        $('.searchPanel__back').find('.pgleft[href="#sindex"]').addClass("js-karte-panel-closeBtn");
        this.panelClose = $('.js-karte-panel-closeBtn');
        this.searchPanel = $('#sindex');
      }
    }, {
      key: "bindEvent",
      value: function bindEvent() {
        var _this = this;

        this.modalOverlay.click(function () {
          _this.closeModal();
        });
        this.closeButton.click(function () {
          _this.closeModal();
        });
        this.campaign.click(function () {
          _this.closeModal();
        });
        this.panelOpen.find('a').click(function () {
          _this.hideBanner();
        });
        this.panelClose.click(function () {
          _this.showBanner();
        }); // バナーの初期処理

        this.bindBannaer(); // 初回来訪時でない場合バナーを表示する

        if ((this.getStorage() || this.ABtest === 'A') && !this.isSlidePanel()) {
          this.showBanner();
        } // モーダルの表示


        if (this.getStorage() == null) {
          this.openModal();
          this.setStorage();
        } // サンちゃんKARTEが表示された場合は、モーダルを表示しない
        else if (this.getStorage() === 'ocKarteModal') {
            this.setStorage();
          }
      }
    }, {
      key: "fixedCartBanner",
      value: function fixedCartBanner(push) {
        var height = 0;

        if (push || $('.fixFooterCart').hasClass('is-show')) {
          height += 61;
        }

        this.banner.css('bottom', "".concat(height, "px"));
      }
    }, {
      key: "isSlidePanel",
      value: function isSlidePanel() {
        // 検索パネルがスライドされているかを判定
        // true：検索パネルが開いている状態
        // false：検索パネルが閉じている状態
        if (this.searchPanel.length) {
          var slideValue = Number(this.searchPanel.css('left').replace(/[^0-9]/g, '')); // 0以上の時はスライドされていると判定

          if (slideValue > 0) {
            return true;
          } // 0の時は初期画面なので、バナーを表示する
          else {
              return false;
            }
        } else {
          return false;
        }
      }
    }, {
      key: "showBanner",
      value: function showBanner() {
        this.adjustFooterHeight();
        this.banner.css('visibility', 'visible');
        this.banner.addClass(this.activeClassName);

        if (this.pattern === 'kengaku') {
          this.banner.css('transform', 'translateY(0px)');
        } else if (this.pattern === 'shiryo_complete') {
          this.banner.css('transform', 'translateY(-60px)');
        }
      }
    }, {
      key: "hideBanner",
      value: function hideBanner() {
        this.banner.css('visibility', 'hidden');
      }
    }, {
      key: "adjustFooterHeight",
      value: function adjustFooterHeight() {
        if (this.pattern === 'kosya' || this.pattern === 'kengaku') {
          // 資料をまとめて請求するの場合フッターが見切れるため対応
          this.footer.css('padding-bottom', window.parent.screen.width * 0.2);
        }
      }
    }, {
      key: "bindBannaer",
      value: function bindBannaer() {
        // 初回来訪時のみ非表示にする
        if (this.getStorage() == null) {
          this.banner.css('visibility', 'hidden');
        }

        if (this.pattern === 'kosya') {
          this.window.scroll(function () {
            // 初回訪問を完了させている時
            if (this.getStorage()) {
              // 「まとめてリスト追加」ボタンを押した直後の「資料をまとめて請求する」ボタン
              var stateFooterBtn1 = $('[data-type=footerFix]').css('display');
              var stateFooterBtn2 = $('[data-type=gakkoFooterFix]').css('display');

              if (stateFooterBtn1 === 'block' || stateFooterBtn2 === 'block') {
                this.banner.removeClass(this.activeClassName);
                this.banner.css('transform', 'translateY(-60px)');
              } else {
                this.banner.addClass(this.activeClassName);
                this.banner.css('transform', '');
              }
            }
          }.bind(this)); // 「まとめてリスト追加」ボタンを押した直後

          $('[data-action=addCart]').click(function () {
            this.banner.css('transform', 'translateY(-60px)');
          }.bind(this)); // 「資料をまとめて請求する」ボタンが表示されている時

          var stateFooterBtn3 = $('[data-type=gakkoFooterFix]').hasClass('is-show');

          if (stateFooterBtn3) {
            this.banner.css('transform', 'translateY(-60px)');
            $('[data-type=gakkoFooterFix]').css('z-index', 12);
          } else {
            this.banner.css('transform', '');
          }
        } else if (this.pattern === 'shiryo_complete') {
          this.banner.css('transform', 'translateY(100px)');
        }
      }
    }, {
      key: "openModal",
      value: function openModal() {
        // 再来訪モーダルと被らないように設定
        if (this.pattern === 'kosya' && $('.reVisitorModal__overlay').hasClass('is-show')) {
          return false;
        }

        if (this.ABtest === 'A') {
          sendProp25(this.logId, this.logId);
          return false;
        } else {
          this.bodyScrollTop = this.window.scrollTop();
          this.body.css({
            top: 0 - this.bodyScrollTop,
            position: 'fixed'
          });
          this.body.addClass(this.openClassName);
          sendProp25(this.logId, this.logId);
        }
      }
    }, {
      key: "closeModal",
      value: function closeModal() {
        this.body.removeClass(this.openClassName).removeAttr('style');
        $('html, body').scrollTop(this.bodyScrollTop); // モーダルを消した時かつ検索パネルが開いていない場合バナーを表示

        if (!this.isSlidePanel()) {
          this.showBanner();
        }
      }
    }, {
      key: "setStorage",
      value: function setStorage() {
        // 再来訪モーダルが表示される場合は、モーダルを表示しない
        if (this.pattern === 'kosya' && $('.reVisitorModal__overlay').hasClass('is-show')) {
          return false;
        }

        setItem(this.storageKey, true);
      }
    }, {
      key: "getStorage",
      value: function getStorage() {
        return getItem(this.storageKey) || getItem(this.sanchanKey);
      }
    }, {
      key: "patterns",
      value: function patterns() {
        var modalData = {};
        this.searchBannerCampaign();
        modalData.linkURL = '/rnet/s/ocpre/ocs/';
        modalData.bannerImage = this.bannerImg;
        modalData.content = this.createModal(modalData.buttonText);
        return modalData;
      }
    }, {
      key: "createModal",
      value: function createModal() {
        if (this.pattern === 'kosya') {
          this.setPatternKosya();
        } else if (this.pattern === 'kengaku' || this.pattern === 'shiryo_complete') {
          this.setPatternKengaku();
        }

        return "\n\t\t\t\t<div class=\"oc-karte-slider__inner\">\n\t\t\t\t\t<a class=\"js-modal-campaign\" href=\"".concat(this.setLinkURL(), "\" target=\"_blank\" onclick=\"var s2=s_gi(s_account);s2.tl(this,'o','").concat(s2.prop4, "_karte_ocs_modal_detail')\">\n\t\t\t\t\t\t<img src=\"").concat(this.img, "\">\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t");
      }
    }, {
      key: "setLinkURL",
      value: function setLinkURL() {
        return '/rnet/s/ocpre/ocs/';
      }
    }, {
      key: "setPatternKosya",
      value: function setPatternKosya() {
        this.img = "#{s_modal_kosya}";
      }
    }, {
      key: "setPatternKengaku",
      value: function setPatternKengaku() {
        this.img = "#{s_modal_Kengaku}";
      }
    }, {
      key: "searchBannerCampaign",
      value: function searchBannerCampaign() {
        if (this.pattern === 'kosya') {
          this.bannerImg = "#{s_bnr_kosya_oc_campaign}";
        } else {
          this.bannerImg = "#{s_bnr_oc_campaign}";
        }
      }
    }]);

    return OcKarteModal;
  }();

  var OcKarteLabel =
  /*#__PURE__*/
  function () {
    function OcKarteLabel() {
      _classCallCheck(this, OcKarteLabel);

      this.setParameter();
      this.init();
      this.bind();
    }

    _createClass(OcKarteLabel, [{
      key: "setParameter",
      value: function setParameter() {
        this.$moreLink = $('[data-obc-more="trigger"]');
      }
    }, {
      key: "init",
      value: function init() {
        // 見学会検索画面では、始めにカセット20個だけ表示されるのでそれにラベルを付与する
        this.addCampaignLabel();
      }
    }, {
      key: "addCampaignLabel",
      value: function addCampaignLabel() {
        // リストからキャンペーン対象校を検索
        $('.c-oc-conductorCassetteTour__card').each(function (index, obj) {
          var $campaignLabel = $(obj).find('.karte-campaignlabel-sp'); // キャンペーンラベルが付与されていない場合

          if ($campaignLabel.length === 0) {
            // キャンペーン対象校にラベル付与
            $(obj).find('.c-oc-conductorCassetteTour__contents').prepend('<div class="karte-campaignlabel-sp">キャンペーン対象校</div></div>');
          }
        });
      } // ajaxで追加したカセットにキャンペーン対象校ラベル付与（20個目以降の追加処理）

    }, {
      key: "bind",
      value: function bind() {
        var _this2 = this;

        this.$moreLink.click(function () {
          var countBefore = $('.c-oc-conductorCassetteTour__card').length;
          var countAfter = 0;
          var timer = null;

          var checkCassette = function checkCassette() {
            countAfter = $('.c-oc-conductorCassetteTour__card').length;

            if (countAfter > countBefore) {
              clearInterval(timer);

              _this2.addCampaignLabel();

              countBefore = countAfter;
            }
          };

          timer = setInterval(checkCassette, 300);
        });
      }
    }]);

    return OcKarteLabel;
  }();

  var ABtest = 'A'; // 画面分岐(Karte発火のGTMと同一条件で分岐させる)

  if (location.pathname.match(/^(\/smp\/(gakko\/top\/SC\d{6}.*|gakubugakka\/top\/SC\d{6}\/\d{17}.*|openCampus\/list\/gakko\/SC\d{6}.*|openCampus\/gakubugakka\/SC\d{6}.*|openCampus\/detail\/SC\d{6}.*))$/)) {
    // モーダル表示
    new OcKarteModal('kosya', ABtest);
  } else if (location.pathname.match(/^(\/smp\/openCampus\/list(?!\/gakko).*)\/?$/)) {
    // 見学会一覧
    new OcKarteModal('kengaku', ABtest);
    new OcKarteLabel();
  } else if (location.pathname.match(/^(\/smp2\/shiryoSeikyu\/entry\/complete.*)\/?$/)) {
    // 資料請求完了画面
    new OcKarteModal('shiryo_complete', ABtest);
  }
})(jQuery, window.s);
