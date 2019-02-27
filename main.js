(function () {
    "use strict";
    const arry = ['太郎', '次郎', '三郎', '士郎', '', '五郎', ''];
    // const arry = [3, 6, 18, 21, 30];
    arry.forEach((item, index) => {
        console.log(`${index + 1}: ${item}`);
    });

    $('.trigger').on('click', (e) => {
        $(e.target).toggleClass('is-open');
        $(e.target).next().slideToggle();
    });
})();
