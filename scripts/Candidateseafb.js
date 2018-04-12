$(document).ready(function () {
    pictureCatJson = JSON.parse(pictureCatJson);
    BindPictureCat();
    candidateJson = JSON.parse(candidateJson);
    candidateJson = Shuffle(candidateJson);
    BindCandidate("");
});
function BindPictureCat() {
    var option = "";
    for (var name in pictureCatJson) {
        option += String.format("<option value='{0}'>{1}</option>", name, pictureCatJson[name]);
    }
    $("#slPictureCat").html(option);
};
function BodauTiengViet(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
};
function BindCandidate(key) {
    var listPicture, listCandidate, listEliminatedCandidate, Candidate, rowCandidate, rowElimanatedCandidate;
    listCandidate = "";
    listEliminatedCandidate = "";
    rowCandidate = "";
    rowElimanatedCandidate = "";
    var endRowCandidate = true;
    var endRowElimunatedCandidate = true;
    var countCandidate = 0;
    var countElimanatedCandidate = 0;
    for (var i = 0; i < candidateJson.length; i++) {
        if (key != "" && candidateJson[i].FullName.toLowerCase().indexOf(key.toLowerCase()) === -1
            && BodauTiengViet(candidateJson[i].FullName).toLowerCase().indexOf(key.toLowerCase()) === -1)
            continue;
        endRowCandidate = false;
        endRowElimunatedCandidate = false;
        listPicture = "";
        if (candidateJson[i].Picture != null) {
            for (var j = 0; j < candidateJson[i].Picture.length; j++) {
                var spObj = candidateJson[i].Picture[j];
                for (var name in spObj) {
                    if (name === $("#slPictureCat").val()) {
                        var value = spObj[name];
                        for (var k = 0; k < value.length; k++) {
                            var smallPiture = String.format("/FileStorage/Candidate/Small_thumbnail/{0}", value[k]);
                            listPicture += String.format(templatePicture, candidateJson[i].SEOId, candidateJson[i].FullName, smallPiture);
                        }
                    }
                };
            }
        }
        var isEliminated = candidateJson[i].IsEliminated;
        if (isEliminated) {
            listEliminatedCandidate += String.format(templateEliminatedCandidateItem, listPicture, candidateJson[i].FullName);
            if ((countElimanatedCandidate + 1) % 4 === 0) {
                rowElimanatedCandidate += String.format(templateRowCandidate, listCandidate);
                endRowElimunatedCandidate = true;
                listEliminatedCandidate = "";
            }
            countElimanatedCandidate++;
        }
        else {
            listCandidate += String.format(templateCandidateItem,
                listPicture,
                candidateJson[i].FullName,
                candidateJson[i].IdentificationNumber,
                candidateJson[i].RatingCount,
                parseInt(totalRatingCount === 0 ? 0 : candidateJson[i].RatingCount * 100 / totalRatingCount));
            if ((countCandidate + 1) % 4 === 0) {
                rowCandidate += String.format(templateRowCandidate, listCandidate);
                endRowCandidate = true;
                listCandidate = "";
            }
            countCandidate++;
        }
    }
    if (!endRowCandidate)
        rowCandidate += String.format(templateRowCandidate, listCandidate);
    if (!endRowElimunatedCandidate)
        rowElimanatedCandidate += String.format(templateRowCandidate, listEliminatedCandidate);
    $("#candidates-append").append(rowCandidate + rowElimanatedCandidate);
    SetImage();
    Slide();
};
function SetImage() {
    var mdl = $('#mdl-contestants');
    var dataImg = mdl.find('.slide a');
    var img = dataImg.find('.img');
    js_fw.setImage(dataImg, img);
};
function Slide() {
    var mdl = $('#mdl-contestants');
    var slide = mdl.find('.wrap-slide .slide');
    var eliminated = mdl.find('.wrap-slide.eliminated .slide');
    slide.slick({
        slidesToShow: 1,
        slideScroll: 1,
        speed: 1000,
        autoplay: true,
        dots: false,
        arrows: true
    });
    eliminated.slick("unslick");
    $('.slick-arrow').empty();
};
function Shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};
var timeoutSearchCandidate;
function SearchFullName() {
    clearTimeout(timeoutSearchCandidate);
    timeoutSearchCandidate = setTimeout(function () {
        $("#candidates-append").empty();
        var key = $("#txtSearchFullName").val();
        BindCandidate(key);
    }, 500);
};
function ChangePictureCat() {
    $("#candidates-append").empty();
    var key = $("#txtSearchFullName").val();
    BindCandidate(key);
};