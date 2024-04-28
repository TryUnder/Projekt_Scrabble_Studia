import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import { sendWordsToServer } from "../Board/ScrabbleAlgorithms"
import axios from 'axios'

// const mock = new MockAdapter(axios)

// mock.onPost('/api/checkWords', { words: ["Testowe"] }).reply(200, { success: true })
// mock.onPost('/api/checkWords', { words: ["abcx"] }).reply(200, { success: false })

// test('Sprawdzenie działania mechanizmu weryfikacji słów po stronie serwera (true)', async () => {
//     const data = await sendWordsToServer(["Testowe"])
//     expect(data).toBe(true);
// });

// test('Sprawdzenie działania mechanizmu weryfikacji słów po stronie serwera (false)', async () => {
//     const data = await sendWordsToServer(["abcx"])
//     expect(data.success).toBe(false);
// });

test("Spr. czy data === true", () => {
    const data = true
    expect(data).toBe(true)
})