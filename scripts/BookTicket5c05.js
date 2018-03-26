function is_touch_device() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};
var bookingInfor = new Object();
$(document).ready(function () {
    $('div[id$="pnlBookTicket"]').validationEngine('attach', { promptPosition: "topLeft", scroll: false, showOneMessage: true });
    $('#imgContainer').smartZoom({
        'containerClass': 'zoomableContainer'
    });
    $('#zoomInButton,#zoomOutButton').bind("click", ZoomButtonClickHandler);
    function ZoomButtonClickHandler(e) {
        var scaleToAdd = 0.8;
        if (e.target.id == 'zoomOutButton')
            scaleToAdd = -scaleToAdd;
        $('#imgContainer').smartZoom('zoom', scaleToAdd);
    };
    SetDay();
    DeliveryTooltip();
});
function DeliveryTooltip() {
    $('.delivery-notice .fa').each(function (i, e) {
        var title = $(e).next('.delivery-notice-html').html();
        $(e).tooltip({
            html: true,
            title: title,
            trigger: 'click'
        });
    })
    $(document).mouseup(function (e) {
        var container = $(".delivery-notice .fa");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.tooltip("hide");
        }
    });
};
function SendBookingInfor() {
    bookingInfor.PTGN = $('input[name*="rdDeliveryMethod"]:checked').next('.wrap-check').text().trim();
    bookingInfor.CustomerName = $('input[id*="txtFullname"]').val();
    bookingInfor.Phone = $('input[id*="txtPhone"]').val();
    bookingInfor.Email = $('input[id*="txtEmail"]').val();
    bookingInfor.Address = $('input[id*="txtAddress"]').val();
    bookingInfor.UDP = $('input[id*="chkFavorable"]').val();
    bookingInfor.Notice = $('textarea[id*="txtContent"]').val();

    $('[data-selector="txtBookingInfor"]').val(JSON.stringify(bookingInfor))
};
function ValidateBookTicket() {
    SendBookingInfor();

    if ($('[data-selector="txtSelectedSeats"]').val() === "") {
        $("#step2-notice").css("display", "block");
        return false;
    }
    return Validate($('div[id$="pnlBookTicket"]'));
};
var seatsData = new Object();
function GetParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function AreaDetail(mappingId) {
    $.ajax({
        type: "POST",
        url: "/BookTicket.aspx/GetTicketAreaData",
        data: JSON.stringify({
            mappingId: mappingId
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (typeof res !== 'undefined' && typeof res.d !== 'undefined'
                && res.d.length > 0) {
                var result = JSON.parse(res.d);
                seatsData.SelectedAreaId = result.Id;
                bookingInfor.Class = result.TicketClass;
                bookingInfor.Around = result.TicketArea;
                $("#front-area").text(String.format("{0} - {1}", result.TicketClass, result.TicketArea))
                var data = result.Charts;
                if (data != "")
                    data = JSON.parse(data);
                else
                    data = []
                seatsData.SeatMap = [];
                seatsData.Rows = [];
                var rowSeat;
                for (var i = 0; i < data.length; i++) {
                    rowSeat = '';
                    for (var j = 0; j < parseInt(data[i].children[0].text) ; j++)
                        rowSeat += 's';
                    seatsData.SeatMap.push(rowSeat);
                    seatsData.Rows.push(data[i].text);
                };
                seatsData.Order = result.Order;
                var round = GetParameterByName("round");
                if (round === "semifinal") {
                    seatsData.Price = result.Price;
                    seatsData.Booked = JSON.parse(result.BookedCharts);
                    seatsData.Pending = JSON.parse(result.PendindCharts);
                }
                else {
                    seatsData.Price = result.PriceFinal;
                    if (result.BookedChartsFinal === "")
                        result.BookedChartsFinal = "[]";
                    if (result.PendindChartsFinal === "")
                        result.PendindChartsFinal = "[]";
                    seatsData.Booked = JSON.parse(result.BookedChartsFinal);
                    seatsData.Pending = JSON.parse(result.PendindChartsFinal);
                }
                $('.seatCharts-row').remove();
                $('.seatCharts-legendItem').remove();
                $('#seat-map,#seat-map *').unbind().removeData();
                SetSeatCharts();
                if (!is_touch_device())
                    BindMultiSelect();
            }
        },
        failure: function (response) {
        }
    });
    js_fw.open_popup({
        rel: '#pop-reservations', width: 700, afterClose: function () {
            if ($('[data-selector="txtSelectedSeats"]').val() === "") {
                $('#selected-seats').empty();
                $('#selected-seats2').empty();
                $counter.text(0);
                $('#total').text(0);
                $('#total2').text(0);
            }
        }
    });
};
function BindMultiSelect() {
    if (!$('.content-seat-map').hasClass('binded-multi-select')) {
        $('.content-seat-map').addClass('binded-multi-select');
        var div = document.getElementById('multi-select-seat'), x1 = 0, y1 = 0, x2 = 0, y2 = 0, x3, y3, x4, y4;
        function reCalc() {
            var offset = $(".content-seat-map").offset();
            var posY = offset.top - $(window).scrollTop();
            var posX = offset.left - $(window).scrollLeft();

            x3 = Math.min(x1, x2) - posX;
            x4 = Math.max(x1, x2) - posX;
            y3 = Math.min(y1, y2) - posY;
            y4 = Math.max(y1, y2) - posY;
            div.style.left = x3 + 'px';
            div.style.top = y3 + 'px';
            div.style.width = x4 - x3 + 'px';
            div.style.height = y4 - y3 + 'px';
        }
        $('.content-seat-map').mousedown(function (e) {
            div.hidden = 0;
            x1 = e.clientX;
            y1 = e.clientY;
            reCalc();
        })
        $('.content-seat-map').mousemove(function (e) {
            x2 = e.clientX;
            y2 = e.clientY;
            reCalc();
        })
        $('.content-seat-map').mouseup(function (e) {
            div.hidden = 1;

            //Set chart
            $('#seat-map .seatCharts-row .seatCharts-seat').each(function (index, tag) {
                var width = $(tag).outerWidth();
                var height = $(tag).outerHeight();

                //var offset = $(tag).offset();
                //var posX1 = offset.left - $(window).scrollLeft();
                //var posY1 = offset.top - $(window).scrollTop();
                var posX1 = $(tag).position().left;
                var posY1 = $(tag).position().top;

                var posX2 = posX1 + width;
                var posY2 = posY1 + height;

                if (!(x4 < posX1 || x3 > posX2 || y3 > posY2 || y4 < posY1)) {
                    $(tag).click();
                }
            })
        })
    }
};
var sc;
var $cart = $('#selected-seats'), $cart2 = $('#selected-seats2'), $counter = $('#counter,#counter2'), $total = $('#total'), $total2 = $('#total2');
//Add Dod Price
function AddDod(a) {
    if (a.length === 0)
        return "0";
    var rv = Reverse(a);
    var rt = "";
    for (var i = 0; i < rv.length; i++) {
        if ((i + 1) % 3 === 0 && i !== rv.length - 1)
            rt += rv[i] + ".";
        else
            rt += rv[i];
    }
    return Reverse(rt);
}
//Reverse string
function Reverse(s) {
    var o = '';
    for (var i = s.length - 1; i >= 0; i--)
        o += s[i];
    return o;
}
function SetSeatCharts() {
    sc = $('#seat-map').seatCharts({
        map: seatsData.SeatMap,
        seats: {
            s: {
                price: seatsData.Price,
                classes: 's-class',
                category: 's-class'
            }
        },
        naming: {
            top: false,
            getId: function (character, row, column, text) {
                var realColumn = seatsData.Order === 'asc' ? column : seatsData.SeatMap[row - 1].length + 1 - column;
                if (text === null)
                    return row + '_' + realColumn;
                else
                    return text[row - 1] + '_' + realColumn;
            },
            getLabel: function (character, row, column) {
                return seatsData.Order === 'asc' ? column : seatsData.SeatMap[row - 1].length + 1 - column;
            },
            text: seatsData.Rows
        },
        legend: {
            node: $('#legend'),
            items: [
                ['s', 'available', emptySeatText],
                ['s', 'selected', pendingText],
                ['s', 'unavailable', bookedText]
            ]
        },
        click: function () {
            if (this.status() == 'available') {
                $('<li>' + seatText + ' <b>' + this.settings.id + '</b>: <b>' + AddDod('' + this.data().price) + ' VNĐ</b> <a href="#" class="cancel-cart-item">[cancel]</a></li>')
                    .attr('id', 'cart-item-' + this.settings.id)
                    .data('seatId', this.settings.id)
                    .appendTo($cart);
                $('<li>' + seatText + ' <b>' + this.settings.id + '</b>: <b>' + AddDod('' + this.data().price) + ' VNĐ</b> </li>')
                    .appendTo($cart2);

                $counter.text(sc.find('selected').length + 1);
                bookingInfor.Count = sc.find('selected').length + 1;
                $total.text(RecalculateTotal(sc) + this.data().price);
                $total.text(AddDod($total.text()));
                $total2.text($total.text());
                bookingInfor.Total = RecalculateTotal(sc) + this.data().price + " VND";
                return 'selected';
            } else if (this.status() == 'selected') {
                $counter.text(sc.find('selected').length - 1);
                bookingInfor.Count = sc.find('selected').length - 1;
                $total.text(RecalculateTotal(sc) - this.data().price);
                $total.text(AddDod($total.text()));
                $total2.text($total.text());
                bookingInfor.Total = RecalculateTotal(sc) - this.data().price + " VND";
                $('#cart-item-' + this.settings.id).remove();
                return 'available';
            } else if (this.status() == 'unavailable') {
                return 'unavailable';
            } else {
                return this.style();
            }
        }
    });
    $('#selected-seats').empty();
    $('#selected-seats2').empty();
    $counter.text(0);
    $('#total').text(0);
    $('#total2').text(0);
    $('#selected-seats:not(.binded)').on('click', '.cancel-cart-item', function () {
        sc.get($(this).parents('li:first').data('seatId')).click();
        $('#selected-seats').addClass('binded');
    });
    sc.get(seatsData.Booked).status('unavailable');
    sc.get(seatsData.Pending).status('unavailable');
};
function RecalculateTotal(sc) {
    var total = 0;
    sc.find('selected').each(function () {
        total += this.data().price;
    });
    return total;
};
function NextStep2() {
    if (sc.find('selected').seatIds.length === 0) {
        $("#step1-notice").css("display", "block");
        return;
    }
    $('[data-selector="txtSelectedAreaId"]').val(seatsData.SelectedAreaId);
    $('[data-selector="txtSelectedSeats"]').val(JSON.stringify(sc.find('selected').seatIds));
    bookingInfor.Seats = $('[data-selector="txtSelectedSeats"]').val();
    $.magnificPopup.close();
    var boxBuyer = $(".cacu-re2");
    if (boxBuyer.length > 0)
        js_fw.go_element(".cacu-re2", 1000, -110);
    else
        js_fw.go_element(".btn-booking", 1000, -200);
};
function SetDay() {
    var maxDay = DaysInMonth($('[data-selector="slMonth"]').val(), $('[data-selector="slYear"]').val());
    var currentSelectedDay = parseInt($('[data-selector="slDate"]').val());
    if (currentSelectedDay > maxDay)
        $('[data-selector="slDate"]').val(1);
    $('[data-selector="slDate"] option').show();
    for (var i = maxDay; i < 31; i++)
        $('[data-selector="slDate"] option:eq(' + i + ')').hide();
};
function DaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
};
function ReviewBookingInfo() {
    js_fw.open_popup({ rel: '#pop-review-booking-info', width: 700 });
};