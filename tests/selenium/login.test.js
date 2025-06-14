const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

// Get the base URL from environment or use default
const getBaseUrl = () => {
  // Check if we're in a CI/CD environment
  if (process.env.CI) {
    return process.env.TEST_BASE_URL || 'http://localhost:80';
  }
  // Local development
  return process.env.TEST_BASE_URL || 'http://localhost:5173';
};

describe('Login Page Tests', () => {
  let driver;

  before(async () => {
    // Setup Chrome options
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    // Add additional options for CI/CD environments
    if (process.env.CI) {
      options.addArguments('--disable-gpu');
      options.addArguments('--window-size=1920,1080');
    }

    // Initialize the driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async () => {
    await driver.quit();
  });

  it('should login successfully and navigate to profile', async () => {
    const baseUrl = getBaseUrl();
    console.log(`Testing against: ${baseUrl}`);

    // Navigate to login page
    await driver.get(`${baseUrl}/login`);

    // Wait for the form to be present
    await driver.wait(until.elementLocated(By.css('form')), 5000);

    // Enter credentials
    await driver.findElement(By.name('email')).sendKeys('nihaas@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('Hi12345@');

    // Submit the form
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Wait for navigation to profile
    await driver.wait(until.urlContains('/profile'), 5000);

    // Verify we're on the profile page
    const currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes('/profile'), 'Should be redirected to profile after login');
  });
});
