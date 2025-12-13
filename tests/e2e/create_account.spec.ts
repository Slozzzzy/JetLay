import { test, expect } from '@playwright/test';

test('email_invalid', async ({ page }) => {
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('test@example.com')
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Qwer1234!');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText(/Registration Error/i)).toBeVisible();
});

test('password_case1', async ({ page }) => {
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com')
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('asdasdasd');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).dblclick();
    await expect(page.getByText(/Password Requirements/i)).toBeVisible();
    await page.waitForTimeout(3000);
});

test('password_case2', async ({ page }) => {
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com')
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('ASDASDASD');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).dblclick();
    await expect(page.getByText(/Password Requirements/i)).toBeVisible();
    await page.waitForTimeout(3000);
});

test('password_case3', async ({ page }) => {
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com')
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('asd12345');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).dblclick();
    await expect(page.getByText(/Password Requirements/i)).toBeVisible();
    await page.waitForTimeout(3000);
});

test('password_case4', async ({ page }) => {
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com')
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('ASD12345');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).dblclick();
    await expect(page.getByText(/Password Requirements/i)).toBeVisible();
    await page.waitForTimeout(3000);
});

test('password_case5', async ({ page }) => {
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com')
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('asdasdasd!');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).dblclick();
    await expect(page.getByText(/Password Requirements/i)).toBeVisible();
    await page.waitForTimeout(3000);
});

test('password_case6', async ({ page }) => {
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com')
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('ASDASDASD!');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).dblclick();
    await expect(page.getByText(/Password Requirements/i)).toBeVisible();
    await page.waitForTimeout(3000);
});

test('password_case7', async ({ page }) => {
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com')
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('asd12345!');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).dblclick();
    await expect(page.getByText(/Password Requirements/i)).toBeVisible();
    await page.waitForTimeout(3000);
});

test('password_case8', async ({ page }) => {
    await page.goto('https://jet-lay.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('asora1310@gmail.com')
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('ASD12345!');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Account' }).dblclick();
    await expect(page.getByText(/Password Requirements/i)).toBeVisible();
    await page.waitForTimeout(3000);
});

test('googleOAuth', async ({ page }) => {
    await page.goto('https://jet-lay.vercel.app/');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('button', { name: 'Google G Logo Sign up with' }).click();
    await page.getByText('Sign in with Google').click();
    await page.goto('https://jet-lay.vercel.app/');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('button', { name: 'Google G Logo Sign in with' }).click();
    await page.getByText('Sign in with Google').click();
});