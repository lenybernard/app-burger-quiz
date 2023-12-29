module.exports = Object.freeze({
    /**
     * Messages de base de socket.io
     */
    messageConnection: 'connection',
    messageDisconnected: 'disconnect',
    /**
     * Message de la télécommand admin
     * Pour intérargir avec le jeu
     */
    messageAdd: 'add',
    messageReloadPart: 'event-reload-part',
    messageResetBuzzer: 'event-reset-buzzer',
    messageMayoTeam: 'event-point-mayo',
    messageKetchupTeam: 'event-point-ketchup',
    messageLockBuzz: 'event-lock-buzz',
    messageUnLockBuzz: 'event-unlock-buzz',
    messagePrevTransition: 'event-prev-transition',
    messageNextTransition: 'event-next-transition',
    messageBuzzBadResponse :'event-bad-response',
    messageBuzzGoodResponse :'event-good-response',
    messageSuspense :'event-suspense',
    messageYeah :'event-yeah',
    /**
     * Les messages que les clients envoies
     */
    messageClientSendBuzz: 'on-buzz',
    messageClientsNeedPointsInformations: 'need-information-points',
    messageClientNeedStateBuzzer: 'need-state-buzzer',
    messageClientNeedNextTransitionLabel: 'need-next-transition-label',
    messageClientNeedBuzzHits: 'need-buzz-hits',
    /**
     * Les messages à envoyer aux clients
     */
    messageToClientReloadPart: 'reload-part',
    messageToClientMayo: 'point-mayo',
    messageToClientKetchup: 'point-ketchup',
    messageToClientReceivePoints: 'receive-points-teams',
    messageToClientReceiveBuzz: 'receive-buzz',
    messageToClientLockBuzz: 'receive-lock-buzz',
    messageToClientUnLockBuzz: 'receive-unlock-buzz',
    messageToClientReceiveStateBuzzer:'receive-state-buzzer',
    messageToClientReceiveBuzzHits: 'receive-buzz-hits',
    messageToClientNextTransition: 'receive-next-transition',
    messageToClientNextTransitionLabel: 'receive-next-transition-label',
    messageToClientPrevTransition: 'receive-prev-transition',
    messageToClientReceiveBadResponse: 'receive-buzz-bad-response',
    messageToClientReceiveGoodResponse: 'receive-buzz-good-response',
    messageToClientReceiveSuspense: 'receive-suspense',
    messageToClientReceiveYeah: 'receive-yeah',
});