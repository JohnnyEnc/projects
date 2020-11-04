var wheelSpinning = false;
var roulette;

$(document).ready(function () {

    $("#restart").on("click", function () {
        openModal = true;
        localStorage.clear();
        setLocalStorage();
        fillTable($('#configAwardsTable'));
    });

    document.addEventListener("keydown", keyDownTextField, false);

    setLocalStorage();

    /**
     * Roulette
     */
    // Calculate canvas size on load
    var _windowsSize = $(window).width();
    var _size = _windowsSize;
    var _rouletteRadious;

    if (_windowsSize > 1025) {
        _size = _size / 3;
        _rouletteRadious = _size / 2.2;
    }
    else {
        _size = _size / 1.2;
        _rouletteRadious = _size / 2.1;
    }
    var _rouletteInnerRadious = _size / 8;

    // Set canvas size
    var _width = _size;
    var _height = _size;
    $('canvas').attr('width', _width);
    $('canvas').attr('height', _height);
    // Create the roulette
    roulette = new Winwheel({
        'numSegments': getRemainingAwardsCount(),
        'outerRadius': _rouletteRadious, // Set outer radius so wheel fits inside the background.
        'innerRadius': _rouletteInnerRadious, // Make wheel hollow so segments dont go all way to center.
        'rotationAngle': 0,
        'textAlignment': 'center',
        'lineWidth': 4,
        'segments': getRemainingAwards(),
        'animation': {
            'type': 'spinToStop',
            'duration': 5,
            'spins': 8,
            'callbackFinished': 'resetSpin();',
            'callbackAfter': 'drawPointer(true, this);'
        }
    });
    // Draw the roulette pointer
    drawPointer(false);
    /* End Roulette */

    // Open modal event
    $('#configAwardsModal').on('shown.bs.modal', function () {
        fillTable($('#configAwardsTable'));
    });

    $('#seeAwardsModal').on('shown.bs.modal', function () {
        fillTable($('#awardsTable'));
    });

    // Close modal event
    $('#configAwardsModal').on('hidden.bs.modal', function () {
        location.reload();
    });

    $('#seeAwardsModal').on('hidden.bs.modal', function () {
        location.reload();
    });
});

function setLocalStorage() {
    var defaultQuantity = 50;
    var defaultJSON = [{
        "Awards": [{
            "id": 0,
            "cantidad": '!',
            "restantes": '!',
            "fillStyle": '#7C878E',
            'text': 'Gracias por participar',
            'textFillStyle': 'white',
            'strokeStyle': 'white'
        }, {
            "id": 1,
            "cantidad": defaultQuantity,
            "restantes": defaultQuantity,
            "fillStyle": 'white',
            'text': 'Mochila',
            'textFillStyle': '#E31C79',
            'strokeStyle': 'white'
        }, {
            "id": 2,
            "cantidad": defaultQuantity,
            "restantes": defaultQuantity,
            "fillStyle": '#E31C79',
            'text': 'Lapicero',
            'textFillStyle': 'white',
            'strokeStyle': 'white'
        }, {
            "id": 3,
            "cantidad": defaultQuantity,
            "restantes": defaultQuantity,
            "fillStyle": '#7C878E',
            'text': 'Bulto',
            'textFillStyle': 'white',
            'strokeStyle': 'white'
        }, {
            "id": 4,
            "cantidad": defaultQuantity,
            "restantes": defaultQuantity,
            "fillStyle": 'white',
            'text': 'Chupi',
            'textFillStyle': '#E31C79',
            'strokeStyle': 'white'
        }, {
            "id": 5,
            "cantidad": defaultQuantity,
            "restantes": defaultQuantity,
            "fillStyle": '#E31C79',
            'text': 'PopSockets',
            'textFillStyle': 'white',
            'strokeStyle': 'white'
        },{
            "id": 6,
            "cantidad": defaultQuantity,
            "restantes": defaultQuantity,
            "fillStyle": 'white',
            'text': 'Memorias USB',
            'textFillStyle': '#E31C79',
            'strokeStyle': 'white'
        }, {
            "id": 7,
            "cantidad": defaultQuantity,
            "restantes": defaultQuantity,
            "fillStyle": '#E31C79',
            'text': 'Plumas Fuente',
            'textFillStyle': 'white',
            'strokeStyle': 'white'
        },
        {
            "id": 8,
            "cantidad": defaultQuantity,
            "restantes": defaultQuantity,
            "fillStyle": 'white',
            'text': 'Porta Tarjeta',
            'textFillStyle': '#E31C79',
            'strokeStyle': 'white'
        }]
    }];

    if (localStorage.getItem('defaultJSON') === null) {
        var defaultExisting = filterExistingAwards(defaultJSON[0].Awards);
        defaultJSON[0].Awards = defaultExisting;
        localStorage.setItem('defaultJSON', JSON.stringify(defaultJSON));
    }
}

function drawPointer(isMoving) {
    var c = roulette.ctx;
    c.beginPath();
    c.arc(roulette.centerX, roulette.centerY / 12, roulette.centerY / 12, 0.8 * Math.PI, 0.2 * Math.PI);
    c.lineTo(roulette.centerX, roulette.centerY / 4);
    c.lineTo(roulette.centerX, roulette.centerY / 4);

    if (isMoving) {
        c.fillStyle = '#f1c40f';
    }
    else {
        c.fillStyle = '#1abc9c';
    }

    c.fill();
    c.restore();
}

function filterExistingAwards(awardsArr) {
    return awardsArr.filter(function (data) {
        if (data.restantes > 0 || isNaN(data.restantes)) {
            return data;
        }
    });
}

function getDefaultJSON() {
    return JSON.parse(localStorage.getItem('defaultJSON'));
}

function getDefaultAwards() {
    return getDefaultJSON()[0].Awards;
}

function getLocalJSON() {
    if (localStorage.getItem('localJSON') === null) {
        localStorage.setItem('localJSON', localStorage.getItem('defaultJSON'));
    }
    return JSON.parse(localStorage.getItem('localJSON'));
}

function getAwards() {
    return getLocalJSON()[0].Awards;
}

function getRemainingAwards() {
    return filterExistingAwards(getAwards());
}

function getRemainingAwardsCount() {
    return getRemainingAwards().length;
}

function keyDownTextField(e) {
    var keyCode = e.keyCode;
    if (keyCode == 13) {
        startSpin();
    }
}

function startSpin() {
    // $(".non-semantic-protector").addClass("hidden").removeClass("fade-in");
    // $("#message").text("");
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
        // Swings the pin
        $(".pin").addClass('swing');
        // Disable the spin button so can't click again while wheel is spinning.
        $('#btnSpin').addClass('disabled');
        // Begin the spin animation by calling startAnimation on the wheel object.
        roulette.startAnimation();
        // Set to true so that power can't be changed and spin button re-enabled during
        // the current animation. The user will have to reset before spinning again.
        wheelSpinning = true;
    }
}

function resetSpin() {
    var award = roulette.getIndicatedSegment();
    // $(".non-semantic-protector").removeClass("hidden").addClass("fade-in");
    // if (isNaN(award.cantidad)) {
    //     $("#message").text(award.text);
    // }
    // else {
    //     $("#message").text("Usted ha ganado " + award.text + "!");
    // }
    //
    jsonOperations();
    //
    $(".pin").removeClass('swing');
    $('#btnSpin').removeClass('disabled');
    //
    roulette.stopAnimation(false);
    roulette.rotationAngle = roulette.getRotationPosition();
    roulette.draw();
    drawPointer();
    wheelSpinning = false;
    //
    fillTable($('#awardsTable'));
}

function jsonOperations() {
    var winningSegment = roulette.getIndicatedSegment();
    var localJSON = getLocalJSON();
    localJSON[0].Awards.filter(function (data, idx) {
        if (data.id == winningSegment.id) {
            if (!isNaN(data.cantidad)) {
                if (data.restantes >= 1) {
                    data.restantes -= 1;
                    localJSON[0].Awards.splice(idx, 1, data);
                    // Save local json
                    localStorage.setItem('localJSON', JSON.stringify(localJSON));
                    if (data.restantes == 0) {
                        location.reload();
                    }
                }
            }
        }
    });
}

function fillTable(table) {
    var awards = (table[0].id.startsWith("config") ? getDefaultAwards() : getAwards())
    table.children().remove();
    table.append("<thead class='thead-amadita'><tr>" + (table[0].id.startsWith("config") ? "<th>Premio</th><th>Cantidad</th>" : "<th>Premio</th><th>Restante</th>") + "</tr></thead>");
    table.append('<tbody></tbody>');
    awards.forEach(function (element) {
        table.find('tbody').append(
            "<tr id=" + element.id + ">" +
            "   <td>" + element.text + "</td>" +
            "   <td class='d-flex justify-content-between' style='width: 0;'>" +
            "   <button class='btn btn-danger btn-sm' name='minus' onclick='tableOperations(this)' " + (table[0].id.startsWith("config") ? (isNaN(element.cantidad) ? "disabled='disabled'" : "") : (isNaN(element.restantes) ? "disabled='disabled'" : "")) + " >" +
            "       <i class='icon-minus'></i>" +
            "   </button>" +
            "   <input type='text' onkeyup='tableOperations(this)' value='" + (table[0].id.startsWith("config") ? element.cantidad : element.restantes) + "' style='width: 40px; text-align: center;'/>" +
            "   <button class='btn btn-success btn-sm' name='plus' onclick='tableOperations(this)'>" +
            "       <i class='icon-plus'></i>" +
            "   </button>" +
            "   </td>" +
            "</tr>");
    });
}

function tableOperations(element) {
    var _element = $(element);
    var table = $(_element.closest('table'));
    var segmentId = eval(_element.closest('tr').attr('id'));
    var json = (table[0].id.startsWith("config") ? getDefaultJSON() : getLocalJSON())

    if (_element[0].tagName === 'INPUT') {
        var inputValue = (!isNaN(_element.val()) || _element.val() === '!') ? _element.val() : 0;

        getDefaultAwards().filter(function (data, idx) {
            if (data.id == segmentId) {
                //Json Ops
                if (table[0].id.startsWith("config")) {
                    data.cantidad = inputValue;
                    data.restantes = inputValue;
                } else {
                    data.restantes = inputValue;
                }
                json[0].Awards.splice(idx, 1, data);
                //
            }
        });
    } else {
        var operation = _element.attr('name');
        var input = $(_element.siblings('input')[0]);
        var inputValue = input.val() === '' ? 0 : input.val();

        getDefaultAwards().filter(function (data, idx) {
            if (data.id == segmentId) {
                var newValue = 0;

                if (!isNaN(inputValue) && inputValue >= 0) {
                    inputValue = eval(inputValue);
                    if (operation === 'plus') {
                        newValue = inputValue + 1;
                    } else if (operation === 'minus') {
                        if (inputValue == 0) {
                            newValue = '!';
                            _element.attr('disabled', 'disabled');
                        } else {
                            newValue = inputValue - 1;
                        }
                    }
                } else if (isNaN(inputValue) && operation === 'plus') {
                    _element.siblings('[name=minus]').removeAttr('disabled');
                }

                input.val(newValue);

                //Json Ops
                if (table[0].id.startsWith("config")) {
                    data.cantidad = newValue;
                    data.restantes = newValue;
                } else {
                    data.restantes = newValue;
                }
                json[0].Awards.splice(idx, 1, data);
                //
            }
        });
    }

    if (table[0].id.startsWith("config")) {
        localStorage.setItem('defaultJSON', JSON.stringify(json));
    }
    localStorage.setItem('localJSON', JSON.stringify(json));
}