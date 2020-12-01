class AppEvents {
    constructor(props) {
        this.lastId = props.lastId;
        this.database = props.database;
        this.inputEl = props.inputEl;
        this.gamesEl = props.gamesEl;
        this.resultEl = props.resultEl;
        this.boardEl = props.boardEl;
        this.appUtils = props.appUtils;
    };

    handleWinningNumbers = (event) => {
        event.preventDefault();

        return this.appUtils.validateNumbers(this.handleInputKeyPress, 
            this.inputEl.value.match(/\d+/g))
            ? this.appUtils.recalculateScore()
            : false;
    };

    handleInputKeyPress = () => {
        this.inputEl.classList.add('default-border');
        this.inputEl.classList.remove('invalid-border');
        return this.inputEl.removeEventListener('keypress',
            this.handleInputKeyPress, false
        );
    };

    handleCardNumber = (event) => {
        event.preventDefault();
        const className = this.appUtils.addNumberToTheGame(
            event.currentTarget.textContent
        );

        return className === 'picked'
            ? event.currentTarget.className = 'picked-card-number'
            : event.currentTarget.className = 'card-number';
    };

    handleClearCardNumbers = (event) => {
        if(event) event.preventDefault();
    
        Array.from(this.boardEl.children).forEach((el) => 
            el.className = 'card-number'
        );
    
        return this.database.currentGame.clear();
    };

    handleCompleteGame =  (event) => {
        event.preventDefault();
        const { currentGame } = this.database;

        if(currentGame.size === 18) return true;
    
        this.appUtils.generateNumbers(currentGame)
            .forEach(currentGame.add, currentGame);

        return this.appUtils.fillCard();
    };

    handleSaveGame = (event) => {
        event.preventDefault();
    
        if(this.database.currentGame.size < 15)
            return this.appUtils.setAlert(
                'Você deve escolher entre 15 a 18 números!'
            );
        if(this.database.winningNumbers.size === 0) {
            this.appUtils.setInvalidData(this.handleInputKeyPress);
            return this.appUtils.setAlert(
                'Antes de jogar você precisa inserir o resultado!'
            );
        }
    
        return this.appUtils.addGame(
            this.handleDeleteGame,
            this.handleClearCardNumbers,
            ++this.lastId,
        );
    };

    handleGenerateResult = (event) => {
        event.preventDefault();

        this.handleInputKeyPress();
        this.appUtils.setWinningNumbers(this.appUtils.generateNumbers(new Set(), 15));
        return this.appUtils.recalculateScore();
    };

    handleDeleteGame = (scoreEl, game) => (event) => {
        event.preventDefault();
    
        this.gamesEl.removeChild(event.target.parentNode);
        this.resultEl.removeChild(scoreEl);
        this.database.games = this.database.games.filter((item) => 
            item.numbers !== game
        );
    
        if(this.database.games.length < 1) {
            this.lastId = 0;
            this.appUtils.setInitialMessages('Você excluiu todas as suas apostas.');
        }

        return true;
    };
}
