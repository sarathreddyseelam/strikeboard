// Cricket Scoring App - Main JavaScript Logic

class CricketScorer {
    constructor() {
        this.matchData = {
            teamA: '',
            teamB: '',
            oversPerInnings: 20,
            currentInnings: 1,
            firstInningsScore: 0,
            firstInningsWickets: 0,
            currentScore: 0,
            currentWickets: 0,
            currentOver: 0,
            currentBall: 0,
            ballHistory: [],
            isMatchComplete: false
        };
        
        this.selectedRuns = null; // null means no selection made
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeEventListeners();
                this.loadFromStorage();
            });
        } else {
            this.initializeEventListeners();
            this.loadFromStorage();
        }
    }

    initializeEventListeners() {
        console.log('Initializing event listeners...');
        
        // Test if run buttons exist
        const testButtons = document.querySelectorAll('.run-btn');
        console.log('Found run buttons:', testButtons.length);
        testButtons.forEach((btn, index) => {
            console.log(`Button ${index}:`, btn.textContent, btn.dataset.runs);
        });
        
        // Setup page form
        document.getElementById('matchSetupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.startMatch();
        });

        // Ball entry form
        document.getElementById('ballEntryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.submitBall();
        });

        // Run buttons now use inline onclick handlers in HTML

        // Extra type change
        document.getElementById('extraType').addEventListener('change', (e) => {
            this.handleExtraTypeChange(e.target.value);
        });

        // New match button
        document.getElementById('newMatchBtn').addEventListener('click', () => {
            this.resetMatch();
        });

        // Event delegation for history action buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn')) {
                const ballId = parseInt(e.target.dataset.ballId);
                const canEdit = e.target.dataset.canEdit === 'true';
                
                if (!canEdit || e.target.disabled) {
                    return;
                }
                
                if (e.target.classList.contains('edit')) {
                    this.editBall(ballId);
                } else if (e.target.classList.contains('delete')) {
                    this.deleteBall(ballId);
                }
            }
        });
        
        console.log('Event listeners initialized');
    }

    selectRuns(runs, targetElement) {
        console.log('selectRuns called with runs:', runs);
        this.selectedRuns = runs;
        
        // Remove selected class from all buttons
        document.querySelectorAll('.run-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selected class to clicked button
        if (targetElement) {
            targetElement.classList.add('selected');
            console.log('Selected button:', targetElement.textContent);
        }
        
        console.log('selectedRuns set to:', this.selectedRuns);
    }

    handleExtraTypeChange(extraType) {
        // No additional logic needed for no balls and wides
    }

    startMatch() {
        const teamA = document.getElementById('teamA').value.trim();
        const teamB = document.getElementById('teamB').value.trim();
        const overs = parseInt(document.getElementById('overs').value);
        const wideExtra = parseInt(document.getElementById('wideExtra').value);
        const noBallExtra = parseInt(document.getElementById('noBallExtra').value);

        if (!teamA || !teamB) {
            alert('Please enter both team names');
            return;
        }

        // Clear all previous match data
        this.clearAllStorage();

        // Reset match data to initial state
        this.matchData = {
            teamA: teamA,
            teamB: teamB,
            oversPerInnings: overs,
            wideExtra: wideExtra,
            noBallExtra: noBallExtra,
            currentInnings: 1,
            firstInningsScore: 0,
            firstInningsWickets: 0,
            currentScore: 0,
            currentWickets: 0,
            currentOver: 0,
            currentBall: 0,
            ballHistory: [],
            isMatchComplete: false
        };

        // Reset form state
        this.selectedRuns = null;
        this.resetBallForm();

        this.showScoringPage();
        this.updateDisplay();
        this.saveToStorage();
        
        // Scroll to scoring section after a brief delay to ensure page transition
        setTimeout(() => {
            document.getElementById('scoringPage').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }

    showScoringPage() {
        document.getElementById('setupPage').classList.remove('active');
        document.getElementById('scoringPage').classList.add('active');
    }

    showSetupPage() {
        document.getElementById('scoringPage').classList.remove('active');
        document.getElementById('setupPage').classList.add('active');
    }

    submitBall() {
        const runs = this.selectedRuns;
        const extraType = document.getElementById('extraType').value;
        const isWicket = document.getElementById('wicket').checked;
        const notes = document.getElementById('notes').value.trim();

        console.log('Submitting ball with:', { runs, extraType, isWicket, notes });

        // Validation - check if user has made any selection
        if (extraType === 'none' && !isWicket && this.selectedRuns === null) {
            alert('Please select runs, extra, or wicket');
            return;
        }

        // Create ball entry
        const ballEntry = {
            id: Date.now(),
            innings: this.matchData.currentInnings,
            over: this.matchData.currentOver,
            ball: this.matchData.currentBall + 1,
            runs: runs,
            extraType: extraType,
            isWicket: isWicket,
            notes: notes,
            timestamp: new Date().toISOString()
        };

        // Process the ball
        this.processBall(ballEntry);

        // Reset form
        this.resetBallForm();

        // Update display
        this.updateDisplay();
        this.saveToStorage();

        // Check for innings/match end
        this.checkInningsEnd();
        
        // Check for win condition in second innings
        this.checkWinCondition();
    }

    processBall(ballEntry) {
        let runsToAdd = ballEntry.runs || 0; // Handle null case
        let ballsToAdd = 1;
        let wicketsToAdd = 0;

        // Handle extras
        if (ballEntry.extraType !== 'none') {
            switch (ballEntry.extraType) {
                case 'noBall':
                    runsToAdd += this.matchData.noBallExtra; // Use configured extra runs
                    ballsToAdd = 0; // Ball never counts for no ball
                    break;
                case 'wide':
                    runsToAdd += this.matchData.wideExtra; // Use configured extra runs
                    ballsToAdd = 0; // Ball never counts for wide
                    break;
            }
        }

        // Handle wicket
        if (ballEntry.isWicket) {
            wicketsToAdd = 1;
        }

        // Update match data
        this.matchData.currentScore += runsToAdd;
        this.matchData.currentWickets += wicketsToAdd;
        
        if (ballsToAdd > 0) {
            this.matchData.currentBall += ballsToAdd;
            if (this.matchData.currentBall >= 6) {
                this.matchData.currentOver += Math.floor(this.matchData.currentBall / 6);
                this.matchData.currentBall = this.matchData.currentBall % 6;
            }
        }

        // Add to history
        this.matchData.ballHistory.unshift(ballEntry);
    }

    resetBallForm() {
        this.selectedRuns = null; // Reset to no selection
        document.querySelectorAll('.run-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.getElementById('extraType').value = 'none';
        document.getElementById('wicket').checked = false;
        document.getElementById('notes').value = '';
    }

    checkInningsEnd() {
        const isAllOut = this.matchData.currentWickets >= 10;
        const isOversComplete = this.matchData.currentOver >= this.matchData.oversPerInnings;

        if (isAllOut || isOversComplete) {
            if (this.matchData.currentInnings === 1) {
                // End of first innings
                this.matchData.firstInningsScore = this.matchData.currentScore;
                this.matchData.firstInningsWickets = this.matchData.currentWickets;
                this.startSecondInnings();
            } else {
                // End of second innings - match complete
                this.endMatch();
            }
        }
    }

    checkWinCondition() {
        // Only check for win in second innings
        if (this.matchData.currentInnings === 2) {
            const target = this.matchData.firstInningsScore + 1;
            
            // Check if Team B has reached or exceeded the target
            if (this.matchData.currentScore >= target) {
                this.endMatch();
            }
        }
    }

    startSecondInnings() {
        this.matchData.currentInnings = 2;
        this.matchData.currentScore = 0;
        this.matchData.currentWickets = 0;
        this.matchData.currentOver = 0;
        this.matchData.currentBall = 0;
        
        // Show innings break popup with required runs stats
        this.showInningsBreakPopup();
        
        // Clear the current over display when Team B starts batting
        this.clearCurrentOverDisplay();
    }

    endMatch() {
        this.matchData.isMatchComplete = true;
        this.showMatchResult();
    }

    showMatchResult() {
        const teamABatting = this.matchData.currentInnings === 1;
        const teamAScore = teamABatting ? this.matchData.currentScore : this.matchData.firstInningsScore;
        const teamBScore = teamABatting ? this.matchData.firstInningsScore : this.matchData.currentScore;
        const teamAWickets = teamABatting ? this.matchData.currentWickets : this.matchData.firstInningsWickets;
        const teamBWickets = teamABatting ? this.matchData.firstInningsWickets : this.matchData.currentWickets;

        let resultTitle, resultMessage;

        if (teamAScore > teamBScore) {
            resultTitle = `${this.matchData.teamA} Wins!`;
            const margin = teamAScore - teamBScore;
            resultMessage = `${this.matchData.teamA} won by ${margin} runs`;
        } else if (teamBScore > teamAScore) {
            resultTitle = `${this.matchData.teamB} Wins!`;
            const margin = teamBScore - teamAScore;
            const wicketsLeft = 10 - teamBWickets;
            resultMessage = `${this.matchData.teamB} won by ${wicketsLeft} wickets`;
        } else {
            resultTitle = "Match Tied!";
            resultMessage = "Both teams scored the same number of runs";
        }

        document.getElementById('resultTitle').textContent = resultTitle;
        document.getElementById('resultMessage').textContent = resultMessage;
        document.getElementById('resultModal').classList.remove('hidden');
    }

    updateDisplay() {
        // Update header
        const battingTeam = this.matchData.currentInnings === 1 ? this.matchData.teamA : this.matchData.teamB;
        const isTeamA = this.matchData.currentInnings === 1;
        
        // Update team colors
        const header = document.querySelector('.scoreboard-header');
        const inningsTitle = document.getElementById('currentInnings');
        const scoreElement = document.getElementById('totalRuns');
        const targetInfo = document.getElementById('targetInfo');
        
        // Remove existing team classes
        header.classList.remove('team-a', 'team-b');
        inningsTitle.classList.remove('team-a', 'team-b');
        scoreElement.classList.remove('team-a', 'team-b');
        targetInfo.classList.remove('team-a', 'team-b');
        
        // Add appropriate team classes
        if (isTeamA) {
            header.classList.add('team-a');
            inningsTitle.classList.add('team-a');
            scoreElement.classList.add('team-a');
        } else {
            header.classList.add('team-b');
            inningsTitle.classList.add('team-b');
            scoreElement.classList.add('team-b');
            targetInfo.classList.add('team-b');
        }
        
        inningsTitle.textContent = `${battingTeam} Batting`;
        scoreElement.textContent = this.matchData.currentScore;
        document.getElementById('totalWickets').textContent = this.matchData.currentWickets;
        
        const oversDisplay = `${this.matchData.currentOver}.${this.matchData.currentBall}`;
        document.getElementById('currentOvers').textContent = oversDisplay;

        // Update target info for second innings
        if (this.matchData.currentInnings === 2) {
            const target = this.matchData.firstInningsScore + 1;
            const runsNeeded = target - this.matchData.currentScore;
            const ballsLeft = (this.matchData.oversPerInnings - this.matchData.currentOver) * 6 - this.matchData.currentBall;

            document.getElementById('targetScore').textContent = target;
            document.getElementById('runsNeeded').textContent = runsNeeded;
            document.getElementById('ballsLeft').textContent = ballsLeft;
            document.getElementById('targetInfo').classList.remove('hidden');
        } else {
            document.getElementById('targetInfo').classList.add('hidden');
        }

        // Update current over display
        this.updateCurrentOverDisplay();

        // Update score history
        this.updateScoreHistory();
    }

    updateCurrentOverDisplay() {
        const overBallsContainer = document.getElementById('currentOverBalls');
        overBallsContainer.innerHTML = '';

        // Get all balls from current innings and current over (including no balls and wides)
        const currentOverBalls = this.matchData.ballHistory
            .filter(ball => ball.innings === this.matchData.currentInnings && ball.over === this.matchData.currentOver)
            .reverse();

        currentOverBalls.forEach(ball => {
            const ballElement = document.createElement('div');
            ballElement.className = 'ball-indicator';
            
            let ballText;
            let ballClass;

            if (ball.isWicket && ball.extraType !== 'none') {
                // Wicket on extra (e.g., run out on no ball or wide)
                const runs = ball.runs || 0;
                if (runs > 0) {
                    // Runs + Extra + Wicket (e.g., 1 run on no ball with wicket)
                    ballText = ball.extraType === 'noBall' ? `${runs}NB/W` : 
                              ball.extraType === 'wide' ? `${runs}WD/W` : 'W';
                } else {
                    // Just Extra + Wicket (e.g., run out on no ball)
                    ballText = ball.extraType === 'noBall' ? 'W/NB' : 
                              ball.extraType === 'wide' ? 'W/WD' : 'W';
                }
                ballClass = 'wicket';
            } else if (ball.isWicket) {
                ballText = 'W';
                ballClass = 'wicket';
            } else if (ball.extraType !== 'none') {
                const runs = ball.runs || 0;
                if (runs > 0) {
                    ballText = ball.extraType === 'noBall' ? `${runs}NB` : 
                              ball.extraType === 'wide' ? `${runs}WD` : '';
                } else {
                    ballText = ball.extraType === 'noBall' ? 'NB' : 
                              ball.extraType === 'wide' ? 'WD' : '';
                }
                ballClass = 'extra';
            } else {
                ballText = ball.runs.toString();
                ballClass = 'runs';
            }

            ballElement.textContent = ballText;
            ballElement.classList.add(ballClass);
            overBallsContainer.appendChild(ballElement);
        });

        // Add empty ball indicators for remaining balls in the over
        const legalBallsInOver = currentOverBalls.filter(ball => {
            // Count legal balls (not no balls or wides)
            if (ball.extraType === 'noBall' || ball.extraType === 'wide') {
                return false; // Never count no balls or wides
            }
            return true; // Count all other balls (including wickets)
        }).length;

        const remainingBalls = 6 - legalBallsInOver;
        for (let i = 0; i < remainingBalls; i++) {
            const emptyBall = document.createElement('div');
            emptyBall.className = 'ball-indicator empty';
            emptyBall.textContent = '•';
            overBallsContainer.appendChild(emptyBall);
        }
    }

    clearCurrentOverDisplay() {
        const overBallsContainer = document.getElementById('currentOverBalls');
        overBallsContainer.innerHTML = '';
    }

    showInningsBreakPopup() {
        const target = this.matchData.firstInningsScore + 1;
        const totalOvers = this.matchData.oversPerInnings;
        
        // Create popup content
        const popupContent = `
            <div class="modal-content">
                <h2>🏏 Innings Break</h2>
                <div class="innings-break-stats">
                    <div class="stat-row">
                        <span class="stat-label">${this.matchData.teamA} Score:</span>
                        <span class="stat-value">${this.matchData.firstInningsScore}/${this.matchData.firstInningsWickets}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Target for ${this.matchData.teamB}:</span>
                        <span class="stat-value">${target} runs</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Overs Available:</span>
                        <span class="stat-value">${totalOvers} overs</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Required Run Rate:</span>
                        <span class="stat-value">${(target / totalOvers).toFixed(2)} runs/over</span>
                    </div>
                </div>
                <p class="innings-break-message">${this.matchData.teamB} needs ${target} runs to win</p>
                <button id="startSecondInningsBtn" class="btn-primary">Start Second Innings</button>
            </div>
        `;
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'inningsBreakModal';
        modal.innerHTML = popupContent;
        document.body.appendChild(modal);
        
        // Add event listener to the button
        document.getElementById('startSecondInningsBtn').addEventListener('click', () => {
            this.closeInningsBreakPopup();
        });
        
        // Show modal
        setTimeout(() => {
            modal.classList.remove('hidden');
        }, 100);
    }

    closeInningsBreakPopup() {
        const modal = document.getElementById('inningsBreakModal');
        if (modal) {
            modal.remove();
        }
        this.updateDisplay();
    }

    updateScoreHistory() {
        const historyContainer = document.getElementById('scoreHistory');
        historyContainer.innerHTML = '';

        this.matchData.ballHistory.forEach(ball => {
            const historyEntry = document.createElement('div');
            historyEntry.className = 'history-entry';
            
            const inningsText = ball.innings === 1 ? '1st' : '2nd';
            const overBall = `${inningsText} ${ball.over}.${ball.ball}`;
            const teamClass = ball.innings === 1 ? 'team-a' : 'team-b';
            let details;
            
            if (ball.isWicket) {
                if (ball.extraType !== 'none') {
                    // Wicket on an extra
                    const extraText = ball.extraType === 'noBall' ? 'No Ball' :
                                    ball.extraType === 'wide' ? 'Wide' : '';
                    if (ball.runs > 0) {
                        details = `${extraText} + ${ball.runs} runs + Wicket`;
                    } else {
                        details = `${extraText} + Wicket`;
                    }
                } else {
                    // Normal wicket
                    details = 'Wicket';
                }
            } else if (ball.extraType !== 'none') {
                // Extra without wicket
                const extraText = ball.extraType === 'noBall' ? 'No Ball' :
                                ball.extraType === 'wide' ? 'Wide' : '';
                details = `${extraText} + ${ball.runs} runs`;
            } else {
                // Normal ball
                details = `${ball.runs} runs`;
            }

            if (ball.notes) {
                details += ` (${ball.notes})`;
            }

            // Check if we're in second innings and this is a first innings ball
            const isFirstInningsBall = ball.innings === 1;
            const isSecondInnings = this.matchData.currentInnings === 2;
            const canEdit = !(isSecondInnings && isFirstInningsBall);
            
            historyEntry.innerHTML = `
                <div class="history-info">
                    <div class="history-over ${teamClass}">${overBall}</div>
                    <div class="history-details">${details}</div>
                </div>
                <div class="history-actions">
                    <button class="action-btn edit" data-ball-id="${ball.id}" data-can-edit="${canEdit}" ${!canEdit ? 'disabled' : ''} style="${!canEdit ? 'opacity: 0.3; cursor: not-allowed;' : ''}">✏️</button>
                    <button class="action-btn delete" data-ball-id="${ball.id}" data-can-edit="${canEdit}" ${!canEdit ? 'disabled' : ''} style="${!canEdit ? 'opacity: 0.3; cursor: not-allowed;' : ''}">🗑️</button>
                </div>
            `;
            
            historyContainer.appendChild(historyEntry);
        });
    }

    editBall(ballId) {
        const ball = this.matchData.ballHistory.find(b => b.id === ballId);
        if (!ball) return;

        // Prevent editing first innings balls during second innings
        if (this.matchData.currentInnings === 2 && ball.innings === 1) {
            alert('Cannot edit first innings balls once second innings has started.');
            return;
        }

        // Additional safety check - prevent if button is disabled
        const editButton = event?.target;
        if (editButton && editButton.disabled) {
            return;
        }

        // Remove the ball and recalculate
        this.deleteBall(ballId, false);

        // Pre-fill the form
        this.selectedRuns = ball.runs;
        document.querySelectorAll('.run-btn').forEach(btn => {
            if (parseInt(btn.dataset.runs) === ball.runs) {
                btn.classList.add('selected');
            }
        });

        document.getElementById('extraType').value = ball.extraType;
        document.getElementById('wicket').checked = ball.isWicket;
        document.getElementById('notes').value = ball.notes || '';

        this.handleExtraTypeChange(ball.extraType);
    }

    deleteBall(ballId, updateDisplay = true) {
        const ballIndex = this.matchData.ballHistory.findIndex(b => b.id === ballId);
        if (ballIndex === -1) return;

        const ball = this.matchData.ballHistory[ballIndex];
        
        // Prevent deleting first innings balls during second innings
        if (this.matchData.currentInnings === 2 && ball.innings === 1) {
            alert('Cannot delete first innings balls once second innings has started.');
            return;
        }

        // Additional safety check - prevent if button is disabled
        const deleteButton = event?.target;
        if (deleteButton && deleteButton.disabled) {
            return;
        }
        
        // Remove from history
        this.matchData.ballHistory.splice(ballIndex, 1);

        // Recalculate match state
        this.recalculateMatchState();

        if (updateDisplay) {
            this.updateDisplay();
            this.saveToStorage();
        }
    }

    recalculateMatchState() {
        // Reset current state
        this.matchData.currentScore = 0;
        this.matchData.currentWickets = 0;
        this.matchData.currentOver = 0;
        this.matchData.currentBall = 0;

        // Recalculate first innings data if we're in second innings
        if (this.matchData.currentInnings === 2) {
            this.matchData.firstInningsScore = 0;
            this.matchData.firstInningsWickets = 0;
            
            // Calculate first innings from history
            this.matchData.ballHistory.forEach(ball => {
                if (ball.innings === 1) {
                    let runsToAdd = ball.runs || 0;
                    let wicketsToAdd = 0;

                    if (ball.extraType !== 'none') {
                        switch (ball.extraType) {
                            case 'noBall':
                                runsToAdd += this.matchData.noBallExtra;
                                break;
                            case 'wide':
                                runsToAdd += this.matchData.wideExtra;
                                break;
                        }
                    }

                    if (ball.isWicket) {
                        wicketsToAdd = 1;
                    }

                    this.matchData.firstInningsScore += runsToAdd;
                    this.matchData.firstInningsWickets += wicketsToAdd;
                }
            });
        }

        // Recalculate current innings from history
        this.matchData.ballHistory.forEach(ball => {
            if (ball.innings === this.matchData.currentInnings) {
                let runsToAdd = ball.runs || 0;
                let ballsToAdd = 1;
                let wicketsToAdd = 0;

                if (ball.extraType !== 'none') {
                    switch (ball.extraType) {
                        case 'noBall':
                            runsToAdd += this.matchData.noBallExtra;
                            ballsToAdd = 0; // Ball never counts for no ball
                            break;
                        case 'wide':
                            runsToAdd += this.matchData.wideExtra;
                            ballsToAdd = 0; // Ball never counts for wide
                            break;
                    }
                }

                if (ball.isWicket) {
                    wicketsToAdd = 1;
                }

                this.matchData.currentScore += runsToAdd;
                this.matchData.currentWickets += wicketsToAdd;
                
                if (ballsToAdd > 0) {
                    this.matchData.currentBall += ballsToAdd;
                    if (this.matchData.currentBall >= 6) {
                        this.matchData.currentOver += Math.floor(this.matchData.currentBall / 6);
                        this.matchData.currentBall = this.matchData.currentBall % 6;
                    }
                }
            }
        });
    }

    resetMatch() {
        this.matchData = {
            teamA: '',
            teamB: '',
            oversPerInnings: 20,
            wideExtra: 1,
            noBallExtra: 1,
            currentInnings: 1,
            firstInningsScore: 0,
            firstInningsWickets: 0,
            currentScore: 0,
            currentWickets: 0,
            currentOver: 0,
            currentBall: 0,
            ballHistory: [],
            isMatchComplete: false
        };

        document.getElementById('resultModal').classList.add('hidden');
        this.resetBallForm();
        this.showSetupPage();
        this.clearAllStorage();
    }

    saveToStorage() {
        localStorage.setItem('strikeBoardData', JSON.stringify(this.matchData));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('strikeBoardData');
        if (saved) {
            try {
                this.matchData = JSON.parse(saved);
                if (this.matchData.teamA && this.matchData.teamB) {
                    this.showScoringPage();
                    this.updateDisplay();
                }
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }

    clearStorage() {
        localStorage.removeItem('strikeBoardData');
    }

    clearAllStorage() {
        // Clear strike board data
        localStorage.removeItem('strikeBoardData');
        
        // Clear any other potential cricket-related data
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('strike') || key.includes('cricket') || key.includes('score') || key.includes('match'))) {
                keysToRemove.push(key);
            }
        }
        
        // Remove all cricket-related keys
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        console.log('All previous match data cleared from storage');
    }
}

// Initialize the app
const scorer = new CricketScorer(); 