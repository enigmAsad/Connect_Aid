const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const { createDriver, getBaseUrl } = require('./selenium.config');

// Test user credentials
const TEST_USER = {
  email: 'nihaas@gmail.com',
  password: 'Hi12345@'
};

describe('Raise Page Tests', () => {
  let driver;

  before(async () => {
    // Initialize the driver using shared config
    driver = await createDriver();
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  // Helper function to login
  const login = async () => {
    const baseUrl = getBaseUrl();
    
    // Navigate to login page
    await driver.get(`${baseUrl}/login`);

    // Wait for the form to be present
    await driver.wait(until.elementLocated(By.css('form')), 5000);

    // Enter login credentials
    const emailInput = await driver.findElement(By.css('input[name="email"]'));
    await emailInput.clear();
    await emailInput.sendKeys(TEST_USER.email);

    const passwordInput = await driver.findElement(By.css('input[name="password"]'));
    await passwordInput.clear();
    await passwordInput.sendKeys(TEST_USER.password);

    // Submit the form
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();

    // Wait for navigation to profile page
    await driver.wait(until.urlContains('/profile'), 5000);
  };

  it('should navigate to create appeal page when clicking create new appeal button', async () => {
    const baseUrl = getBaseUrl();
    console.log(`Testing against: ${baseUrl}`);

    // Login first
    await login();

    // Navigate to raise page
    await driver.get(`${baseUrl}/raise`);

    // Wait for the page to load
    await driver.wait(until.elementLocated(By.css('.min-h-screen')), 5000);

    // Verify the header is present
    const header = await driver.wait(
      until.elementLocated(By.css('h1.text-3xl.font-bold')),
      5000
    );
    await driver.wait(until.elementIsVisible(header), 5000);
    const headerText = await header.getText();
    console.log('Header text:', headerText);
    assert.ok(headerText.includes('My Donation Appeals'), 'Should display correct header');

    // Find and click the Create New Appeal button
    const createAppealButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Create New Appeal')]")),
      5000
    );
    await driver.wait(until.elementIsVisible(createAppealButton), 5000);
    await createAppealButton.click();

    // Wait for navigation to create-appeal page
    await driver.wait(until.urlContains('/create-appeal'), 5000);

    // Verify we're on the create-appeal page
    const currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes('/create-appeal'), 'Should be redirected to create-appeal page');
  });
}); 