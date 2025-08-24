# Snake Class Test List (TDD)

## Completed Tests ✅

- [x] Snake initializes with starting position (x, y)
- [x] Snake starts with initial length of 3 segments
- [x] Snake has default direction of "right"

## Remaining Test Cases

### Basic Initialization

- [x] Snake body contains correct number of segments
- [x] First segment is the head at starting position
- [x] Body segments are positioned correctly behind head

### Property Access

- [x] Can get snake body length
- [x] Can get current direction
- [x] Can get all body segments
- [x] Can check if position is part of snake body

### Movement Tests

- [x] Snake moves right correctly
- [x] Snake moves left correctly
- [x] Snake moves up correctly
- [x] Snake moves down correctly
- [x] Snake cannot reverse direction immediately (right to left)
- [x] Snake cannot reverse direction immediately (left to right)
- [x] Snake cannot reverse direction immediately (up to down)
- [x] Snake cannot reverse direction immediately (down to up)
- [x] Snake head position updates correctly after movement
- [ ] Snake body follows head when moving

### Direction Management

- [ ] Can set new direction
- [ ] Direction change takes effect on next move
- [ ] Invalid direction changes are ignored
- [ ] Can get current direction vector

### Growth Tests

- [ ] Snake grows when eating food
- [ ] New segment added to tail when growing
- [ ] Snake length increases by 1 when growing
- [ ] Growth works correctly in all directions
- [ ] Multiple consecutive growths work correctly

### Collision Detection Tests

- [ ] Snake detects self-collision with body
- [ ] Snake detects boundary collision (walls)
- [ ] Snake head can touch boundary without collision
- [ ] Snake detects collision at specific coordinates
- [ ] No false positive collisions

### Edge Cases

- [ ] Snake with minimum length (1 segment)
- [ ] Multiple direction changes in sequence
- [ ] Growth at different positions
- [ ] Snake behavior at boundaries
- [ ] Snake behavior when body is at maximum length

### Reset/Restart Tests

- [ ] Snake can reset to initial state
- [ ] Reset preserves starting position
- [ ] Reset clears growth
- [ ] Reset restores initial direction

## Test Implementation Priority

1. **Basic Initialization** (most important for core functionality)
2. **Property Access** (needed for game logic integration)
3. **Movement Tests** (core gameplay mechanic)
4. **Direction Management** (user input handling)
5. **Growth Tests** (scoring and progression)
6. **Collision Detection** (game over conditions)
7. **Edge Cases** (robustness)
8. **Reset/Restart** (game flow)

## Notes

- Each test should be implemented one at a time following TDD red-green-refactor cycle
- Tests should be independent and not rely on execution order
- Consider adding property-based tests for complex scenarios
- Mock external dependencies when needed
