# Chess Board

A browser-based chess game built with HTML, CSS, and JavaScript. It supports two-player games and games against a computer opponent. This guide explains how to use the game and defines the main terms and code concepts used in the project.

## Project Files

- `index.html` contains the board squares, controls, and script/style references.
- `style.css` controls the board layout, colors, piece appearance, and move highlights.
- `script.js` keeps track of the game, processes input, draws pieces, and chooses computer moves.
- `README.md` is this usage guide and glossary.

## Start the Game

Open `index.html` in a modern browser. The page loads `chess.js` version 0.10.3 from cdnjs, so an internet connection is needed. If the library cannot load, the page displays an error in the status area and gameplay will not start.

## How to Play

1. Choose **Two players**, **Play as White**, or **Play as Black** in the Mode menu.
2. In a computer game, choose **Easy**, **Medium**, or **Hard**. Hard searches more deeply and can take longer to respond.
3. Select one of your pieces. Legal destination squares are highlighted. Select one of those squares to move.
4. If a pawn reaches the far side of the board, choose what piece it promotes to using the Promote to menu.
5. Select **New game** to reset the board. If you play as Black, the computer moves first as White.

You can also use the keyboard: focus a square, move with the arrow keys, and select or move with Enter or Space. In Two players mode, both sides use the same controls.

## Chess Terms

- **Board**: The 8-by-8 playing surface. It contains 64 squares.
- **Square**: One cell on the board. Each square has a file letter and rank number, such as `e4`.
- **File**: A vertical board column, named `a` through `h` from White's left to right.
- **Rank**: A horizontal board row, numbered `1` through `8` from White's side to Black's side.
- **Piece**: One of the six chess units: king, queen, rook, bishop, knight, or pawn. White and Black each start with 16 pieces.
- **Turn**: One player's opportunity to make a move. White moves first, then turns alternate.
- **Move**: Moving one piece from its starting square to a permitted destination. A capture is a move that removes an opposing piece.
- **Legal move**: A move allowed by chess rules that does not leave the moving player's king in check. The `chess.js` library determines which moves are legal.
- **Check**: An attack on a king. The player in check must make a move that removes the attack.
- **Checkmate**: A check that cannot be escaped. The player checkmated loses.
- **Stalemate**: A position where the player to move has no legal moves but is not in check. It is a draw.
- **Draw**: A game that ends without a winner. The rules library recognizes draw conditions such as stalemate, insufficient material, and repetition.
- **Castling**: A special king-and-rook move, allowed only when the relevant squares and king-safety conditions satisfy chess rules.
- **En passant**: A special pawn capture that may be available immediately after an opposing pawn advances two squares past it.
- **Promotion**: When a pawn reaches the farthest rank, it is replaced by a queen, rook, bishop, or knight. This project lets the player choose the piece.

## Computer Opponent Terms

- **Computer opponent**: The system-controlled side in either Play as White or Play as Black mode. It uses `chess.js` for legal moves and the project code to choose among those moves.
- **Difficulty**: Controls the computer's search depth. Easy searches 1 ply, Medium 2 plies, and Hard 3 plies. A **ply** is one move by one side, so a full turn by both players is two plies. Greater depth considers more possible replies, but does not make this a tournament-strength engine.
- **Position evaluation**: A score estimating which side has the advantage. The code counts piece values, gives pawns a bonus for advancing, and gives knights and bishops a bonus for occupying central squares. Scores are calculated from the computer's perspective.
- **Material**: The relative value of pieces on the board. The project uses approximate values: pawn 100, knight 320, bishop 330, rook 500, queen 900, king 0. The king is not assigned a material value because checkmate is handled as a terminal position.
- **Minimax search**: A way to compare future positions. The computer assumes it will choose its best result and the human will choose the best reply for the human side.
- **Alpha-beta pruning**: An optimization for minimax. It stops examining a line of play once it cannot improve the choice already found. It gives the same choice as minimax for the searched positions while often examining fewer moves.
- **Move ordering**: Examining captures before other moves to help alpha-beta pruning find useful choices sooner.
- **Tie-breaking**: If multiple moves have the same best score, the computer selects one of them at random so it does not always make the identical choice.

## HTML Terms

- **HTML**: The language used to describe the content and structure of the page.
- **Element**: A page building block written with tags, such as `<div>`, `<button>`, or `<select>`.
- **Attribute**: Extra information written in an opening tag. For example, `id="game-status"` gives an element a unique identifier.
- **`<head>`**: Holds page information and linked resources, including the character encoding, responsive viewport setting, title, and stylesheet.
- **`<body>`**: Holds the visible controls and board.
- **`<div>`**: A general-purpose container. The project uses it for the controls area and board squares.
- **`<span>`**: An inline container used around a chess-piece symbol so CSS can style the piece separately from its square.
- **`<p>`**: A paragraph element used for the current game status.
- **`<label>`**: Names a form control. Its `for` value matches that control's `id` so the label is associated with it.
- **`<select>` and `<option>`**: A drop-down control and one of its choices. They provide game mode, computer difficulty, and pawn-promotion choices.
- **`<button>`**: A clickable control. `type="button"` makes New game a regular button rather than a form-submission button.
- **`id`**: A unique name for one HTML element. JavaScript uses IDs to find controls, and CSS can use them to style controls.
- **`class`**: A reusable name that can be shared by multiple elements. CSS uses classes for square and piece styles; JavaScript adds classes to show selection and legal moves.
- **`role`**: An accessibility attribute that communicates the purpose of an element to assistive technology. The board uses `grid`, and each square uses `gridcell`.
- **`aria-label`**: An accessible name that describes an element. The script updates each square's label to include its coordinate and piece, or say that it is empty.
- **`aria-live="polite"` and `role="status"`**: Tell screen readers to announce status changes, such as whose turn it is, without interrupting the user.
- **`tabindex`**: Controls keyboard focus. The script uses it to keep one board square in the tab order at a time.
- **`defer`**: A script attribute that lets the browser download a script while reading the HTML, then run it after the document has been parsed. The chess library is listed before `script.js` so the library is ready first.
- **HTML entity**: A text code that represents a character. The starting position uses decimal entities in the Unicode chess-symbol range U+2654 through U+265F. JavaScript later redraws the pieces from those Unicode code points.

## CSS Terms

- **CSS**: The language that controls how HTML elements look and are arranged.
- **Selector**: A pattern that chooses which elements receive a style. `.chess-board` selects the board class; `#game-status` selects the element with that ID.
- **Declaration**: A property and value inside a CSS rule, such as `color: #fff`.
- **Class selector (`.`)**: Selects elements by class name, for example `.square-black`.
- **ID selector (`#`)**: Selects one element by ID, for example `#reset-game`.
- **CSS Grid**: A layout system. The board uses eight equal columns and eight equal rows to arrange its 64 squares.
- **Flexbox**: A layout system used by `.game-controls` to line up controls and wrap them when space is limited.
- **`aspect-ratio: 1`**: Keeps the board square as its width changes.
- **`min()`**: Chooses the smaller of the listed sizes. `width: min(640px, 100vw)` caps the board at 640 pixels while allowing it to fit a narrower viewport.
- **`vw`**: A length unit based on one percent of the browser viewport width.
- **`clamp(min, preferred, max)`**: Keeps a value between a minimum and maximum, with a preferred size between them. The board uses it to scale piece symbols.
- **`rem`**: A length unit based on the root font size.
- **`place-items: center`**: Centers each piece within its square using grid alignment.
- **`outline` and `box-shadow`**: Draw visible emphasis without changing board layout. They show the selected square and legal destinations or captures.
- **`color` and `background-color`**: Set the foreground and square colors. Piece color is styled separately from square color.
- **`user-select: none`**: Prevents accidental text selection when clicking or dragging over board symbols.
- **`-webkit-text-stroke`**: Adds an outline to chess glyphs to improve contrast on both light and dark squares in browsers that support it.
- **`font: inherit`**: Makes controls use the surrounding text font settings.
- **Responsive layout**: A layout that adjusts to the available screen size. The board's bounded width, square aspect ratio, and wrapping controls support narrow windows.

## JavaScript Terms and Project Logic

- **JavaScript**: The programming language that makes the page interactive.
- **DOM (Document Object Model)**: The browser's in-memory representation of the HTML page. JavaScript reads and updates this structure to draw pieces and react to clicks.
- **`document.querySelector()`**: Finds the first element matching a CSS selector, such as `.chess-board` or `#reset-game`.
- **Event listener**: A function that runs when an event occurs. The project listens for square clicks, keyboard input, focus changes, mode changes, and button clicks.
- **Event**: An action reported by the browser, such as `click`, `keydown`, or `change`.
- **Array**: An ordered list. `squares` contains the 64 square elements; the chess library returns lists of legal moves.
- **Object**: A collection of named values. The project uses objects for piece names, piece values, and keyboard directions.
- **Variable**: A named value that the script can use. `selectedSquare`, `selectedMoves`, `humanColor`, and `computerThinking` store the current interaction state.
- **Function**: A reusable block of JavaScript. The functions below divide the game into drawing, input, status, and computer-search tasks.
- **IIFE**: An immediately invoked function expression. The outer `(() => { ... })()` runs once and keeps its variables inside a private scope.
- **Template literal**: A string written with backticks that can include values in `${...}`. The script uses them to create status messages and accessible labels.
- **`const` and `let`**: JavaScript declarations. `const` is used for bindings that are not reassigned; `let` is used for changing game state.
- **`window.setTimeout()`**: Schedules the computer response after a short delay, allowing the status to show that it is thinking.
- **`window.clearTimeout()`**: Cancels a scheduled computer move when a new game starts or the mode changes.
- **Unicode code point**: A number identifying a character. `String.fromCodePoint()` converts the selected chess-piece code point into a visible glyph.
- **`data-square`**: A custom HTML data attribute set by the script. It stores a square coordinate, such as `a8`, on each board element.
- **`aria-selected`**: Updated by the script to communicate which square is selected.
- **`tabIndex`**: A JavaScript property used to manage which square receives keyboard focus.

### Main JavaScript Functions

- **`squareName(index)`**: Converts a square's position in the HTML list into chess notation, such as `a8` or `h1`.
- **`renderBoard()`**: Reads the game position from `chess.js`, clears the previous square contents, and draws each piece with the correct color, symbol, and accessible label.
- **`renderSelection()`**: Removes old highlights and applies classes to the selected square and its legal targets.
- **`updateStatus()`**: Displays whose turn it is, whether the computer is thinking, or whether the game has ended.
- **`selectSquare(square)`**: Handles a player's selection. It chooses a movable piece or performs a selected legal move, then updates the board and may start the computer's turn.
- **`evaluatePosition()`**: Calculates the computer's current score from piece values and simple positional bonuses. Checkmate and draw positions receive special scores.
- **`orderedMoves(moves)`**: Sorts a move list so captures are searched first.
- **`searchPosition(depth, alpha, beta)`**: Searches possible replies recursively using minimax and alpha-beta pruning until the requested depth or a finished game position is reached.
- **`findComputerMove()`**: Tries each legal move for the computer, scores the resulting positions, and returns a highest-scoring move.
- **`playComputerTurn()`**: Checks whether it is the computer's turn, displays the thinking status, then searches for and plays a move.
- **`cancelComputerMove()`**: Clears a pending computer timer and resets the thinking flag.
- **`startNewGame()`**: Resets the rules engine, clears selection state, redraws the starting position, updates the status, and starts the computer if it plays White.

### Important State Values

- **`game`**: The `Chess` instance from `chess.js`. It owns the position, turns, legal moves, captures, special rules, and game-ending checks.
- **`squares`**: The 64 HTML square elements in board order.
- **`selectedSquare`**: The coordinate of the currently selected piece, or `null` when no piece is selected.
- **`selectedMoves`**: The legal moves available from the selected square.
- **`humanColor`**: The human player's color: `w` for White or `b` for Black.
- **`computerThinking`**: A Boolean state that blocks player input while the computer is searching or waiting to move.
- **`computerTimer`**: The ID returned by `setTimeout`, used to cancel a scheduled computer response.
- **`pieceValues`**: The approximate values used by the computer's position evaluation.

## `chess.js` Library Terms

`chess.js` is a JavaScript rules library loaded from cdnjs. The project calls it the **rules engine** because it tracks the current game and validates chess rules; it does not choose the computer's strategy.

- **`new Chess()`**: Creates a game in the standard starting position.
- **`game.board()`**: Returns the current position as rows of pieces and empty squares.
- **`game.get(square)`**: Returns the piece on a coordinate, or no piece if the square is empty.
- **`game.moves(options)`**: Generates legal moves. With `{ square, verbose: true }`, it returns detailed move objects for one selected square.
- **`game.move(options)`**: Applies a legal move, optionally including a promotion choice.
- **`game.undo()`**: Reverses the most recent move. The computer uses this while exploring possible futures.
- **`game.turn()`**: Returns whose turn it is (`w` or `b`).
- **`game.reset()`**: Restores the standard starting position.
- **`game.game_over()`**: Reports whether the game has ended.
- **`game.in_check()`**: Reports whether the side to move is in check.
- **`game.in_checkmate()`**: Reports whether the side to move is checkmated.
- **`game.in_stalemate()`**: Reports whether the position is stalemate.
- **`game.in_draw()`**: Reports other rules-engine draw conditions, including repetition or insufficient material.

## Piece Symbols and Coordinates

The 64 squares are listed in row-major order in the HTML: from `a8` to `h8`, then `a7` to `h7`, down to `a1` to `h1`. The script uses this same order to connect each HTML element to the two-dimensional position returned by `game.board()`.

Chess pieces are displayed with Unicode chess symbols. The code point range used is:

| Side | Pieces in code order |
| --- | --- |
| White | King, Queen, Rook, Bishop, Knight, Pawn (`U+2654` to `U+2659`) |
| Black | King, Queen, Rook, Bishop, Knight, Pawn (`U+265A` to `U+265F`) |

The initial piece arrangement follows standard chess: each side has a rook, knight, bishop, queen, king, bishop, knight, and rook on its back rank, with eight pawns in front. Piece color is shown by the chess symbol and piece CSS class; square background color is controlled independently.

## Limitations

- The computer is a small educational opponent using material and simple positional bonuses; it is not a full-strength chess engine.
- Hard mode searches 3 plies. Search depth is deliberately limited so the browser can respond quickly.
- The chess rules library is loaded from the internet. Offline play requires replacing the CDN script reference in `index.html` with a local copy of the library.
