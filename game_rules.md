# Mafia Game Rules and Flow

This document outlines the rules, roles, and flow for your custom Mafia game. Feel free to review and let me know what you would like to edit or change!

## Roles & Objectives

1. **Mafia**
   - **Team:** Mafia
   - **Objective:** Eliminate the Town (Villagers, Doctor, Detective) until the Mafia numbers equal or exceed the remaining Town members.
   - **Ability:** Wakes up each night to choose one player to eliminate.

2. **Villager**
   - **Team:** Town
   - **Objective:** Find and eliminate all Mafia members.
   - **Ability:** No special abilities. Relies on observation, discussion, and voting during the day.

3. **Doctor**
   - **Team:** Town
   - **Objective:** Find and eliminate all Mafia members.
   - **Ability:** Wakes up each night to choose one player to "save." If the Mafia targets that saved player, the player survives the night. They can save anyone (including themselves) for as many times as they wish.

4. **Detective (or Cop)**
   - **Team:** Town
   - **Objective:** Find and eliminate all Mafia members.
   - **Ability:** Wakes up each night to investigate one player. The system (or moderator) reveals whether that player is "Mafia" or "Not Mafia" (which includes Villager, Doctor, Jester).

5. **Jester**
   - **Team:** Solo / Neutral
   - **Objective:** Trick the Town into voting them out during the Day phase.
   - **Ability:** If the Jester is successfully voted out (lynched) during the day, the Jester wins the game immediately. They can *only* win if they are voted out. If they survive until the end of the game, or are killed by the Mafia at night, they lose.

---

## Game Flow

The game alternates continuously between two phases: **Night** and **Day**.

### 1. The Night Phase (Darkness)
During this phase, no talking is allowed. The special roles take their actions secretly.

- **Step 1: Doctor Wakes Up**
  - The Doctor selects someone to protect.
- **Step 2: Detective Wakes Up**
  - The Detective selects someone to investigate and receives their alignment.
- **Step 3: Mafia Wakes Up**
  - The Mafia selects a target to eliminate. (If there are multiple Mafia members, they must agree on one target).

*(Note: The exact order can be changed, but usually, the Doctor goes before the Mafia so the protection is locked in).*

### 2. The Day Phase (Discussion & Voting)
- **Step 1: Morning Reveal**
  - The system announces who was killed during the night. If the Doctor saved the Mafia's target, the system announces that "No one died last night."
  - Eliminated players can no longer speak or participate.
- **Step 2: Discussion**
  - The surviving players have a set amount of time (e.g., 3-5 minutes) to discuss, share information, or lie. The Detective might reveal their findings, the Jester might act suspicious, and the Mafia will try to blend in.
- **Step 3: Voting**
  - Players vote on who they believe is the Mafia. 
  - The player with the majority of votes is "lynched" (eliminated).
- **Step 4: Role Reveal (Optional)**
  - The lynched player's role is revealed to everyone. 
  - *If it was the Jester, the Jester wins!*

### 3. Ending the Game
The Day and Night cycle repeats until one of the win conditions is met:
- **Town Wins:** All Mafia members are eliminated.
- **Mafia Wins:** The number of Mafia members is equal to or greater than the number of Town members.
- **Jester Wins:** The Jester is eliminated by a daytime vote. (They lose in any other scenario, even if they survive to the end).

---

## Settings & Customization

The game allows hosts/players to modify the experience using two tiers of settings:

### Simple Settings
These settings cover the basic variables of a standard game match:
- **Role Distribution:** Set the number of Mafia, Villagers, Doctors, Detectives, and Jesters.
- **Discussion Time:** Adjust the duration of the Day phase discussion. (Once the discussion time is over, players have infinite time to vote; the phase only ends when everyone has voted).
- **Night Action Time:** Adjust the duration allowed for night actions (e.g., 30 seconds, 60 seconds).
- **Role Reveal on Death:** Toggle whether a player's role is revealed to everyone when they die.

### Advanced Settings
These settings allow you to tweak almost every aspect of the mechanics without changing the core game premise:
- **Night Phase Flow:** Customize the order in which roles wake up (e.g., Doctor -> Detective -> Mafia, or any other sequence).
- **Doctor Heal Rules:** Can the Doctor heal themselves? Can they heal the same person twice in a row? (By default in this ruleset, yes to both).
- **Jester Win Conditions:** Does the game immediately end when the Jester is voted out, or does the game continue while the Jester secures a solo win? 
- **Detective Investigation Pool:** Does the Detective only see "Mafia / Not Mafia" or do they get exact roles?
- **Anonymous Voting:** Are Day phase votes public or hidden?
- **Ties:** What happens if there's a tie during the Day vote? (By default, nothing happens and no one is voted out, but this can be changed to random death, coin flip, etc.).
- **Skip Day Vote:** Is the town allowed to vote to "skip" lynching someone on a particular day?
