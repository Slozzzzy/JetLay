import { test, expect } from '@playwright/test';

test('requirements', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').nth(1).selectOption('Japan');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('combobox').nth(1).selectOption('USA');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('combobox').first().selectOption('Japanese');
    await page.getByRole('combobox').nth(1).selectOption('Thailand');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('combobox').first().selectOption('Japanese');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('combobox').first().selectOption('Japanese');
    await page.getByRole('combobox').nth(1).selectOption('USA');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('combobox').first().selectOption('French');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('combobox').first().selectOption('French');
    await page.getByRole('combobox').nth(1).selectOption('Japan');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('combobox').first().selectOption('French');
    await page.getByRole('combobox').nth(1).selectOption('USA');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('combobox').first().selectOption('American');
    await page.getByRole('combobox').nth(1).selectOption('Thailand');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('combobox').first().selectOption('American');
    await page.getByRole('combobox').nth(1).selectOption('Japan');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('combobox').first().selectOption('American');
    await page.getByRole('button', { name: 'Check Requirements' }).click();   
    
    // logout
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_th2jp', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').nth(1).selectOption('Japan');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('Completed visa application').click();
    await page.getByText('Valid passport with at least').click();
    await page.getByText('Recent passport-size photo (').click();
    await page.getByText('Certified copy of birth').click();
    await page.getByText('Certified copy of marriage').click();
    await page.getByText('Letter of invitation (if').click();
    await page.getByText('Proof of financial funds to').click();
    await page.getByText('Proof of accommodation such').click();
    await page.getByText('Flight itinerary containing a').click();
    await page.getByText('Daily itinerary containing').click();
    await page.getByText('Daily itinerary containing').click();
    await page.getByText('Flight itinerary containing a').click();
    await page.getByText('Proof of accommodation such').click();
    await page.getByText('Proof of financial funds to').click();
    await page.getByText('Letter of invitation (if').click();
    await page.getByText('Certified copy of marriage').click();
    await page.getByText('Certified copy of birth').click();
    await page.getByText('Recent passport-size photo (').click();
    await page.getByText('Valid passport with at least').click();
    await page.getByText('Completed visa application').click();  
    
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_th2fr', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('Passport (valid for 6 months').click();
    await page.getByText('Copy of passport photo page').click();
    await page.getByText('Completed Visa application').click();
    await page.getByText('Two color ID photos size 3.5').click();
    await page.getByText('Proof of Employment that').click();
    await page.getByText('Copy of the business').click();
    await page.getByText('Sponsorship letter from a').click();
    await page.getByText('Motivation letter explaining').click();
    await page.getByText('Proof of accommodation', { exact: true }).click();
    await page.getByText('Bank guarantee letter, bank').click();
    await page.getByText('Flight reservation and proof').click();
    await page.getByText('Flight reservation and proof').click();
    await page.getByText('Bank guarantee letter, bank').click();
    await page.getByText('Proof of accommodation', { exact: true }).click();
    await page.getByText('Motivation letter explaining').click();
    await page.getByText('Sponsorship letter from a').click();
    await page.getByText('Copy of the business').click();
    await page.getByText('Proof of Employment that').click();
    await page.getByText('Two color ID photos size 3.5').click();
    await page.getByText('Completed Visa application').click();
    await page.getByText('Copy of passport photo page').click();
    await page.getByText('Passport (valid for 6 months').click(); 
    
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_th2usa', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').nth(1).selectOption('USA');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('Passport (valid for 6 months').click();
    await page.getByText('A recent, passport-style').click();
    await page.getByText('The original appointment').click();
    await page.getByText('A printed copy of the DS-160').click();
    await page.getByText('A detailed travel itinerary').click();
    await page.getByText('Evidence demonstrating').click();
    await page.getByText('Documentation that').click();
    await page.getByText('Any other documents requested').click();
    await page.getByText('Any other documents requested').click();
    await page.locator('label').filter({ hasText: 'Documentation that' }).click();
    await page.getByText('Evidence demonstrating').click();
    await page.getByText('A detailed travel itinerary').click();
    await page.getByText('A printed copy of the DS-160').click();
    await page.getByText('The original appointment').click();
    await page.getByText('A recent, passport-style').click();
    await page.getByText('Passport (valid for 6 months').click();
    
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_jp2th', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').first().selectOption('Japanese');
    await page.getByRole('combobox').nth(1).selectOption('Thailand');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('Passport valid for at least 6').click();
    await page.getByText('Proof of onward travel or').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Completed arrival information').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Completed arrival information').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Proof of onward travel or').click();
    await page.getByText('Passport valid for at least 6').click();
    
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_jp2fr', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').first().selectOption('Japanese');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('Passport valid for at least 3').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Proof of sufficient financial').click();
    await page.getByText('Purpose of visit (tourism').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Purpose of visit (tourism').click();
    await page.getByText('Proof of sufficient financial').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('Passport valid for at least 3').click();
    
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_jp2usa', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').first().selectOption('Japanese');
    await page.getByRole('combobox').nth(1).selectOption('USA');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('Valid Japanese e-passport (').click();
    await page.getByText('Approved ESTA (Electronic').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('Address for your stay in the').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Address for your stay in the').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('Approved ESTA (Electronic').click();
    await page.getByText('Valid Japanese e-passport (').click();
    
    // logout
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_fr2th', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').first().selectOption('French');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('Passport valid for at least 6').click();
    await page.getByText('Proof of onward travel or').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Completed arrival information').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Completed arrival information').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Proof of onward travel or').click();
    await page.getByText('Passport valid for at least 6').click();
    
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_fr2jp', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').first().selectOption('French');
    await page.getByRole('combobox').nth(1).selectOption('Japan');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('Valid passport for the').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Visit Japan Web registration').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Visit Japan Web registration').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('Valid passport for the').click();
    
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_fr2usa', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').first().selectOption('French');
    await page.getByRole('combobox').nth(1).selectOption('USA');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('Valid French biometric e-').click();
    await page.getByText('Approved ESTA (Electronic').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('Address for your stay in the').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Address for your stay in the').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('Approved ESTA (Electronic').click();
    await page.getByText('Valid French biometric e-').click();
    
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_usa2th', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').first().selectOption('American');
    await page.getByRole('combobox').nth(1).selectOption('Thailand');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('Passport (valid for at least').click();
    await page.getByText('Proof of onward travel (').click();
    await page.getByText('Proof of accommodation (hotel').click();
    await page.getByText('Completed visa application').click();
    await page.getByText('Passport-sized photo (2x2').click();
    await page.getByText('Evidence of sufficient funds').click();
    await page.getByText('Visa fee payment receipt (if').click();
    await page.getByText('Proof of employment or').click();
    await page.getByText('For long-stay visas: medical').click();
    await page.getByText('Proof of travel insurance (').click();
    await page.getByText('Proof of travel insurance (').click();
    await page.getByText('For long-stay visas: medical').click();
    await page.getByText('Proof of employment or').click();
    await page.getByText('Visa fee payment receipt (if').click();
    await page.getByText('Evidence of sufficient funds').click();
    await page.getByText('Passport-sized photo (2x2').click();
    await page.getByText('Completed visa application').click();
    await page.getByText('Proof of accommodation (hotel').click();
    await page.getByText('Proof of onward travel (').click();
    await page.getByText('Passport (valid for at least').click();
        
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_usa2jp', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').first().selectOption('American');
    await page.getByRole('combobox').nth(1).selectOption('Japan');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('Valid U.S. passport for the').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Completed Visit Japan Web').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Completed Visit Japan Web').click();
    await page.getByText('Proof of sufficient funds to').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('Valid U.S. passport for the').click();
    
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('checklist_usa2fr', async ({ page }) => {
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Visa Requirement Visa' }).click();
    await page.getByRole('combobox').first().selectOption('American');
    await page.getByRole('button', { name: 'Check Requirements' }).click();
    await page.getByText('U.S. passport valid for at').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Proof of sufficient financial').click();
    await page.getByText('Purpose of visit (tourism').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Travel insurance covering').click();
    await page.getByText('Purpose of visit (tourism').click();
    await page.getByText('Proof of sufficient financial').click();
    await page.getByText('Proof of accommodation in').click();
    await page.getByText('Return or onward travel').click();
    await page.getByText('U.S. passport valid for at').click();
    
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('upload_and_noti', async ({ page }) => {
    const now = new Date();
    const timestamp =
        String(now.getDate()).padStart(2, '0') +
        String(now.getMonth() + 1).padStart(2, '0') +
        now.getFullYear() +
        '_' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Document Upload Document' }).click();
    await page.getByRole('button', { name: 'Upload New Document' }).click();
    await page.getByRole('textbox', { name: 'e.g. Main Passport, Schengen' }).click();
    await page.getByRole('textbox', { name: 'e.g. Main Passport, Schengen' }).fill(`test_${timestamp}`);
    await page.locator('input[type="date"]').fill('2026-11-26');
    await page.getByText('Click to upload or drag and dropPDF, JPG, PNG (MAX. 5MB)').click();
    await page.locator('input[type="file"]').setInputFiles('tests/files/JetrayProfilePicture.webp');
    await page.getByRole('button', { name: 'Save Document' }).click();
    await page.waitForTimeout(3000);
    // await expect(page.getByText(/Passport - test_${timestamp}/i)).toBeVisible();
    await expect(page.getByText(new RegExp(`Passport - test_${timestamp}`, 'i'))).toBeVisible();

    // check noti
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('button', { name: 'Notifications' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('calendar_and_review', async ({ page }) => {
    const now = new Date();
    const timestamp =
        String(now.getDate()).padStart(2, '0') +
        String(now.getMonth() + 1).padStart(2, '0') +
        now.getFullYear() +
        '_' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
    // go to dashboard
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    
    // test MVP
    await page.getByRole('button', { name: 'Calendar Calendar' }).click();
    await page.getByRole('button', { name: 'Go Back' }).click();
    await page.getByRole('button', { name: 'Traveler Reviews Traveler' }).click();
    await page.getByRole('button', { name: 'Write a Review' }).click();
    await page.locator('div:nth-child(5) > .lucide > path').click();
    await page.getByRole('textbox', { name: 'Title (e.g., Hidden Gem in' }).click();
    await page.getByRole('textbox', { name: 'Title (e.g., Hidden Gem in' }).fill(`title_test_${timestamp}`);
    await page.getByRole('textbox', { name: 'Tell us about your experience' }).click();
    await page.getByRole('textbox', { name: 'Tell us about your experience' }).fill('Goodboi');
    await page.getByText('Click to upload a photoJPG,').click();
    await page.locator('input[type="file"]').setInputFiles('tests/files/JetrayProfilePicture.webp');
    // await page.locator('body').setInputFiles('einstein.jpg');
    await page.getByRole('button', { name: 'Post Review' }).click();
    await page.getByRole('button', { name: 'Go Back' }).click();
    
    // logout
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
});

test('update_profile', async ({ page }) => {
    const now = new Date();
    const timestamp =
        String(now.getDate()).padStart(2, '0') +
        String(now.getMonth() + 1).padStart(2, '0') +
        now.getFullYear() +
        '_' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');

    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'User Profile' }).click();
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill(`edithere_${timestamp}`);
    // await page.getByRole('textbox', { name: 'Last Name' }).fill(`edithere_${timestamp}`);
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByText(/You have been logged out./i)).toBeVisible();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
});
