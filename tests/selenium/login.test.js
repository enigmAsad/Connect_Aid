const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const { createDriver, getBaseUrl } = require('./selenium.config');

describe('Login Page Tests', () => {
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

  it('should show error for invalid email format', async () => {
    const baseUrl = getBaseUrl();
    console.log(`Testing against: ${baseUrl}`);

    // Navigate to login page
    await driver.get(`${baseUrl}/login`);

    // Wait for the form to be present
    await driver.wait(until.elementLocated(By.css('form')), 5000);

    // Enter invalid email format
    const emailInput = await driver.findElement(By.name('email'));
    await emailInput.clear();
    await emailInput.sendKeys('nihaas @ gmail.com');

    // Enter any password
    const passwordInput = await driver.findElement(By.name('password'));
    await passwordInput.clear();
    await passwordInput.sendKeys('anypassword');

    // Try to submit the form
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();

    // Wait for the email input to be invalid using a more reliable method
    await driver.wait(async () => {
      const isValid = await driver.executeScript(
        'return arguments[0].checkValidity()',
        emailInput
      );
      return !isValid;
    }, 5000);

    // Get the validation message
    const validationMessage = await driver.executeScript(
      'return arguments[0].validationMessage',
      emailInput
    );
    console.log('Validation message:', validationMessage);

    // Verify the validation message
    assert.ok(
      validationMessage.includes('valid email') || 
      validationMessage.includes('Please enter a valid email address') ||
      validationMessage.includes('should not contain the symbol'),
      'Should display email validation error message'
    );

    // Verify we're still on the login page
    const currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes('/login'), 'Should remain on login page');
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
