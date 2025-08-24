# TDD Plan: Snake Integration into Main Game

## Current State Assessment

### Snake.ts Implementation: ✅ COMPLETE
- All core Snake functionality is implemented and thoroughly tested
- 15 comprehensive test cases covering initialization, movement, growth, collision detection, and reset
- Code quality is excellent with clear separation of concerns
- No bugs or missing functionality identified in the Snake class itself

### Missing Integration: 🔄 NEEDS COMPLETION
- The main game (`main.ts`) only renders test graphics
- Snake class is not instantiated or integrated into the game loop
- No keyboard input handling for snake control
- Snake rendering not implemented in main game

## TDD Integration Plan

### Phase 1: Snake Instance Creation (RED-GREEN-REFACTOR)
**Test**: `it('creates snake instance in game')`
- Write failing test for Game class having a Snake instance
- Implement Snake instantiation in Game constructor
- Verify snake is created with proper initial position

### Phase 2: Snake Rendering (RED-GREEN-REFACTOR)
**Test**: `it('renders snake on canvas')`
- Write test to verify snake body segments are drawn
- Replace test graphics with snake rendering logic
- Test that snake head and body are visually distinct

### Phase 3: Basic Movement Integration (RED-GREEN-REFACTOR)
**Test**: `it('snake moves automatically in game loop')`
- Add time-based movement to snake in update loop
- Test that snake moves at consistent intervals
- Verify snake position changes over time

### Phase 4: Input Integration (RED-GREEN-REFACTOR)
**Test**: `it('snake responds to keyboard input')`
- Add keyboard event listeners for arrow keys
- Connect input to snake direction changes
- Test direction changes work correctly

### Phase 5: Boundary Collision Integration (RED-GREEN-REFACTOR)
**Test**: `it('game detects snake boundary collision')`
- Integrate snake boundary collision with game state
- Test game over condition triggers correctly
- Verify game stops when snake hits walls

## TDD Rules to Follow

### Do:
- Write implementation code AFTER tests
- Keep tests simple and focused on one behavior
- Make minimal changes to pass tests
- Run tests frequently
- Commit after each Red-Green-Refactor cycle
- Use descriptive test names that explain behavior
- Follow existing test patterns in codebase

### Don't:
- Write implementation code before tests
- Skip the failing test verification step
- Write multiple features in one cycle
- Refactor while tests are failing
- Make large commits mixing tests and implementation
- Change tests to make implementation easier (unless requirements change)

## Quality Gates

Before moving to next cycle, verify:
- [ ] Test is written and fails (Red)
- [ ] Minimal implementation makes test pass (Green)
- [ ] Code is clean while tests still pass (Refactor)
- [ ] Change is committed with clear message
- [ ] All existing tests still pass
- [ ] Code follows project conventions

## Expected Commits

1. `test: Add snake instance creation in game`
2. `feat: Create snake instance in Game constructor`
3. `test: Add snake rendering to canvas`
4. `feat: Implement snake body rendering`
5. `test: Add automatic snake movement in game loop`
6. `feat: Integrate snake movement with game timing`
7. `test: Add keyboard input handling for snake`
8. `feat: Implement arrow key controls`
9. `test: Add boundary collision detection`
10. `feat: Implement game over on wall collision`

This plan focuses solely on Snake integration without food or complex game state - just getting the snake working in the main game loop with basic controls and collision detection.