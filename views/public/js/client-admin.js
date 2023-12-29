// Socket node
var socket = io();

const messageAdd = 'add'
const messageRemove = 'remove';
const messageMayoTeam = 'event-point-mayo';
const messageKetchupTeam = 'event-point-ketchup';
const messageReloadPart = 'event-reload-part';
const messageResetBuzzer = 'event-reset-buzzer';
const messageLockBuzz= 'event-lock-buzz';
const messageUnLockBuzz= 'event-unlock-buzz';
const messagePrevTransition= 'event-prev-transition';
const messageNextTransition= 'event-next-transition';
const messageToClientNextTransitionLabel = 'receive-next-transition-label';
const messageBuzzBadResponse = 'event-bad-response';
const messageBuzzGoodResponse = 'event-good-response';
const messageSuspense = 'event-suspense';
const messageYeah = 'event-yeah';
const messageClientNeedNextTransitionLabel = 'need-next-transition-label';
const messageClientNeedStateBuzzer = 'need-state-buzzer';
const messageToClientLockBuzz = 'receive-lock-buzz';
const messageToClientUnLockBuzz = 'receive-unlock-buzz';
const messageToClientReceiveStateBuzzer = 'receive-state-buzzer';
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
$buttonResetBuzzer = $('#button-reset-buzz');
$buttonReloadPart = $('#button-reload-part');

$buttonPrevTransition = $('#button-prev-transition');
$buttonNextTransition = $('#button-next-transition');
$buttonNextTransitionLabel = $('#text-next-transition-label');

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
    $buttonResetBuzzer.click(function () {
        socket.emit(messageResetBuzzer);
    });
    $buttonLockBuzzer.click(function () {
        socket.emit(messageLockBuzz);
    });
    $buttonUnLockBuzzer.click(function () {
        socket.emit(messageUnLockBuzz);
    });
    $buttonPrevTransition.click(function(){
        socket.emit(messagePrevTransition);
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

const setNextTransitionLabel = function (nextTransitionLabel) {
    $buttonNextTransitionLabel.html(nextTransitionLabel && `(${nextTransitionLabel})` || '')
}
const updateBuzzerState = function (isLocked) {
    if (isLocked) {
        $buttonLockBuzzer.attr('disabled', true)
        $buttonUnLockBuzzer.attr('disabled', false)

        return
    }

    $buttonLockBuzzer.attr('disabled', false)
    $buttonUnLockBuzzer.attr('disabled', true)
}

const initSocketAndListenEvents = function () {
    /**
     * Affiche le nom de la prochaine transition
     */
    socket.on(messageToClientNextTransitionLabel, function (nextTransitionLabel) {
        setNextTransitionLabel(nextTransitionLabel);
    });
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
    socket.on(messageToClientLockBuzz, function () {
        updateBuzzerState(true)
    })
    socket.on(messageToClientUnLockBuzz, function () {
        updateBuzzerState(false)
    })
    socket.on(messageToClientReceiveStateBuzzer, function (isLocked) {
        updateBuzzerState(isLocked)
    })
    socket.emit(messageClientNeedNextTransitionLabel);
    socket.emit(messageClientNeedStateBuzzer);
    socket.emit(messageClientNeedBuzzHits);
};

initEvents();
initSocketAndListenEvents();
