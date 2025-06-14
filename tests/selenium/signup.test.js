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

// Generate unique test data
const generateTestData = () => {
  const timestamp = Date.now();
  return {
    username: `testuser${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: `Test${timestamp}!@#`
  };
};

describe('SignUp Page Tests', () => {
  let driver;
  let testData;

  before(async () => {
    // Generate unique test data for this test run
    testData = generateTestData();
    console.log('Using test data:', testData);

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

  it('should signup successfully and navigate to login', async () => {
    const baseUrl = getBaseUrl();
    console.log(`Testing against: ${baseUrl}`);

    // Navigate to signup page
    await driver.get(`${baseUrl}/signup`);

    // Wait for the form to be present
    await driver.wait(until.elementLocated(By.css('form')), 5000);

    // Enter signup details with unique data
    await driver.findElement(By.css('input[type="text"]')).sendKeys(testData.username);
    await driver.findElement(By.css('input[type="email"]')).sendKeys(testData.email);
    await driver.findElement(By.css('input[type="password"]')).sendKeys(testData.password);
    await driver.findElement(By.css('input[placeholder="Confirm your password"]')).sendKeys(testData.password);

    // Submit the form
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Wait for and handle the alert
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    assert.ok(alertText.includes('Account created successfully'), 'Should show success message');
    await alert.accept();

    // Wait for navigation to login
    await driver.wait(until.urlContains('/login'), 5000);

    // Verify we're on the login page
    const currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes('/login'), 'Should be redirected to login after signup');
  });

  it('should show validation errors for invalid password', async () => {
    const baseUrl = getBaseUrl();
    
    // Generate new unique data for this test
    const weakTestData = generateTestData();
    console.log('Using weak test data:', weakTestData);
    
    // Navigate to signup page
    await driver.get(`${baseUrl}/signup`);

    // Wait for the form to be present
    await driver.wait(until.elementLocated(By.css('form')), 5000);

    // Enter signup details with weak password
    await driver.findElement(By.css('input[type="text"]')).sendKeys(weakTestData.username);
    await driver.findElement(By.css('input[type="email"]')).sendKeys(weakTestData.email);
    await driver.findElement(By.css('input[type="password"]')).sendKeys('weak');
    await driver.findElement(By.css('input[placeholder="Confirm your password"]')).sendKeys('weak');

    // Verify submit button is disabled
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    const isEnabled = await submitButton.isEnabled();
    assert.ok(!isEnabled, 'Submit button should be disabled for invalid password');
  });

  it('should show error for non-matching passwords', async () => {
    const baseUrl = getBaseUrl();
    
    // Generate new unique data for this test
    const mismatchTestData = generateTestData();
    console.log('Using mismatch test data:', mismatchTestData);
    
    // Navigate to signup page
    await driver.get(`${baseUrl}/signup`);

    // Wait for the form to be present
    await driver.wait(until.elementLocated(By.css('form')), 5000);

    // Enter signup details with non-matching passwords
    await driver.findElement(By.css('input[type="text"]')).sendKeys(mismatchTestData.username);
    await driver.findElement(By.css('input[type="email"]')).sendKeys(mismatchTestData.email);
    await driver.findElement(By.css('input[type="password"]')).sendKeys('Test123!@#');
    await driver.findElement(By.css('input[placeholder="Confirm your password"]')).sendKeys('Different123!@#');

    // Verify submit button is disabled
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    const isEnabled = await submitButton.isEnabled();
    assert.ok(!isEnabled, 'Submit button should be disabled for non-matching passwords');
  });
}); 