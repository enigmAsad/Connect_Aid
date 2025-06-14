const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

// Get the base URL from environment or use default
const getBaseUrl = () => {
  if (process.env.CI) {
    return process.env.TEST_BASE_URL || 'http://localhost:80';
  }
  return process.env.TEST_BASE_URL || 'http://localhost:5173';
};

// Test user credentials
const TEST_USER = {
  email: 'nihaas@gmail.com',
  password: 'Hi12345@'
};

describe('Profile Page Tests', () => {
  let driver;

  before(async () => {
    // Setup Chrome options
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
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

  it('should load profile page and display user information', async () => {
    const baseUrl = getBaseUrl();
    console.log(`Testing against: ${baseUrl}`);

    // Login first
    await login();

    // Wait for the profile content to load with a more specific selector
    await driver.wait(until.elementLocated(By.css('.bg-white.rounded-t-xl')), 5000);

    // Wait for the header to be visible and get its text
    const header = await driver.wait(
      until.elementLocated(By.css('h1.text-3xl.font-bold')),
      5000
    );
    await driver.wait(until.elementIsVisible(header), 5000);
    const headerText = await header.getText();
    console.log('Header text:', headerText); // Debug log
    assert.ok(headerText.includes('Your Profile'), 'Should display profile header');

    // Wait for and verify edit button
    const editButton = await driver.wait(
      until.elementLocated(By.css('button.px-4.py-2')),
      5000
    );
    await driver.wait(until.elementIsVisible(editButton), 5000);
    const buttonText = await editButton.getText();
    console.log('Button text:', buttonText); // Debug log
    assert.ok(buttonText.includes('Edit Profile'), 'Should display edit button');
  });

  it('should enter edit mode and update profile information', async () => {
    const baseUrl = getBaseUrl();
    console.log(`Testing against: ${baseUrl}`);
    
    // Login first
    await login();

    // Wait for the profile content to load
    await driver.wait(until.elementLocated(By.css('.bg-white.rounded-t-xl')), 5000);

    // Wait for and click edit button
    const editButton = await driver.wait(
      until.elementLocated(By.css('button.px-4.py-2')),
      5000
    );
    await driver.wait(until.elementIsVisible(editButton), 5000);
    await driver.wait(until.elementIsEnabled(editButton), 5000);
    await editButton.click();

    // Wait for edit form to appear
    await driver.wait(until.elementLocated(By.css('form')), 5000);

    // Update profile information with explicit waits
    const firstNameInput = await driver.wait(
      until.elementLocated(By.css('input[name="firstName"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(firstNameInput), 5000);
    await firstNameInput.clear();
    await firstNameInput.sendKeys('Test First Name');

    const lastNameInput = await driver.wait(
      until.elementLocated(By.css('input[name="lastName"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(lastNameInput), 5000);
    await lastNameInput.clear();
    await lastNameInput.sendKeys('Test Last Name');

    const phoneInput = await driver.wait(
      until.elementLocated(By.css('input[name="phone"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(phoneInput), 5000);
    await phoneInput.clear();
    await phoneInput.sendKeys('1234567890');

    // Select country with explicit waits
    const countrySelect = await driver.wait(
      until.elementLocated(By.css('select[name="country"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(countrySelect), 5000);
    await countrySelect.click();
    
    const countryOption = await driver.wait(
      until.elementLocated(By.css('option[value="US"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(countryOption), 5000);
    await countryOption.click();

    // Update profession
    const professionInput = await driver.wait(
      until.elementLocated(By.css('input[name="profession"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(professionInput), 5000);
    await professionInput.clear();
    await professionInput.sendKeys('Software Engineer');

    // Update bio
    const bioTextarea = await driver.wait(
      until.elementLocated(By.css('textarea[name="bio"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(bioTextarea), 5000);
    await bioTextarea.clear();
    await bioTextarea.sendKeys('This is a test bio for Selenium testing');

    // Save changes
    const saveButton = await driver.wait(
      until.elementLocated(By.css('button[type="button"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(saveButton), 5000);
    await driver.wait(until.elementIsEnabled(saveButton), 5000);
    await saveButton.click();

    // Wait for success message
    const successMessage = await driver.wait(
      until.elementLocated(By.css('.text-green-600')),
      5000
    );
    await driver.wait(until.elementIsVisible(successMessage), 5000);
    const messageText = await successMessage.getText();
    assert.ok(messageText.includes('Profile updated successfully'), 'Should show success message');

    // Wait for the profile content to reload
    await driver.wait(until.elementLocated(By.css('.bg-white.rounded-t-xl')), 5000);

    // Wait for and verify the edit button is back
    const editButtonAfterSave = await driver.wait(
      until.elementLocated(By.css('button.px-4.py-2')),
      5000
    );
    await driver.wait(until.elementIsVisible(editButtonAfterSave), 5000);
    const buttonTextAfterSave = await editButtonAfterSave.getText();
    assert.ok(buttonTextAfterSave.includes('Edit Profile'), 'Should be back in view mode');
  });
}); 