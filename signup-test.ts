import { browser, by, element, ElementFinder } from 'protractor';

var assert = require('assert');

describe('Sign up', () => {
	it('User registered', async () => {
		const name = 'Test project';
		const email = 'thisIsADemo108@gmail.com';
		const pwd = 'testProject12345';

		await browser.sleep(3000);
		await element(by.css('a[data-purpose="header-signup"]')).click();
		await browser.sleep(3000);
		await element(by.css('[name="fullname"]')).sendKeys(name);
		await element(by.css('[name="email"]')).sendKeys(email);
		await element(by.css('[name="password"]')).sendKeys(pwd);
		await element(by.css('[name="submit"]')).click();

		await browser.sleep(10000);

		await browser
			.actions()
				.mouseMove(await element(by.css("a[data-purpose='user-dropdown']")))
					.perform();

		const currentEmail = await element(by.css('[class*="user-profile-dropdown--email"]')).getText();
		const currentName = await element(by.css('[class="udlite-heading-md"]')).getText();

		assert.equal(currentEmail, email, `Error, the email should be ${email}`);
		assert.equal(currentName, name, `Error, the name should be ${name}`);

		await element(by.css('[href*="logout"]')).click();
	});

	it('Try to register without a password', async () => {
		const name = 'Test project';
		const email = 'thisIsADemo4@gmail.com';
		await browser.sleep(3000);
		await element(by.css('a[data-purpose="header-signup"]')).click();
		await browser.sleep(3000);
		await element(by.css('[name="fullname"]')).sendKeys(name);
		await element(by.css('[name="email"]')).sendKeys(email);
		await element(by.css('[name="submit"]')).click();
		try {
			await element(by.css("[class='alert alert-danger js-error-alert']")).isDisplayed();
			console.log(await element(by.css("[class='alert alert-danger js-error-alert']")).getText());
		} catch (error) {
			console.log(error);
		}
	});
});
