import { test, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { SESClient } from '@aws-sdk/client-ses';
import { handler } from './index.mjs';

const validBody = {
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  message: 'Hello\nthere',
};

let send;

beforeEach(() => {
  mock.restoreAll();
  send = mock.method(SESClient.prototype, 'send', async () => ({ MessageId: 'test' }));
});

const post = (body) => handler({ httpMethod: 'POST', body: JSON.stringify(body) });

const sentEmail = () => {
  assert.equal(send.mock.callCount(), 1);
  const { Body } = send.mock.calls[0].arguments[0].input.Message;
  return { text: Body.Text.Data, html: Body.Html.Data };
};

test('valid request sends an email with From, Email and Message and no Newsletter', async () => {
  const res = await post(validBody);

  assert.equal(res.statusCode, 200);
  const { text, html } = sentEmail();
  assert.match(text, /From: Test User/);
  assert.match(text, /Email: test@example\.com/);
  assert.match(text, /Message:\nHello\nthere/);
  assert.match(html, /<span class="label">From:<\/span> Test User/);
  assert.match(html, /<a href="mailto:test@example\.com">test@example\.com<\/a>/);
  assert.match(html, /<p>Hello<br>there<\/p>/);
  assert.doesNotMatch(text, /newsletter/i);
  assert.doesNotMatch(html, /newsletter/i);
});

test('an extra newsletter field from an old client is ignored', async () => {
  const res = await post({ ...validBody, newsletter: true });

  assert.equal(res.statusCode, 200);
  const { text, html } = sentEmail();
  assert.match(text, /From: Test User/);
  assert.doesNotMatch(text, /newsletter/i);
  assert.doesNotMatch(html, /newsletter/i);
});

test('a missing required field returns 400 without sending', async () => {
  const { message: _message, ...body } = validBody;
  const res = await post(body);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(JSON.parse(res.body), { error: 'Missing required fields' });
  assert.equal(send.mock.callCount(), 0);
});

const sentInput = () => {
  assert.equal(send.mock.callCount(), 1);
  return send.mock.calls[0].arguments[0].input;
};

test('the rest of the email (sender, recipients, subject) is unchanged', async () => {
  await post(validBody);

  const input = sentInput();
  assert.equal(input.Source, 'Gary Jiang Photography <noreply@gjphotos.com>');
  assert.deepEqual(input.ReplyToAddresses, ['bowengary@hotmail.com']);
  assert.deepEqual(input.Destination, { ToAddresses: ['bowengary@hotmail.com'] });
  assert.equal(input.Message.Subject.Data, 'New Contact Form Submission from Test User');
});

test('an extra newsletter field produces exactly the same email as without it', async () => {
  await post(validBody);
  const without = sentInput();
  send.mock.resetCalls();

  await post({ ...validBody, newsletter: true });
  assert.deepEqual(sentInput(), without);
});

for (const field of ['first_name', 'last_name', 'email', 'message']) {
  test(`missing ${field} returns 400 without sending`, async () => {
    const body = { ...validBody };
    delete body[field];
    const res = await post(body);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(JSON.parse(res.body), { error: 'Missing required fields' });
    assert.equal(send.mock.callCount(), 0);
  });
}

test('OPTIONS preflight returns 200 with CORS headers and does not send', async () => {
  const res = await handler({ httpMethod: 'OPTIONS' });

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['Access-Control-Allow-Origin'], '*');
  assert.equal(res.headers['Access-Control-Allow-Methods'], 'POST, OPTIONS');
  assert.equal(send.mock.callCount(), 0);
});

test('an SES failure returns 500', async () => {
  send.mock.mockImplementation(async () => {
    throw new Error('ses down');
  });
  mock.method(console, 'error', () => {});
  const res = await post(validBody);

  assert.equal(res.statusCode, 500);
  assert.equal(JSON.parse(res.body).error, 'Failed to send email');
});
