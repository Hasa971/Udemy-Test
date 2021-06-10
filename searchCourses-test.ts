import { browser, by, element, protractor } from 'protractor';
import { ExpectedConditions as EC } from 'protractor';

var assert = require('assert');
describe('Search courses and filters', () => {
	it('Searching valid course', async () => {
		await element(by.css('[name="q"]')).sendKeys('Test');
		await element(by.css('[name="q"]')).sendKeys(protractor.Key.ENTER);
		await browser.sleep(5000);

		expect(await element(by.css('.udlite-heading-xxl')).isDisplayed()).toBe(true);
	});

	it('No matching criteria', async () => {
		await element(by.cssContainingText('option', 'English')).click();
		const noResultMessage = "Sorry, we couldn't find any results for";
		const searchData = 'adadsadasdadsad';
		await element(by.css('[name="q"]')).sendKeys(searchData);
		await element(by.css('[name="q"]')).sendKeys(protractor.Key.ENTER);
		await browser.sleep(5000);
		expect(await element(by.css('[class="udlite-heading-xl"]')).isDisplayed()).toBe(true);
		assert.equal(
			await element(by.css('[class="udlite-heading-xl"]')).getText(),
			noResultMessage + ' ' + searchData,
		);
	});

	it('Filter by Expert Level', async () => {
		const searchData = 'Test';
		await element(by.cssContainingText('option', 'English')).click();
		await element(by.css('[name="q"]')).sendKeys(searchData);
		await element(by.css('[name="q"]')).sendKeys(protractor.Key.ENTER);
		await browser.sleep(5000);
		await element(by.xpath("//label[contains(text(),'All Levels')]//*[local-name()='svg']")).click();
		const currentUrl = await browser.getCurrentUrl();
		expect(currentUrl.includes('instructional_level=all')).toBe(true);
	});

	it('Filter by English Language', async () => {
		const searchData = 'Test';
		await element(by.cssContainingText('option', 'English')).click();
		await element(by.css('[name="q"]')).sendKeys(searchData);
		await element(by.css('[name="q"]')).sendKeys(protractor.Key.ENTER);
		await browser.sleep(5000);
		//Click on Language side bar button
		await element(by.xpath("//button//span[contains(text(),'Language')]")).click();
		//Click on english
		await element(
			by.xpath(
				"//fieldset[@name='Language']//label[@class='udlite-toggle-input-container udlite-text-sm'][contains(text(),'English')]//*[local-name()='svg']",
			),
		).click();

		const currentUrl = await browser.getCurrentUrl();
		expect(currentUrl.includes('lang=en')).toBe(true);
	});
});
