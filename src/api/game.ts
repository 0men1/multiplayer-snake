import { Direction, GameState, Position } from "./types";


export class SnakeGame {
    private state: GameState;
    private readonly boardSize: number;

    constructor(boardSize: number = 20) {
        this.boardSize = boardSize;
        this.state = this.getInitialState();
    }
 
    private getInitialState(): GameState {
        return {
            snake: [{ x: 10, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 10 }],
            food: this.generateFood(),
            direction: Direction.RIGHT,
            score: 0,
            isGameOver: false
        }
    }

    private isPositionOccupied(position: Position): boolean {
        if (this.state) {
            return this.state.snake.some(segment => segment.x === position.x && segment.y === position.y)
        }
        return false
    }

    private generateFood(): Position {
        let newFood: Position;
        do {
            newFood = {
                x: Math.floor(Math.random() * (this.boardSize)),
                y: Math.floor(Math.random() * (this.boardSize))
            }
        } while (this.isPositionOccupied(newFood))

        return newFood;
    }

    update() {
        const head = this.state.snake[0];
        const newHead = { ...head };

        if (this.checkCollision()) {
            this.state.isGameOver = true;
            return;
        }

        switch (this.state.direction) {
            case Direction.UP:
                newHead.y -= 1;
                break;
            case Direction.DOWN:
                newHead.y += 1;
                break;
            case Direction.LEFT:
                newHead.x -= 1;
                break;
            case Direction.RIGHT:
                newHead.x += 1;
                break;
        }

        this.state.snake.unshift(newHead);

        if (this.hasEatenFood(newHead)) {
            this.state.score++;
            this.state.food = this.generateFood();
        } else {
            this.state.snake.pop();
        }
    }


    changeDirection(newDirection: Direction) {
        const opposites = {
            [Direction.UP]: Direction.DOWN,
            [Direction.DOWN]: Direction.UP,
            [Direction.LEFT]: Direction.RIGHT,
            [Direction.RIGHT]: Direction.LEFT
        };
        
        if (opposites[newDirection] !== this.state.direction) {
            this.state.direction = newDirection;
        }
    }


    private hasEatenFood(head: Position): boolean {
        return head.x === this.state.food.x && head.y == this.state.food.y
    }

    private checkCollision(): boolean {
        const head = this.state.snake[0]
        return (head.x < 0 || head.y < 0) || (head.x > this.boardSize - 1 || head.y > this.boardSize - 1)
    }

    getState(): GameState {
        return { ...this.state }
    }

    reset() {
        this.state = this.getInitialState();
    }
}