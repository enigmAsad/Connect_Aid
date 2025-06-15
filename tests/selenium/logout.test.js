const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const { createDriver, getBaseUrl } = require('./selenium.config');

// Test user credentials
const TEST_USER = {
  email: 'nihaas@gmail.com',
  password: 'Hi12345@'
};

describe('Logout Functionality Tests', () => {
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
    
    // Additional wait to ensure the page is fully loaded
    await driver.wait(until.elementLocated(By.css('.min-h-screen')), 5000);
  };

  it('should successfully logout user', async () => {
    const baseUrl = getBaseUrl();
    console.log(`Testing against: ${baseUrl}`);

    // Login first
    await login();

    // Wait for the navbar to be present
    await driver.wait(until.elementLocated(By.css('.user-navbar')), 5000);

    // Click the menu button to open sidebar
    const menuButton = await driver.wait(
      until.elementLocated(By.css('.menu-btn')),
      5000
    );
    await driver.wait(until.elementIsVisible(menuButton), 5000);
    await driver.wait(until.elementIsEnabled(menuButton), 5000);
    await menuButton.click();

    // Wait for sidebar to be visible
    await driver.wait(until.elementLocated(By.css('.sidebar.open')), 5000);

    // Click the logout button
    const logoutButton = await driver.wait(
      until.elementLocated(By.css('.logout-btn')),
      5000
    );
    await driver.wait(until.elementIsVisible(logoutButton), 5000);
    await driver.wait(until.elementIsEnabled(logoutButton), 5000);
    await logoutButton.click();

    // Wait for redirect to login page
    await driver.wait(until.urlContains('/login'), 5000);

    // Verify we're on the login page
    const currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes('/login'), 'Should be redirected to login page');

    // Verify login form is present
    const loginForm = await driver.wait(
      until.elementLocated(By.css('form')),
      5000
    );
    assert.ok(loginForm, 'Login form should be present after logout');
  });
}); 