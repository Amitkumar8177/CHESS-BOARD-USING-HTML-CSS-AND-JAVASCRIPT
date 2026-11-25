(() => {
	const board = document.querySelector(".chess-board");
	const status = document.querySelector("#game-status");
	const resetButton = document.querySelector("#reset-game");
	const modeChoice = document.querySelector("#game-mode");
	const computerLevel = document.querySelector("#computer-level");
	const promotionChoice = document.querySelector("#promotion-choice");
	const squares = Array.from(board.children);
	const files = "abcdefgh";
	const pieceNames = {
		k: "king",
		q: "queen",
		r: "rook",
		b: "bishop",
		n: "knight",
		p: "pawn"
	};

	if (typeof window.Chess !== "function") {
		status.textContent = "Chess rules could not load. Check your internet connection and refresh.";
		return;
	}

	const game = new window.Chess();
	let selectedSquare = null;
	let selectedMoves = [];
	let humanColor = "w";
	let computerThinking = false;
	let computerTimer = null;
	const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

	function squareName(index) {
		return files[index % 8] + (8 - Math.floor(index / 8));
	}

	function renderBoard() {
		const position = game.board();

		squares.forEach((element, index) => {
			const square = squareName(index);
			const piece = position[Math.floor(index / 8)][index % 8];
			element.dataset.square = square;
			element.replaceChildren();

			if (piece) {
				const pieceElement = document.createElement("span");
				const offset = { k: 0, q: 1, r: 2, b: 3, n: 4, p: 5 }[piece.type];
				const codePoint = 0x2654 + offset + (piece.color === "b" ? 6 : 0);
				pieceElement.className = piece.color === "w" ? "piece-white" : "piece-black";
				pieceElement.textContent = String.fromCodePoint(codePoint);
				element.appendChild(pieceElement);
				element.setAttribute("aria-label", `${square}, ${piece.color === "w" ? "white" : "black"} ${pieceNames[piece.type]}`);
			} else {
				element.setAttribute("aria-label", `${square}, empty`);
			}
		});
	}

	function renderSelection() {
		squares.forEach((element) => {
			element.classList.remove("square-selected", "square-legal", "square-capture");
			element.setAttribute("aria-selected", "false");
		});

		if (!selectedSquare) return;

		const selectedElement = squares.find((element) => element.dataset.square === selectedSquare);
		selectedElement.classList.add("square-selected");
		selectedElement.setAttribute("aria-selected", "true");

		selectedMoves.forEach((move) => {
			const target = squares.find((element) => element.dataset.square === move.to);
			target.classList.add(move.flags.includes("c") || move.flags.includes("e") ? "square-capture" : "square-legal");
		});
	}

	function updateStatus() {
		if (game.in_checkmate()) {
			status.textContent = `${game.turn() === "w" ? "Black" : "White"} wins by checkmate.`;
		} else if (game.in_stalemate()) {
			status.textContent = "Draw by stalemate.";
		} else if (game.in_draw()) {
			status.textContent = "Draw.";
		} else {
			const turn = game.turn() === "w" ? "White" : "Black";
			const isComputerTurn = modeChoice.value !== "two-player" && game.turn() !== humanColor;
			status.textContent = computerThinking
				? "Computer is thinking..."
				: `${turn}${isComputerTurn ? " (computer)" : ""} to move${game.in_check() ? " - check" : ""}.`;
		}
	}

	function evaluatePosition() {
		if (game.in_checkmate()) return game.turn() === humanColor ? 100000 : -100000;
		if (game.in_draw()) return 0;

		const computerColor = modeChoice.value === "human-white" ? "b" : "w";
		let score = 0;
		game.board().forEach((rank, row) => {
			rank.forEach((piece, column) => {
				if (!piece) return;

				const center = 3.5 - (Math.abs(3.5 - row) + Math.abs(3.5 - column)) / 2;
				let value = pieceValues[piece.type];
				if (piece.type === "p") value += (piece.color === "w" ? 6 - row : row - 1) * 8;
				if (piece.type === "n" || piece.type === "b") value += center * (piece.type === "n" ? 12 : 6);
				score += (piece.color === computerColor ? 1 : -1) * value;
			});
		});
		return score;
	}

	function orderedMoves(moves) {
		return moves.sort((first, second) => {
			const firstCapture = first.flags.includes("c") || first.flags.includes("e") ? 1 : 0;
			const secondCapture = second.flags.includes("c") || second.flags.includes("e") ? 1 : 0;
			return secondCapture - firstCapture;
		});
	}

	function searchPosition(depth, alpha, beta) {
		if (depth === 0 || game.game_over()) return evaluatePosition();

		const maximizing = game.turn() !== humanColor;
		let bestScore = maximizing ? -Infinity : Infinity;
		const moves = orderedMoves(game.moves({ verbose: true }));
		for (const move of moves) {
			game.move({ from: move.from, to: move.to, promotion: move.promotion });
			const score = searchPosition(depth - 1, alpha, beta);
			game.undo();

			if (maximizing) {
				bestScore = Math.max(bestScore, score);
				alpha = Math.max(alpha, bestScore);
			} else {
				bestScore = Math.min(bestScore, score);
				beta = Math.min(beta, bestScore);
			}
			if (beta <= alpha) break;
		}
		return bestScore;
	}

	function findComputerMove() {
		let bestScore = -Infinity;
		let bestMoves = [];
		const depth = Number(computerLevel.value);
		const moves = orderedMoves(game.moves({ verbose: true }));

		for (const move of moves) {
			game.move({ from: move.from, to: move.to, promotion: move.promotion });
			const score = searchPosition(depth - 1, -Infinity, Infinity);
			game.undo();

			if (score > bestScore) {
				bestScore = score;
				bestMoves = [move];
			} else if (score === bestScore) {
				bestMoves.push(move);
			}
		}
		return bestMoves[Math.floor(Math.random() * bestMoves.length)];
	}

	function cancelComputerMove() {
		if (computerTimer !== null) window.clearTimeout(computerTimer);
		computerTimer = null;
		computerThinking = false;
	}

	function playComputerTurn() {
		if (modeChoice.value === "two-player" || game.turn() === humanColor || game.game_over()) return;

		computerThinking = true;
		updateStatus();
		computerTimer = window.setTimeout(() => {
			computerTimer = null;
			const move = findComputerMove();
			computerThinking = false;
			if (move) game.move({ from: move.from, to: move.to, promotion: move.promotion });
			selectedSquare = null;
			selectedMoves = [];
			renderBoard();
			renderSelection();
			updateStatus();
		}, 180);
	}

	function startNewGame() {
		cancelComputerMove();
		humanColor = modeChoice.value === "human-black" ? "b" : "w";
		game.reset();
		selectedSquare = null;
		selectedMoves = [];
		renderBoard();
		renderSelection();
		updateStatus();
		playComputerTurn();
	}

	function selectSquare(square) {
		if (game.game_over() || computerThinking || (modeChoice.value !== "two-player" && game.turn() !== humanColor)) return;

		const legalMove = selectedMoves.find((move) => move.to === square);
		if (legalMove) {
			const moveOptions = { from: selectedSquare, to: square };
			const movingPiece = game.get(selectedSquare);
			if (movingPiece.type === "p" && (square.endsWith("1") || square.endsWith("8"))) {
				moveOptions.promotion = promotionChoice.value;
			}
			game.move(moveOptions);
			selectedSquare = null;
			selectedMoves = [];
			renderBoard();
			renderSelection();
			updateStatus();
			playComputerTurn();
			return;
		}

		const piece = game.get(square);
		if (piece && piece.color === game.turn()) {
			selectedSquare = square;
			selectedMoves = game.moves({ square, verbose: true });
		} else {
			selectedSquare = null;
			selectedMoves = [];
		}
		renderSelection();
	}

	squares.forEach((element, index) => {
		element.dataset.square = squareName(index);
		element.setAttribute("role", "gridcell");
		element.setAttribute("aria-selected", "false");
		element.tabIndex = index === 0 ? 0 : -1;
		element.addEventListener("click", () => selectSquare(element.dataset.square));
		element.addEventListener("focus", () => {
			squares.forEach((square) => { square.tabIndex = square === element ? 0 : -1; });
		});
		element.addEventListener("keydown", (event) => {
			const directions = {
				ArrowUp: -8,
				ArrowDown: 8,
				ArrowLeft: -1,
				ArrowRight: 1
			};

			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				selectSquare(element.dataset.square);
			} else if (directions[event.key]) {
				event.preventDefault();
				const currentRow = Math.floor(index / 8);
				const currentColumn = index % 8;
				let nextIndex = index + directions[event.key];
				if (event.key === "ArrowLeft" && currentColumn === 0) nextIndex = index;
				if (event.key === "ArrowRight" && currentColumn === 7) nextIndex = index;
				if (nextIndex < 0 || nextIndex > 63) nextIndex = index;
				if (event.key === "ArrowUp" && currentRow === 0) nextIndex = index;
				if (event.key === "ArrowDown" && currentRow === 7) nextIndex = index;
				squares[nextIndex].focus();
			}
		});
	});

	resetButton.addEventListener("click", startNewGame);
	modeChoice.addEventListener("change", startNewGame);

	renderBoard();
	updateStatus();
	playComputerTurn();
})();
