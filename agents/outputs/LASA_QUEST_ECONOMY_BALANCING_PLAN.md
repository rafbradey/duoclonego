# LASA-Quest: In-Game Economy & Hearts Balancing Implementation Plan

## 1. Executive Summary & Problem Formulation

### The Core Design Conflict
If a learner is permitted to complete a level with 0 lives, but 0 lives results in a **binary lockout from earning diamonds (0 💎)**, the system risks triggering an **Economic Death Spiral (The Poverty Trap)**:
1. **The Poverty Trap**: A struggling student who clears levels with 0 lives never earns diamonds. Because heart refills cost diamonds in the Shop, the student remains trapped at 0 hearts indefinitely.
2. **End-Game Alienation**: A student who perseveres through all 24 levels arrives at the end of the game with 0 diamonds, unable to purchase any of the 15 cosmetic themes or streak freezes, rendering their effort unrewarded.
3. **The Grinding vs. Starvation Dilemma**: If replaying levels awards unlimited diamonds, students farm Level 1 endlessly without learning. If replayed levels award nothing, missed diamonds are lost forever.

### The Architectural Solution: The "Star Bounty" & Dual-Engine Economy
Rather than an all-or-nothing binary reward, the economy implements a **Tiered Star Bounty System** combined with a **Rehabilitative Practice Faucet**. Learning content remains 100% accessible, while meta-rewards (diamonds) scale gracefully with accuracy without ever locking the learner in poverty.

---

## 2. Core Economic Model: The 3-Tier "Star Bounty" System

Each level in the 24-level curriculum carries a **lifetime maximum bounty of 50 Diamonds (💎)**, paid out according to the learner's heart retention:

| Performance Tier | Heart Condition | Level Completion Status | Diamonds Awarded | Lifetime Level Bounty Claimed |
| :--- | :--- | :--- | :--- | :--- |
| ⭐⭐⭐ **3 Stars (Gold)** | Finished with $\ge 3$ hearts | Flawless / High Vigilance | **50 💎** | 100% (50 / 50 💎) |
| ⭐⭐ **2 Stars (Silver)** | Finished with 1–2 hearts | Competent (Minor Slips) | **25 💎** | 50% (25 / 50 💎) |
| ⭐ **1 Star (Bronze)** | Finished with **0 hearts** | Passed with Errors | **10 💎** (Completion Stipend) | 20% (10 / 50 💎) |

### The "Bounty Top-Up" Replay Mechanic (Anti-Grinding)
* **How it works**: When a player completes a level with 1 Star (earning 10 💎), the remaining **40 💎 remain in the level's uncollected bounty pool**.
* **Replay Incentive**: If the student revisits that level later and achieves 3 Stars, they are awarded the difference: $+40$ 💎.
* **Exploitation Safeguard**: Once a level has been completed with 3 Stars (50 / 50 💎 collected), subsequent replays award **0 diamonds** (only maintenance XP). This completely eliminates infinite grinding on easy levels.

---

## 3. Analysis of Cascading Outcomes & Edge Cases

| Scenario / Edge Case | Potential Failure Mode | Built-in Economic & System Safeguard |
| :--- | :--- | :--- |
| **Case 1: The Struggling Student**<br>Student finishes all 24 levels with 0 hearts on every single level. | Student ends the entire game broke, unable to afford any themes, feels punished for persevering. | **Guaranteed Baseline Payout**: 24 levels $\times 10$ 💎 base stipend $= 240$ 💎. Plus 4 Unit Completion bonuses ($4 \times 50$ 💎 $= 200$ 💎). Total minimum earned $= 440$ 💎. The student can purchase at least 1–2 Common themes and streak freezes regardless of errors. |
| **Case 2: The Heart Poverty Trap**<br>Student is at 0 hearts, has 0 diamonds, and needs hearts to earn 3-star diamonds. | Student cannot buy hearts in the shop, so they are locked into 1-star diamond rates forever. | **The Practice Hub Safety Valve**: In the Practice Hub, completing a mistake remediation drill (5 items from `mistakes_queue`) **automatically restores +1 Heart for FREE** and awards $+10$ 💎. Students never need diamonds to recover hearts. |
| **Case 3: The Level 1 Grinder**<br>Student replays Level 1 twenty times to buy the 1,500 💎 Legendary Theme. | Economy hyper-inflation; students bypass higher curriculum levels. | **Capped Level Bounty**: Level 1 can never pay out more than 50 💎 total in a player's lifetime. Repeated runs yield 0 💎 once 3 stars are achieved. |
| **Case 4: The Perfectionist Dropout**<br>Student loses 1 heart on Question 2, realizes they lost 3 stars, and immediately restarts. | Frustration, high restart rate, breaks learning rhythm. | **Immediate Orthographic Value**: Question completion awards XP immediately. Furthermore, 2 Stars still awards 50% of diamonds (25 💎), so there is minimal penalty for 1 slip. |
| **Case 5: The Shop Heart Exploiter**<br>Student stockpiles 5,000 diamonds and buys infinite hearts, ignoring mistakes. | Hearts lose all psychological value. | **Heart Cap Enforcement**: Maximum heart capacity is hard-capped at 5 hearts. A player cannot hold more than 5 hearts at any time. |

---

## 4. Total Inflow & Outflow Balancing (The Token Math)

### Inflows (Total Currency Available in Game)
1. **Curriculum Levels (24 Levels)**:
   - Minimum baseline (all 1-star): $24 \times 10 = 240$ 💎
   - Maximum mastery (all 3-star): $24 \times 50 = 1,200$ 💎
2. **Unit Mastery Capstones (4 Units)**:
   - Flat bonus of $75$ 💎 per completed Capstone: $4 \times 75 = 300$ 💎
3. **Practice Hub Remediation (Formative Practice)**:
   - Clearing 5 queued mistakes: $+10$ 💎 (capped at 50 💎 per day to prevent botting).
4. **Streak Milestones**:
   - 3-day streak: $+20$ 💎
   - 7-day streak: $+50$ 💎

**Total Expected Diamonds Earned by End-Game**:
* Low Accuracy Learner: $\approx 550 - 700$ 💎
* Average Learner: $\approx 1,000 - 1,300$ 💎
* High Mastery Learner: $\approx 1,500 - 1,800$ 💎

### Outflows / Sinks (Where Diamonds are Spent)
1. **Consumables**:
   - Instant Full Heart Refill (+5 Hearts): **30 💎** *(Attainable with 3 practice sessions or one 3-star level)*
   - Streak Freeze (protects missed study day): **50 💎**
2. **Cosmetic Site Themes (15 Themes across 4 Rarity Tiers)**:
   - Common (3 Themes): **150 – 200 💎** *(Affordable by Unit 1-2 even for struggling students)*
   - Rare (4 Themes): **350 – 500 💎** *(Affordable by mid-game)*
   - Epic (4 Themes): **650 – 800 💎** *(Affordable by Unit 4)*
   - Legendary (4 Themes): **1,000 – 1,200 💎** *(Prestige item for dedicated 3-star mastery students)*

---

## 5. Technical Implementation Steps in Codebase

### Step 1: Track Star Ratings and Collected Bounties in `userService.js`
In `DEFAULT_GUEST_PROFILE` and Supabase `public.profiles`:
```javascript
// Add level_stars map: { "u1-l1": 3, "u1-l2": 1, ... }
level_stars: SEED_USER.level_stars || {},
level_bounties_claimed: SEED_USER.level_bounties_claimed || {}
```

### Step 2: Implement Bounty Delta Calculator in `userService.js`
```javascript
export function calculateLevelDiamondReward(levelId, remainingHearts, currentBountiesClaimed) {
    let stars = 1;
    let targetBounty = 10; // 1 Star Base Stipend
    
    if (remainingHearts >= 3) {
        stars = 3;
        targetBounty = 50;
    } else if (remainingHearts >= 1) {
        stars = 2;
        targetBounty = 25;
    }
    
    const alreadyClaimed = currentBountiesClaimed[levelId] || 0;
    const payout = Math.max(0, targetBounty - alreadyClaimed);
    const newClaimed = Math.max(alreadyClaimed, targetBounty);
    
    return { stars, payout, newClaimed };
}
```

### Step 3: Update `LessonCompletion.jsx`
* Render the 1, 2, or 3 Star rating animation.
* Display the diamond breakdown:
  - If 1 Star (0 hearts): Display: `⭐ Level Cleared! +10 💎 Base Stipend (40 💎 uncollected bounty remaining)`
  - If 3 Stars: Display: `⭐⭐⭐ Flawless Dispensing! +50 💎 Max Bounty Collected!`

### Step 4: Ensure Practice Hub Free Heart Restores
In `src/pages/Practice/Practice.jsx`, verify that completing a remediation set calls `restoreHeart(1)` without charging diamonds, keeping the economic safety valve wide open.
