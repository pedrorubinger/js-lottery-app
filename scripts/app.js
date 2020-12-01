'use strict';

const App = () => {
    const database = {
        games: [],
        currentGame: new Set(),
        winningNumbers: new Set()
    };

    let lastId = 0;
    const formEl = document.querySelector('form#insert-result-form');
    const inputEl = document.querySelector('input#input-winning-numbers');
    const boardEl = document.querySelector('section#numbers-board');
    const gamesEl = document.querySelector('section#games');
    const resultEl = document.querySelector('div#games-result');
    const clearBtn = document.querySelector('button#clear-game-button');
    const completeBtn = document.querySelector('button#complete-game-button');
    const saveBtn = document.querySelector('button#save-game-button');
    const randomBtn = document.querySelector('span#random-button');
    const appUtils = new AppUtils({
        database,
        boardEl,
        gamesEl,
        resultEl,
        inputEl
    });

    const appEvents = new AppEvents({
        lastId,
        database,
        inputEl,
        gamesEl,
        resultEl,
        boardEl,
        appUtils
    });

    this.init = () => {
        appUtils.setNumbersCard();
        initEvents();
        appUtils.setInitialMessages('Você ainda não fez uma aposta.');
    };

    this.initEvents = () => {
        formEl.addEventListener('submit', appEvents.handleWinningNumbers, false);
        clearBtn.addEventListener('click', appEvents.handleClearCardNumbers, false);
        completeBtn.addEventListener('click', appEvents.handleCompleteGame, false);
        saveBtn.addEventListener('click', appEvents.handleSaveGame, false);
        randomBtn.addEventListener('click', appEvents.handleGenerateResult, false);
        Array.prototype.forEach.call(boardEl.children, (el) => 
            el.addEventListener('click', appEvents.handleCardNumber, false));
    };

    init();
};

App();