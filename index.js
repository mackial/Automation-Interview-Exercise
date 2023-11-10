import puppeteer from 'puppeteer';
import 'dotenv/config';

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
  });

  // Trello
  const trello = await browser.newPage();

  await trello.goto('https://trello.com/b/QvHVksDa/personal-work-goals');

  // Set screen size
  await trello.setViewport({ width: 1080, height: 1024 });

  // Close about this board
  const aboutModalButton = '[data-testid="about-this-board-modal-cta-button"]';
  await trello.waitForSelector(aboutModalButton);
  await trello.click(aboutModalButton);

  const taskList = await trello.evaluate(() =>
    Array.from(
      document.querySelectorAll('[data-testid="card-name"]'),
      (element) => element.textContent
    )
  );

  // Todoist
  const todoist = await browser.newPage();

  await todoist.goto('https://app.todoist.com/auth/login');

  // Set screen size
  await todoist.setViewport({ width: 1080, height: 1024 });

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

  const firstTenTasks = taskList.splice(0, 10);

  // Add task
  await firstTenTasks.map(async (t, i) => {
    await new Promise((resolve) => {
      setTimeout(async () => {
        console.log('interval1', t);
        const resolved = await todoist.evaluate(async (tt) => {
          return await new Promise((resolve) => {
            const interval2 = setInterval(() => {
              const newTask = document.getElementById('quick_add_task_holder');

              if (newTask) {
                newTask.click();

                // Wait to render task editor
                const interval3 = setInterval(() => {
                  const taskNameHolder = document.querySelector(
                    '[aria-label="Task name"]'
                  );
                  // Set the task name
                  taskNameHolder.innerHTML = `<p>${tt}</p>`;

                  if (taskNameHolder) {
                    // Wait to enable add task button
                    setTimeout(() => {
                      const addTask = document.querySelector(
                        '[data-testid="task-editor-submit-button"]'
                      );
                      addTask.click();

                      // Clear intervals
                      clearInterval(interval3);
                      clearInterval(interval2);
                    }, 300);
                  }
                }, 300);
              }
            }, 1000);

            resolve(true);
          });
        }, t);

        if (resolved) resolve();
      }, 1400 * (i + 1));
    });
  });

  // await browser.close();
})();
