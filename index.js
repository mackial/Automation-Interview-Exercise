import puppeteer from 'puppeteer';
import 'dotenv/config';

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
  });

  // // Trello tasks
  // const trello = await browser.newPage();

  // await trello.goto('https://trello.com/b/QvHVksDa/personal-work-goals');

  // // Set screen size
  // await trello.setViewport({width: 1080, height: 1024});

  // Todoist Login
  const todoist = await browser.newPage();

  await todoist.goto('https://app.todoist.com/auth/login');

  // Set screen size
  await todoist.setViewport({width: 1080, height: 1024});

  // Login inputs
  const tdstEmailInput = '#element-0';
  const tdstPassInput = '#element-3';

  await todoist.waitForSelector(tdstEmailInput);
  await todoist.waitForSelector(tdstPassInput);

  await todoist.type(tdstEmailInput, process.env.EMAIL);
  await todoist.type(tdstPassInput, process.env.PASSWORD);

  // Login button
  const tdstLoginButton = '[data-gtm-id="start-email-login"]';
  await todoist.waitForSelector(tdstLoginButton);
  await todoist.click(tdstLoginButton);

  // // Locate the full title with a unique string
  // const textSelector = await page.waitForSelector(
  //   ' '
  // );
  // const fullTitle = await textSelector?.evaluate(el => el.textContent);

  // // Print the full title
  // console.log('The title of this blog post is "%s".', fullTitle);

  // await browser.close();
})();
