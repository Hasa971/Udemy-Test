import { browser } from 'protractor';
import fse from 'fs-extra';
import webRep from 'jasmine-failures-slack-reporter';

const { join } = require('path');

export abstract class BrowserUtilities {
	static chromeConfigs = {
		browserName: 'chrome',
		chromeOptions: {
			args: ['--window-size=1550,768', '--no-sandbox', '--disable-dev-shm-usage'],
		},
		shardTestFiles: false,
		maxInstances: 1,
	};

	static firefoxConfigs = {
		browserName: 'firefox',
		marionette: 'true',
		'moz:firefoxOptions': {
			args: ['--window-size=1550,768'],
		},
	};

	static safariConfigs = {
		browserName: 'safari',
		safariOptions: {
			args: ['--window-size=1550,768'],
		},
	};

	static multiCapabilitiesConfigs = [
		{
			browserName: BrowserUtilities.chromeConfigs.browserName,
			chromeOptions: BrowserUtilities.chromeConfigs.chromeOptions,
		},
		// {
		// 	browserName: BrowserUtilities.firefoxConfigs.browserName,
		// 	marionette: BrowserUtilities.firefoxConfigs.marionette,
		// 	'moz:firefoxOptions': BrowserUtilities.firefoxConfigs['moz:firefoxOptions'],
		// },
		/*{
					browserName: BrowserUtilities.safariConfigs.browserName,
					safariOptions: BrowserUtilities.safariConfigs.safariOptions
				}*/
	];

	static setFullScreen = async (browserName): Promise<void> => {
		switch (browserName) {
			case 'chrome':
				browser.driver
					.executeScript<[number, number]>(() => [1600, 1000])
					.then((result: [number, number]) => {
						browser.driver
							.manage()
							.window()
							.setSize(result[0], result[1]);
					});
				break;

			case 'firefox':
				browser.driver
					.executeScript<[number, number]>(() => [window.screen.availWidth, window.screen.availHeight])
					.then((result: [number, number]) => {
						browser.driver
							.manage()
							.window()
							.setSize(result[0], result[1]);
					});
				break;
		}
	};

	static startBrowser = async (): Promise<void> => {
		await browser.waitForAngularEnabled(false);
		const browserCapabilities = await browser.getCapabilities();
		const browserName = await browserCapabilities.get('browserName');
		await BrowserUtilities.setFullScreen(browserName);
		await browser.get(browser.baseUrl);
	};

	static killBrowser = async (): Promise<void> => {
		if (browser) {
			await browser.driver.quit();
		}
	};

	static showBrowserLogs = async (): Promise<void> => {
		const browserLogs = await browser
			.manage()
			.logs()
			.get('browser');
		browserLogs.forEach(function(log) {
			if (log.level.value >= 900) {
				console.log(`\nThe following error was found in the browser console: \n\t${log.message} \n`);
			}
		});
	};
}

export abstract class ScreenshotsUtilities {
	static takeScrenshootInFailure = async (result: jasmine.CustomReporterResult): Promise<void> => {
		const caps = await browser.getCapabilities();
		const browserName = await caps.get('browserName');
		const takeScreenshot = await browser.takeScreenshot();
		const stream = fse.createWriteStream(
			`logger-bag/screenshots-for-failures/${browserName} - ${result.fullName}.png`,
		);
		stream.write(new Buffer(takeScreenshot, 'base64'));
		stream.end();
	};
}

export abstract class PluginUtilities {
	/***
	baselineFolder: The directory that will hold all the baseline images that are used to during the comparison
	formatImageName:  The format name of the saved images
	screenshotPath: The directory that will hold all the actual / difference screenshots
	savePerInstance: Save the images per instance in a separate folder
	debug: Enable extra console logging or always saving the diff images during comparison.
	disableCSSAnimation: En/Disable all css animations in the application
	clearRuntimeFolder: Delete runtime folder (actual & diff) on initialisation
	autoSaveBaseline: If no baseline image is found during the comparison the image is
	automatically copied to the baseline folder when this is set to true

	more: https://github.com/wswebcreation/webdriver-image-comparison/blob/master/docs/OPTIONS.md#compare-options

	***/
	static pluginConfig = [
		{
			package: 'protractor-image-comparison',
			options: {
				baselineFolder: join(process.cwd(), `./image-comparison/baseline/${process.platform}`),
				formatImageName: '{tag}-{logName}-{width}x{height}',
				screenshotPath: join(process.cwd(), './image-comparison/actual_screenshots/'),
				savePerInstance: true,
				debug: false,
				disableCSSAnimation: true,
				clearRuntimeFolder: true,
				autoSaveBaseline: true,
			},
		},
	];
}
