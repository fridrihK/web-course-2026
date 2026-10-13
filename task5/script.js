// ============================================================
// MODEL — хранит состояние игры
// ============================================================
const model = {
    sequence: [],
    playerIndex: 0,
    level: 0,
    isShowing: false,
    isWaiting: false,
    gameOver: false,
    timers: [],

    reset: function () {
        this.clearTimers();
        this.sequence = [];
        this.playerIndex = 0;
        this.level = 0;
        this.isShowing = false;
        this.isWaiting = false;
        this.gameOver = false;
    },

    addStep: function () {
        const randomIndex = Math.floor(Math.random() * 4);
        this.sequence.push(randomIndex);
        this.level = this.sequence.length;
    },

    clearTimers: function () {
        this.timers.forEach(function (id) {
            clearTimeout(id);
        });
        this.timers = [];
    },

    addTimer: function (id) {
        this.timers.push(id);
    }
};

// ============================================================
// VIEW — отрисовывает интерфейс
// ============================================================
const view = {
    board: document.getElementById('board'),
    levelEl: document.getElementById('level'),
    messageEl: document.getElementById('message'),
    startBtn: document.getElementById('start-btn'),
    sectors: document.querySelectorAll('.sector'),

    render: function (model) {
        this.levelEl.textContent = model.level;
    },

    highlight: function (index, duration, callback) {
        const sector = this.sectors[index];
        sector.classList.add('active');
        setTimeout(function () {
            sector.classList.remove('active');
            if (callback) callback();
        }, duration);
    },

    showMessage: function (text) {
        this.messageEl.textContent = text;
    },

    setButtonsDisabled: function (disabled) {
        this.sectors.forEach(function (sector) {
            sector.disabled = disabled;
        });
    }
};

// ============================================================
// CONTROLLER — связывает Model и View
// ============================================================
const controller = {
    SHOW_DURATION: 500,
    PAUSE_DURATION: 250,

    start: function () {
        model.reset();
        view.setButtonsDisabled(true);
        view.showMessage('Запоминайте...');
        view.render(model);

        model.addStep();
        this.showSequence();
    },

    showSequence: function () {
        model.isShowing = true;
        model.isWaiting = false;
        model.playerIndex = 0;

        view.setButtonsDisabled(true);
        view.showMessage('Запоминайте...');

        const self = this;
        let i = 0;

        function showNext() {
            if (i >= model.sequence.length) {
                model.isShowing = false;
                model.isWaiting = true;
                view.setButtonsDisabled(false);
                view.showMessage('Ваш ход');
                return;
            }

            const index = model.sequence[i];
            view.highlight(index, self.SHOW_DURATION, function () {
                i++;
                const timerId = setTimeout(showNext, self.PAUSE_DURATION);
                model.addTimer(timerId);
            });
        }

        const startTimer = setTimeout(showNext, self.PAUSE_DURATION);
        model.addTimer(startTimer);
    },

    handleClick: function (index) {
        if (!model.isWaiting || model.isShowing || model.gameOver) {
            return;
        }

        view.highlight(index, 200);

        if (index === model.sequence[model.playerIndex]) {
            model.playerIndex++;

            if (model.playerIndex === model.sequence.length) {
                model.isWaiting = false;
                view.showMessage('Верно!');
                const self = this;
                const timerId = setTimeout(function () {
                    self.nextRound();
                }, 800);
                model.addTimer(timerId);
            }
        } else {
            this.endGame();
        }
    },

    nextRound: function () {
        model.addStep();
        view.render(model);
        this.showSequence();
    },

    endGame: function () {
        model.gameOver = true;
        model.isWaiting = false;
        model.clearTimers();
        view.setButtonsDisabled(true);
        view.showMessage('Вы дошли до уровня ' + model.level);
    }
};

// ============================================================
// ПРИВЯЗКА СОБЫТИЙ
// ============================================================
view.startBtn.addEventListener('click', function () {
    controller.start();
});

view.sectors.forEach(function (sector) {
    sector.addEventListener('click', function () {
        const index = Number(sector.getAttribute('data-index'));
        controller.handleClick(index);
    });
});