// Socket node
var socket = io();

const messageAdd = 'add'
const messageRemove = 'remove';
const messageMayoTeam = 'event-point-mayo';
const messageKetchupTeam = 'event-point-ketchup';
const messageReloadPart = 'event-reload-part';
const messageLockBuzz= 'event-lock-buzz';
const messageUnLockBuzz= 'event-unlock-buzz';
const messageNextTransition= 'event-next-transition';
const messageBuzzBadResponse = 'event-bad-response';
const messageBuzzGoodResponse = 'event-good-response';
const messageSuspense = 'event-suspense';
const messageYeah = 'event-yeah';
const messageClientNeedBuzzHits = 'need-buzz-hits';
const messageToClientReceiveBuzzHits = 'receive-buzz-hits';

$buttonAddPointMayo = $('#button-add-point-mayo');
$buttonRemovePointMayo = $('#button-remove-point-mayo');
$buttonAddPointKetchup = $('#button-add-point-ketchup');
$buttonRemovePointKetchup = $('#button-remove-point-ketchup');
$buttonBuzzGoodResponse = $('#button-buzz-good-response');
$buttonBuzzBadResponse = $('#button-buzz-bad-response');
$buttonSuspense = $('#button-suspense');
$buttonYeah = $('#button-yeah');

$buttonLockBuzzer = $('#button-lock-buzz');
$buttonUnLockBuzzer = $('#button-unlock-buzz');
$buttonReloadPart = $('#button-reload-part');

$buttonNextTransition = $('#button-next-transition');

$modalReloadPartWarn = $('#modal-reload-part');
$buzzHitsBar = $('#buzzListDisplay');

var initEvents = function () {
    $buttonAddPointMayo.click(function () {
        socket.emit(messageMayoTeam, messageAdd);
    });
    $buttonRemovePointMayo.click(function () {
        socket.emit(messageMayoTeam, messageRemove);
    });
    $buttonAddPointKetchup.click(function () {
        socket.emit(messageKetchupTeam, messageAdd);
    });
    $buttonRemovePointKetchup.click(function () {
        socket.emit(messageKetchupTeam, messageRemove);
    });
    $buttonReloadPart.click(function () {
        socket.emit(messageReloadPart);
        $modalReloadPartWarn.modal('hide');
    });
    $buttonLockBuzzer.click(function () {
        socket.emit(messageLockBuzz);
    });
    $buttonUnLockBuzzer.click(function () {
        socket.emit(messageUnLockBuzz);
    });
    $buttonNextTransition.click(function(){
        socket.emit(messageNextTransition);
    });
    $buttonBuzzBadResponse.click(function() {
        socket.emit(messageBuzzBadResponse);
    })
    $buttonBuzzGoodResponse.click(function() {
        socket.emit(messageBuzzGoodResponse);
    })
    $buttonSuspense.click(function() {
        socket.emit(messageSuspense);
    })
    $buttonYeah.click(function() {
        socket.emit(messageYeah);
    })
}

const initSocketAndListenEvents = function () {
    socket.on(messageResetBuzzer, function () {
        $buzzHitsBar.empty();
    });
    socket.on(messageToClientReceiveBuzzHits, function (buzzHits) {
        $buzzHitsBar.empty();
        buzzHits.forEach(buzz => {
            const colorClass = buzz === 'team-mayo' ? 'buzz-mayo' : 'buzz-ketchup';
            $buzzHitsBar.append(`<div class="buzz-square ${colorClass}"></div>`);
        });
    });
};

initEvents();
initSocketAndListenEvents();
