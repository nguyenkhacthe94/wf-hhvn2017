function SubMenuOpenToggle(tag) {
    $(tag).toggleClass('sub-menu-open');
};
function ValidateReceiveInformation() {
    return Validate($('._validationReceiveInformation'));
};
function Validate(elem) {
    return $(elem).validationEngine('validate', { promptPosition: "topLeft", scroll: false, showOneMessage: true });
};
function SwitchLanguage(id) {
    $("[id*='" + id + "']")[0].click();
};
(function () {
    var cx = '003127737716954742020:nbwsklcbbn4';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
})();
function Search() {
    //$(".gsc-search-box-tools .gsc-search-box input.gsc-search-button")[0].click();
};