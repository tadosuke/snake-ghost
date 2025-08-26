# TDD Plan: Implement Food Feature

## Phase 1: Create Food Entity Foundation (Red → Green → Refactor)

### 1.1 Food Entity Basic Structure

**RED:** Write failing test for Food class creation

- Create `__tests__/entities/Food.test.ts`
- Test: Food instance creation with position coordinates
- **Expected failure:** Food class doesn't exist

**GREEN:** Create minimal Food class

- Create `src/entities/Food.ts`
- Basic Food class with constructor accepting x, y coordinates
- Implement `getPosition()` method

**REFACTOR:** Clean up and ensure consistent with Snake.ts patterns
**COMMIT:** `test: Add Food entity basic structure`

### 1.2 Food Position Management

**RED:** Write failing tests for position operations

- Test: `getPosition()` returns correct coordinates
- Test: `setPosition()` updates position correctly

**GREEN:** Implement position getter/setter methods
**REFACTOR:** Optimize position handling
**COMMIT:** `feat: Add Food position management`

## Phase 2: Food Generation Logic (Red → Green → Refactor)

### 2.1 Random Food Placement

**RED:** Write failing tests for food generation

- Test: Generate random food position within game boundaries
- Test: Food position is within valid game grid

**GREEN:** Implement `generateRandomPosition(gameWidth, gameHeight)` method
**REFACTOR:** Ensure clean random generation logic
**COMMIT:** `feat: Add random food generation`

### 2.2 Collision Avoidance

**RED:** Write failing tests for snake collision avoidance

- Test: Food doesn't generate on snake body positions
- Test: Food regenerates if initial position conflicts with snake

**GREEN:** Add `isValidPosition(snakeBody)` and collision checking
**REFACTOR:** Optimize collision detection logic
**COMMIT:** `feat: Add food-snake collision avoidance`

## Phase 3: Food-Snake Interaction (Red → Green → Refactor)

### 3.1 Food Consumption Detection

**RED:** Write failing tests for consumption logic

- Test: Detect when snake head position matches food position
- Test: `isConsumedBy(snake)` method returns boolean correctly

**GREEN:** Implement consumption detection logic
**REFACTOR:** Clean up collision detection
**COMMIT:** `feat: Add food consumption detection`

### 3.2 Food Respawn System

**RED:** Write failing tests for respawn mechanics

- Test: Food generates new position after consumption
- Test: New position avoids snake body

**GREEN:** Implement `respawn()` method with collision avoidance
**REFACTOR:** Ensure efficient respawn logic
**COMMIT:** `feat: Add food respawn system`

## Phase 4: Game Integration (Red → Green → Refactor)

### 4.1 Game Class Food Management

**RED:** Write failing tests for Game class food integration

- Update `__tests__/Game.test.ts` (create if needed)
- Test: Game creates food instance
- Test: Game renders food on canvas

**GREEN:** Add food property to Game class, basic rendering
**REFACTOR:** Clean up Game class food integration
**COMMIT:** `feat: Integrate food into Game class`

### 4.2 Snake-Food Interaction in Game Loop

**RED:** Write failing tests for game loop integration

- Test: Snake grows when eating food
- Test: Food respawns after being eaten
- Test: Game continues running after food consumption

**GREEN:** Add food collision checking to game update loop

- Connect snake.eat() to food consumption
- Trigger food respawn after consumption

**REFACTOR:** Optimize game loop performance
**COMMIT:** `feat: Add food consumption to game loop`

## Phase 5: Visual Enhancement (Red → Green → Refactor)

### 5.1 Food Rendering

**RED:** Write failing tests for food visualization

- Test: Food renders at correct position
- Test: Food has appropriate color/style

**GREEN:** Implement food rendering in Game.renderFood()
**REFACTOR:** Ensure consistent with snake rendering style
**COMMIT:** `feat: Add food visual rendering`

## Phase 6: Final Integration & Testing

### 6.1 End-to-End Testing

**RED:** Write integration tests

- Test complete food lifecycle (spawn → consume → respawn)
- Test game state remains consistent

**GREEN:** Fix any integration issues
**REFACTOR:** Final code cleanup and optimization
**COMMIT:** `feat: Complete food system integration`

## TDD Quality Gates (Check after each cycle)

- [ ] Test written first and fails (Red)
- [ ] Minimal code written to pass test (Green)
- [ ] Code refactored while maintaining passing tests (Refactor)
- [ ] Changes committed with clear message
- [ ] All existing tests still pass
- [ ] Code follows existing project patterns

## Commands to use:

- `npm test` - Run all tests
- `npm format` - Format code
- `git add . && git commit -m "[message]"` - Commit changes

## Files to be created/modified:

- **New:** `src/entities/Food.ts`
- **New:** `__tests__/entities/Food.test.ts`
- **Modified:** `src/main.ts` (Game class)
- **Modified:** `src/types/types.ts` (if needed for Food types)
- **Potentially Modified:** `__tests__/Game.test.ts`
