const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Get the base URL from environment or use default
const getBaseUrl = () => {
  // Check if we're in a CI/CD environment
  if (process.env.CI) {
    return process.env.TEST_BASE_URL || 'http://nginx:80';
  }
  // Local development
  return process.env.TEST_BASE_URL || 'http://localhost:5173';
};

async function createDriver() {
    console.log('🚀 Creating Chrome driver with system binaries...');
    
    const options = new chrome.Options();
    
    // Basic headless options
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    
    // Additional stability options for Alpine Linux
    options.addArguments('--disable-extensions');
    options.addArguments('--disable-plugins');
    options.addArguments('--disable-default-apps');
    options.addArguments('--disable-sync');
    options.addArguments('--disable-background-timer-throttling');
    options.addArguments('--disable-backgrounding-occluded-windows');
    options.addArguments('--disable-renderer-backgrounding');
    options.addArguments('--disable-features=TranslateUI');
    options.addArguments('--disable-ipc-flooding-protection');
    options.addArguments('--remote-debugging-port=9222');
    
    // Set the Chrome binary path for Alpine Linux
    console.log('📍 Setting Chrome binary path: /usr/bin/chromium-browser');
    options.setChromeBinaryPath('/usr/bin/chromium-browser');

    // Create Chrome service with system ChromeDriver
    console.log('📍 Setting ChromeDriver path: /usr/bin/chromedriver');
    const service = new chrome.ServiceBuilder('/usr/bin/chromedriver');

    try {
        console.log('🔧 Building Chrome driver...');
        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(service)
            .build();
        
        console.log('✅ Chrome driver created successfully!');
        return driver;
    } catch (error) {
        console.error('❌ Failed to create Chrome driver:', error.message);
        console.error('Full error:', error);
        throw error;
    }
}

module.exports = { 
    createDriver,
    getBaseUrl
}; 