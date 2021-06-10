import { browser, by, element, ElementFinder } from 'protractor';
var assert = require('assert');

describe('Login test cases', () => {
	it('Succesfully logged into', async () => {
		const email = 'thisIsADemo4@gmail.com';
		const pwd = 'testProject12345';

		await element(by.css('a[data-purpose="header-login"]')).click();
		await browser.sleep(3000);
		await element(by.css('[name="email"]')).sendKeys(email);
		await element(by.css('[name="password"]')).sendKeys(pwd);
		await element(by.css('[name="submit"]')).click();

		await browser.sleep(10000);

		await browser
			.actions()
			.mouseMove(await element(by.css("a[data-purpose='user-dropdown']")))
			.perform();

		const currentEmail = await element(by.css('[class*="user-profile-dropdown--email"]')).getText();

		assert.equal(currentEmail, email, `Error, the email should be ${email}`);

		await element(by.css('[href*="logout"]')).click();
	});

	it('Login with invalid credentials', async () => {
		const email = 'thisIsADemo4@gmail.com';
		const pwd = '123456';

		await element(by.css('a[data-purpose="header-login"]')).click();
		await browser.sleep(3000);
		await element(by.css('[name="email"]')).sendKeys(email);
		await element(by.css('[name="password"]')).sendKeys(pwd);
		await element(by.css('[name="submit"]')).click();

		expect(await element(by.css("[class='alert alert-danger js-error-alert']")).isDisplayed()).toBe(true);

		console.log(await element(by.css("[class='alert alert-danger js-error-alert']")).getText());
	});
});
