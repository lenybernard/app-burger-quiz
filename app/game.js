const path = require('path');

module.exports = function (io) {
    const Team = require(path.join(global.__basedir, 'app/models/team'));
    const Transition = require(path.join(global.__basedir, 'app/models/transition'));
    const messages = require(path.join(global.__basedir, 'config/messages-socket'));

    var buzzHits = [];
    var transitionsList = [];
    var currentTransition = -1;

    const teamMayo = new Team('mayo');
    const teamKetchup = new Team('ketchup');
    /**
     * Etat du buzzer
     */
    var buzzerIsLock = true;

    const initGameSocket = function () {
        /**
         * Init Socket
         */
        io.on(messages.messageConnection, function (socket) {
            /**
             *  Se produit lors d'une déconnexion utilisateur
             */
            socket.on(messages.messageDisconnected, function () { });
            /**
             *  On emet dès que le client se connecte et demande l'info des points
             */
            socket.on(messages.messageClientsNeedPointsInformations, function () {
                io.emit(messages.messageToClientReceivePoints, teamMayo.points, teamKetchup.points);
            });
            socket.on(messages.messageClientNeedStateBuzzer, function () {
                io.emit(messages.messageToClientReceiveStateBuzzer, buzzerIsLock);
            });
            /**
             *  Manage les points de la team mayo
             */
            socket.on(messages.messageMayoTeam, function (message) {
                receiveOrderModifyPoints(message, messages.messageToClientMayo, teamMayo);
            });
            /**
             *  Manage les points de la team ketchup
             */
            socket.on(messages.messageKetchupTeam, function (message) {
                receiveOrderModifyPoints(message, messages.messageToClientKetchup, teamKetchup);
            });
            /**
             * Se charge de bloquer les buzzers 
             */
            socket.on(messages.messageLockBuzz, function () {
                buzzerIsLock = true;
                io.emit(messages.messageToClientLockBuzz)
            });
            /**
             * Se charge de débloquer les buzzers 
             */
            socket.on(messages.messageUnLockBuzz, function () {
                buzzerIsLock = false;
                io.emit(messages.messageToClientUnLockBuzz)
            });
            /**
             * Recharge la partie
             */
            socket.on(messages.messageReloadPart, function () {
                buzzerIsLock = true;
                teamMayo.points = 0;
                teamKetchup.points = 0;
                currentTransition = -1;
                buzzHits = []
                initTransitionList();
                io.emit(messages.messageToClientReloadPart);
                io.emit(messages.messageToClientReceiveStateBuzzer, buzzerIsLock);
                io.emit(messages.messageToClientReceiveBuzzHits, buzzHits);
                io.emit(messages.messageToClientNextTransitionLabel, transitionsList[1].label);
            });
            socket.on(messages.messageResetBuzzer, function () {
                buzzerIsLock = true;
                buzzHits = []
                io.emit(messages.messageToClientReceiveBuzzHits, []);
            });
            /**
             * Se produit lorsqu'un client buzz
             */
            socket.on(messages.messageClientSendBuzz, function (teamName) {
                if (buzzerIsLock)
                    return;
                buzzHits.push(teamName)
                io.emit(messages.messageToClientReceiveBuzz, teamName);
                io.emit(messages.messageToClientReceiveBuzzHits, buzzHits);
            });

            /**
             * Se charge d'envoyer la prochaine transition
             */
            socket.on(messages.messageNextTransition, function () {
                currentTransition++
                var nextTransition = transitionsList[currentTransition];
                if (!nextTransition) {
                    io.emit(messages.messageToClientNextTransitionLabel, null);
                    return;
                }
                io.emit(messages.messageToClientNextTransition, nextTransition.filename);
                nextTransition = transitionsList[currentTransition+1]
                if (!nextTransition) {
                    io.emit(messages.messageToClientNextTransitionLabel, null);
                    return
                }
                io.emit(messages.messageToClientNextTransitionLabel, nextTransition.label);
            });

            /**
             * Se charge d'envoyer la précédente transition
             */
            socket.on(messages.messagePrevTransition, function () {

                currentTransition--
                var prevTransition = transitionsList[currentTransition];

                var nextTransition = transitionsList[currentTransition+1]
                if (!nextTransition) return
                io.emit(messages.messageToClientNextTransitionLabel, nextTransition.label);
            });
            socket.on(messages.messageClientNeedNextTransitionLabel, function () {
                var nextTransition = transitionsList[currentTransition + 1];
                io.emit(messages.messageToClientNextTransitionLabel, nextTransition ? nextTransition.label : null);
            });
            socket.on(messages.messageClientNeedBuzzHits, function () {
                io.emit(messages.messageToClientReceiveBuzzHits, buzzHits);
            });

            /**
             * Se charge d'envoyer un message indiquant que l'équipe
             * A mal répondu à la question
             */
            socket.on(messages.messageBuzzBadResponse, function () {
                io.emit(messages.messageToClientReceiveBadResponse);
            });
            socket.on(messages.messageBuzzGoodResponse, function () {
                io.emit(messages.messageToClientReceiveGoodResponse);
            });
            socket.on(messages.messageSuspense, function () {
                io.emit(messages.messageToClientReceiveSuspense);
            });
            socket.on(messages.messageYeah, function () {
                io.emit(messages.messageToClientReceiveYeah);
            });

            /**
             * Se charge d'ajouter ou de retirer des points
             * Pour une équipe
             */
            const receiveOrderModifyPoints = function (messageReceive, messageForClient, team) {
                if (messageReceive === messages.messageAdd) {
                    team.incrementPoints();
                } else {
                    team.decrementPoints()
                }
                io.emit(messageForClient, team.points);
            }
        });
    }

    /**
     * Se charge d'initialiser les transitions
     */
    const initTransitionList = function () {
        transitionsList = [];
        transitionsList.push(new Transition('nuggets-transition.mp4', 'Nuggets', 1));
        transitionsList.push(new Transition('selt-pepper-transition.mp4', "Sel ou Poivre", 2));
        transitionsList.push(new Transition('menus-transition.mp4', "Les menus", 3));
        transitionsList.push(new Transition('addition-transition.mp4', "L'addition", 4));
        transitionsList.push(new Transition('death-burger-transition.mp4', "Burger de la mort", 5));
        // Tri sur la propriété ordre de manière asc
        transitionsList.sort(function (a, b) {
            return a.order - b.order;
        });
    }

    // Init de la socket
    initGameSocket();

    // On initialise la liste dès le début
    initTransitionList();
}
