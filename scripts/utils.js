class AppUtils {
    constructor(props) {
        this.database = props.database;
        this.boardEl = props.boardEl;
        this.gamesEl = props.gamesEl;
        this.resultEl = props.resultEl;
        this.inputEl = props.inputEl;
    };

    setNumbersCard = () => {
        for(let i = 1; i <= 25; i++)
            this.boardEl.innerHTML += 
                `<div class="card-number"><span>${i}</span></div>`;
    };
    
    setInitialMessages = (message) => {
        const pMessages = Array.from(document.querySelectorAll('p.initial-message'));
    
        return message 
            ? pMessages.forEach((p) => {
                p.classList.add('block');
                p.classList.remove('hide');
                p.textContent = message;
            })
            : pMessages.forEach((p) => {
                p.classList.remove('block');
                p.classList.add('hide');
            });
    };

    recalculateScore = () => {
        if(this.database.games.length < 1) return false;
    
        const p = document.querySelectorAll('p.score');
    
        this.database.games.forEach((game, i) => {
            const sorted = Array.from(game.numbers).sort((a, b) => a - b);
            const score = this.computeScore(
                Array.from(this.database.winningNumbers),
                sorted
            );

            p[i].textContent = '';
            p[i].insertAdjacentHTML('beforeend',
                `O jogo <strong>#${game.id}</strong> teve ${score} acertos`);
        });
    
        return true;
    };

    fillCard = () => {
        return Array.prototype.forEach.call(this.boardEl.children, (el) => {
            if(this.database.currentGame.has(el.children[0].textContent))
                el.className = 'picked-card-number';
        });
    };
    
    addNumberToTheGame = (value) => {
        const { currentGame } = this.database;

        if(currentGame.size < 18 && !currentGame.has(value)) {
            currentGame.add(value);
            return 'picked';
        }

        currentGame.delete(value);
        return 'normal';
    };
    
    setAlert = (message) => {
        const alertEl = document.querySelector('div.alert');

        alertEl.children[0].textContent = message;
        alertEl.classList.add('block');
        window.scrollTo(0, 0);
    
        return setTimeout(() => {
            alertEl.classList.remove('block');
            alertEl.classList.add('hide');
        }, 4000);
    };
    
    generateNumbers = (numbers, size = 15) => {
        while(numbers.size < size) 
            numbers.add((Math.floor(Math.random() * 25) + 1).toString());
    
        return numbers;
    };

    addGame = (deleteGame, clearCard, id, game = this.database.currentGame) => {
        this.setInitialMessages(false);

        const { games, winningNumbers } = this.database;
        const sorted = Array.from(game).sort((a, b) => a - b);
        const score = this.computeScore(Array.from(winningNumbers), sorted);
        const key = Date.now();
    
        this.gamesEl.insertAdjacentHTML('beforeend',
            `<div class="game">
                <span class="game-id"><strong>#${id}</strong></span>
                <span class="game-numbers">${sorted.toString()}</span>
                <span 
                    class="close-button"
                    id="x-${key}" title="Remover aposta"
                >x</span>
            </div>`
        );
    
        this.resultEl.insertAdjacentHTML('beforeend',
            `<p class="score">
                O jogo <strong>#${id}</strong> teve ${score} acertos
            </p>`
        );
    
        document.querySelector(`span#x-${key}`)
            .addEventListener('click', 
                deleteGame(this.resultEl.lastChild, sorted), false
            );
    
        games.push({ id, numbers: sorted });
    
        return clearCard();
    };

    setWinningNumbers = (result) => {
        this.database.winningNumbers = result;
    
        const pWinning = document.querySelector('p#winning-numbers');
    
        this.inputEl.value = '';
        pWinning.textContent = Array.from(this.database.winningNumbers).toString();
        pWinning.classList.add('golden-numbers');
        return this.toggleInputStyle('default-border', 'invalid-border');
    };

    setInvalidData = (handleInputKeyPress) => {
        this.inputEl.addEventListener('keypress', handleInputKeyPress, false);
        this.toggleInputStyle('invalid-border', 'default-border');
        return this.inputEl.focus();
    };

    validateNumbers = (handleInputKeyPress, result) => {
        if(!result || result.length !== 15 || result.some((x) => x < 1 || x > 25)) {
            this.setInvalidData(handleInputKeyPress);
            return false;
        }

        this.setWinningNumbers(new Set(result));
        return true;
    };

    toggleInputStyle = (add, remove) => {
        this.inputEl.classList.add(add);
        return this.inputEl.classList.remove(remove);
    };

    computeScore = (res, game) => game.filter((i) => res.indexOf(i) >= 0).length;
}