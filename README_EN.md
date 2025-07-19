# Tetris Game

A classic Tetris game built with HTML5, CSS3, and JavaScript.

**English Documentation | [中文文档](README.md)**

## 🎮 Game Features

### Core Functionality
- **Classic Tetris Gameplay** - 7 standard tetromino types (I, J, L, O, S, T, Z)
- **Smooth Gaming Experience** - High-performance game loop using requestAnimationFrame
- **Complete Game Mechanics** - Move, rotate, line clearing, and scoring system

### Controls
- **← →** Arrow Keys: Move tetromino left/right
- **↑** Arrow Key: Rotate tetromino
- **↓** Arrow Key: Soft drop (accelerate falling)
- **Spacebar**: Hard drop (instant drop)
- **P Key**: Pause/Resume game

### Game Systems
- **Scoring System**:
  - Single line clear: 100 × level
  - Double line clear: 300 × level
  - Triple line clear: 500 × level
  - Tetris (4 lines): 800 × level
- **Level System**: Level up every 10 lines cleared
- **Speed Increase**: Falling speed increases with each level
- **Next Piece Preview**: Shows the upcoming tetromino

### User Interface
- **Responsive Design** - Adapts to different screen sizes
- **Real-time Information** - Score, level, and lines cleared display
- **Control Instructions** - Built-in control guide
- **Game Controls** - Start/Restart and Pause/Resume buttons

## 🚀 How to Run

1. **Clone the Project**
   ```bash
   git clone https://github.com/QiuWenLL/tetris.git
   cd tetris
   ```

2. **Run the Game**
   - Open `index.html` directly in your browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     ```

3. **Start Playing**
   - Click the "Start Game" button
   - Use keyboard controls to play
   - Enjoy the game!

## 📁 Project Structure

```
tetris/
├── index.html          # Main page
├── css/
│   └── style.css       # Stylesheet
├── js/
│   └── tetris.js       # Game core logic
├── README.md           # Chinese documentation
└── README_EN.md        # English documentation
```

## 🛠️ Tech Stack

- **HTML5** - Page structure
- **CSS3** - Styling and responsive layout
- **JavaScript (ES6+)** - Game logic implementation
- **CSS Grid** - Game board layout
- **requestAnimationFrame** - Game loop optimization

## 🎯 Game Screenshots

[Screenshots can be added here]

## 🔧 Development Features

- **Modular Code Structure** - Clear function separation
- **Performance Optimization** - Efficient rendering and collision detection
- **Error Handling** - Comprehensive boundary checking
- **Code Comments** - Detailed Chinese comments

## 📝 Changelog

### v1.0.0 (2025-07-19)
- ✅ Complete Tetris game implementation
- ✅ Support for all 7 tetromino types
- ✅ Full game mechanics (move, rotate, line clear)
- ✅ Level and scoring systems
- ✅ Responsive user interface
- ✅ Keyboard and button controls
- ✅ Next piece preview
- ✅ Pause/Resume functionality
- ✅ Fixed hard drop duplicate line clearing issue

## 🤝 Contributing

Feel free to submit Issues and Pull Requests to improve this project!

## 📄 License

MIT License

## 👨‍💻 Author

QiuWenLL - [GitHub](https://github.com/QiuWenLL)

---

**Enjoy the game!** 🎮✨
