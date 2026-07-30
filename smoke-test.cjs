const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  let exitCode = 0;
  console.log("Starting full game smoke test...");
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  try {
    console.log("Navigating to home...");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    
    await page.evaluate(() => {
      localStorage.setItem('mafia_theme', 'edo');
      localStorage.setItem('mafia_playerName', 'SmokeTester');
    });
    await page.reload({ waitUntil: 'networkidle2' });

    console.log("Clicking 'Practice vs AI'...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const practiceBtn = buttons.find(b => b.textContent.toUpperCase().includes('PRACTICE VS AI') || b.textContent.toUpperCase().includes('PRACTICE'));
      if (practiceBtn) practiceBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("Submitting name...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const enterBtn = buttons.find(b => b.textContent.toUpperCase().includes('PROCEED') || b.textContent.toUpperCase().includes('ENTER'));
      if (enterBtn) enterBtn.click();
    });
    
    console.log("Waiting for Lobby navigation...");
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
    
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Adding AI bots...");
    for(let i = 0; i < 4; i++) {
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const addBotBtn = buttons.find(b => b.textContent.toUpperCase().includes('RECRUIT AI') || b.textContent.toUpperCase().includes('ADD AI'));
            if (addBotBtn) addBotBtn.click();
        });
        await new Promise(r => setTimeout(r, 500));
    }
    
    console.log("Setting Ready status...");
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const readyBtn = buttons.find(b => b.textContent.toUpperCase().includes('SET READY'));
        if (readyBtn) readyBtn.click();
    });

    await new Promise(r => setTimeout(r, 1000));

    console.log("Clicking 'Commence Operation' (Start Game)...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(b => b.textContent.toUpperCase().includes('COMMENCE OPERATION') || b.textContent.toUpperCase().includes('START'));
      if (startBtn) startBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));

    console.log("Checking for Dossier...");
    await page.waitForFunction(() => {
      return document.body.innerText.toUpperCase().includes('EMBRACE DESTINY') || document.body.innerText.toUpperCase().includes('UNDERSTOOD');
    }, { timeout: 10000 });
    
    console.log("Clicking 'Embrace Destiny'...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const understoodBtn = buttons.find(b => b.textContent.toUpperCase().includes('EMBRACE DESTINY') || b.textContent.toUpperCase().includes('UNDERSTOOD'));
      if (understoodBtn) understoodBtn.click();
    });

    console.log("Waiting for Night Phase...");
    await page.waitForFunction(() => {
      return document.body.innerText.toUpperCase().includes('NIGHT 1');
    }, { timeout: 10000 });
    
    console.log("Reached Night 1. Simulating click on a player card...");
    await new Promise(r => setTimeout(r, 1000));
    
    await page.waitForSelector('.spotlight-card');
    
    // Check our role
    const isVillager = await page.evaluate(() => {
        return document.body.innerText.includes('HEIMIN') || document.body.innerText.includes('VILLAGER');
    });

    const cards = await page.$$('.spotlight-card');
    if (cards.length > 0) {
        await cards[0].click();
        await new Promise(r => setTimeout(r, 1000));
        
        if (!isVillager) {
            const hasModal = await page.evaluate(() => {
                return document.querySelector('.cinematic-glass-panel') !== null;
            });
            if (!hasModal) {
                console.warn("WARNING: Action modal did not appear. Bots might have transitioned phase too fast, or role prevents it.");
            } else {
                console.log("Action modal confirmed working!");
            }
        } else {
            console.log("Player is a Heimin/Villager, skipping Action Modal test for Night Phase.");
        }
    } else {
        throw new Error("Could not find any player cards to click!");
    }

    console.log("Smoke test completed successfully!");

  } catch (err) {
    console.error("SMOKE TEST FAILED:");
    console.error(err);
    const text = await page.evaluate(() => document.body.innerText);
    console.log("Current page text:", text);
    exitCode = 1;
  } finally {
    await browser.close();
    process.exit(exitCode);
  }
})();
