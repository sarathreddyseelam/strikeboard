# 🏏 StrikeBoard - Cricket Scoring App

A mobile-first, responsive web application for manual cricket scoring. Built with vanilla HTML, CSS, and JavaScript - no backend required!

## ✨ Features

### 🎯 Match Setup
- **Team Configuration**: Set team names and overs per innings
- **Flexible Overs**: Default 20 overs, customizable from 1-50
- **Clean Interface**: Simple, intuitive setup process

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices and tablets
- **Thumb-Friendly**: Large, accessible buttons for easy scoring
- **No Scrolling**: All essential features fit in mobile viewport
- **Touch Optimized**: Enhanced for touch devices

### 🏏 Comprehensive Scoring
- **Runs (0-6)**: Quick button selection for runs scored
- **Extras Support**: 
  - No Ball (+1 run, ball doesn't count unless run out)
  - Wide (+1 run, ball doesn't count unless run out)
  - Bye (runs count, ball counts)
  - Leg Bye (runs count, ball counts)
- **Wicket Tracking**: Mark wickets with optional notes
- **Run Out on Extras**: Special handling for run outs on no balls/wides

### 📊 Real-Time Scoreboard
- **Live Updates**: Current score, wickets, and overs
- **Current Over Display**: Visual ball-by-ball over progress
- **Target Calculation**: Automatic target and required runs for 2nd innings
- **Innings Management**: Automatic switch between innings

### 📝 Score History
- **Ball-by-Ball Log**: Complete history of every delivery
- **Edit & Delete**: Modify or remove any ball entry
- **Auto-Recalculate**: All stats update when history changes
- **Notes Support**: Add descriptive notes for each ball

### 🏆 Match Results
- **Automatic Detection**: Match ends when conditions met
- **Result Display**: Win/loss by runs with margin
- **New Match**: Easy reset for new games

## 🚀 Getting Started

1. **Download Files**: Save all three files in the same directory
   - `index.html`
   - `styles.css`
   - `script.js`

2. **Open App**: Open `index.html` in any modern web browser

3. **Start Scoring**: 
   - Enter team names and overs
   - Click "Start Match"
   - Begin scoring ball by ball!

## 📱 Usage Guide

### Setting Up a Match
1. Enter Team A name (e.g., "India")
2. Enter Team B name (e.g., "Australia")
3. Set overs per innings (default: 20)
4. Click "Start Match"

### Scoring a Ball
1. **Select Runs**: Tap the run button (0-6)
2. **Add Extras** (if any): Choose from dropdown
3. **Mark Wicket** (if applicable): Check the wicket box
4. **Add Notes** (optional): Brief description
5. **Submit**: Click "Submit Ball"

### Managing Score History
- **Edit Ball**: Click ✏️ to modify any ball
- **Delete Ball**: Click 🗑️ to remove any ball
- **Auto-Recalculate**: All stats update automatically

### Understanding the Display
- **Header**: Current batting team, score, overs
- **Current Over**: Visual representation of balls in current over
- **Target Info**: Shows in 2nd innings (target, runs needed, balls left)
- **History**: Scrollable list of all balls with actions

## 🏏 Cricket Rules Implemented

### Over Management
- 6 legal balls = 1 over
- No balls and wides don't count toward over (unless run out)
- Byes and leg byes count as legal deliveries

### Extras Handling
- **No Ball**: +1 run, ball doesn't count (unless run out)
- **Wide**: +1 run, ball doesn't count (unless run out)
- **Bye/Leg Bye**: Runs count, ball counts as legal delivery

### Innings Rules
- **10 Wickets**: Innings ends when all out
- **Overs Complete**: Innings ends when overs limit reached
- **Automatic Switch**: Seamless transition to 2nd innings

### Match End Conditions
- Both innings completed
- Automatic result calculation
- Win/loss by runs margin

## 💾 Data Persistence

- **Local Storage**: Match data saved automatically
- **Session Recovery**: Continue match if browser closed
- **No Backend**: All data stored locally in browser

## 🎨 Design Features

### Mobile-First Approach
- **Responsive Grid**: Adapts to screen size
- **Touch Targets**: Minimum 44px for accessibility
- **Sticky Header**: Score always visible
- **Compact Layout**: All features in viewport

### Visual Design
- **Modern UI**: Clean, professional appearance
- **Color Coding**: 
  - Green: Runs
  - Red: Wickets
  - Orange: Extras
- **Smooth Animations**: Page transitions and interactions
- **Accessibility**: Focus states and keyboard navigation

## 🔧 Technical Details

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **No Dependencies**: Pure vanilla JavaScript

### Performance
- **Lightweight**: No external libraries
- **Fast Loading**: Minimal file sizes
- **Efficient Updates**: Optimized DOM manipulation

### Code Structure
- **Modular Design**: Clean, maintainable code
- **ES6 Classes**: Modern JavaScript patterns
- **Event-Driven**: Responsive user interactions

## 🚀 Future Enhancements

Potential features for future versions:
- **Player Statistics**: Individual batting/bowling stats
- **Match Export**: Save/load match data
- **Multiple Formats**: Test, ODI, T20 support
- **Team Rosters**: Player management
- **Advanced Analytics**: Detailed match analysis

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the app!

---

**Built with ❤️ for cricket enthusiasts everywhere!** 