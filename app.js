const actionPower = function (max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
};

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 1,
      winner: null,
      battleLog: []
    }
  },
  watch: {
    playerHealth() {
      if (this.playerHealth <= 0 && this.monsterHealth <= 0) {
        this.winner = 'draw'
      } else if (this.playerHealth <= 0) {
        this.winner = 'monster'
      }
    },
    monsterHealth() {
      if (this.playerHealth <= 0 && this.monsterHealth <= 0) {
        this.winner = 'draw'
      } else if (this.monsterHealth <= 0) {
        this.winner = 'player'
      }
    }
  },
  computed: {
    monsterHealthBar() {
      if (this.monsterHealth <= 0) {
        return { width: '0%' };
      } else {
        return { width: this.monsterHealth + '%' };
      }
    },
    playerHealthBar() {
      if (this.playerHealth <= 0) {
        return { width: '0%' };
      } else {
        return { width: this.playerHealth + '%' };
      }
    },
    disableHeal() {
      if (this.currentRound === 0) {
        return true;
      } else if (this.currentRound % 2 !== 0) {
        return true;
      } else {
        return false;
      }
    },
    disableSpecialAttaack() {
      if (this.currentRound === 0) {
        return true;
      } else if (this.currentRound % 3 !== 0) {
        return true;
      } else {
        return false;
      }
    },
    winnerMsg() {
      if (this.winner === 'draw') {
        return "It's a DRAW... disappointing.";
      } else if (this.winner === 'player') {
        return "Massive, YOU WON!";
      } else if (this.winner === 'monster') {
        return "Pathetic, YOU LOSE."
      }
    }
  },
  methods: {
    playerAttack() {
      const playerAttack = actionPower(12, 5);
      this.monsterHealth -= playerAttack;

      const monsterAction = this.monsterAction();

      const playerMove = {
        who: 'player',
        action: 'attack',
        actionPower: playerAttack
      };

      const monsterMove = {
        who: 'monster',
        action: monsterAction.action,
        actionPower: monsterAction.actionPower
      }

      this.setBattleLog(playerMove, monsterMove);

      this.currentRound++;
    },
    playerSpecialAttack() {
      const playerSpecialAttack = actionPower(16, 12);
      this.monsterHealth -= playerSpecialAttack;

      const monsterAction = this.monsterAction();

      const playerMove = {
        who: 'player',
        action: 'special-attack',
        actionPower: playerSpecialAttack
      };

      const monsterMove = {
        who: 'monster',
        action: monsterAction.action,
        actionPower: monsterAction.actionPower
      }

      this.setBattleLog(playerMove, monsterMove);

      this.currentRound++;
    },
    healPlayer() {
      const healPlayer = actionPower(16, 13);

      if (this.playerHealth + healPlayer > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healPlayer;
      }

      const monsterAction = this.monsterAction();

      const playerMove = {
        who: 'player',
        action: 'heal',
        actionPower: healPlayer
      };

      const monsterMove = {
        who: 'monster',
        action: monsterAction.action,
        actionPower: monsterAction.actionPower
      }

      this.setBattleLog(playerMove, monsterMove);

      this.currentRound++;
    },
    monsterAction() {
      const action = actionPower(10, 1);

      if (action <= 7) {
        const monsterAttack = actionPower(16, 7);
        this.playerHealth -= monsterAttack;

        return {
          action: 'attack',
          actionPower: monsterAttack
        }
      } else if (action >= 6 && action <= 8) {
        const monsterHeal = actionPower(10, 10);

        if (this.monsterHealth + monsterHeal > 100) {
          this.monsterHealth = 100;
        } else {
          this.monsterHealth += monsterHeal;
        }

        return {
          action: 'heal',
          actionPower: monsterHeal
        }
      } else if (action >= 9) {
        const monsterSpecialAttack = actionPower(25, 16);
        this.playerHealth -= monsterSpecialAttack;

        return {
          action: 'special-attack',
          actionPower: monsterSpecialAttack
        }
      }
    },
    setBattleLog(playerMove, monsterMove) {
      this.battleLog.unshift({
        player: {
          actionBy: playerMove.who,
          actionType: playerMove.action,
          actionPower: playerMove.actionPower
        },
        monster: {
          actionBy: monsterMove.who,
          actionType: monsterMove.action,
          actionPower: monsterMove.actionPower
        },
        round: this.currentRound
      });
    },
    surrender() {
      this.playerHealth = 0;
    },
    resetGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.battleLog = [];
    }
  }
});

app.mount('#game')