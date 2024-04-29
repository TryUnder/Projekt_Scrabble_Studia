import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import supertest from 'supertest'
import { sendWordsToServer, checkNeighbourhood } from "../Board/ScrabbleAlgorithms"
import { initializeBoardData } from '../Board/BoardUtils'
import axios from 'axios'
import { request } from 'express'
// const app = require('../../index')

const mock = new MockAdapter(axios)

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

// test("Spr. czy data === true", () => {
//     const data = true
//     expect(data).toBe(true)
// })

test("Sprawdzenie sąsiedztwa dwóch wyrazów na planszy. Jeden ułożony w poprzedniej turze, drugi w kolejnej.", () => {
    var boardData = initializeBoardData()
    boardData[7][7].letter.value = "K"
    boardData[7][7].isAccepted = true
    boardData[7][8].letter.value = "O"
    boardData[7][8].isAccepted = true
    boardData[7][9].letter.value = "T"
    boardData[7][9].isAccepted = true

    boardData[6][8].letter.value = "M"
    boardData[6][8].isAccepted = false
    boardData[8][8].letter.value = "P"
    boardData[8][8].isAccepted = false

    const words = ["KOT", "MOP"]

    const result = checkNeighbourhood(words, boardData)
    expect(result).toBe(true)
}) 

describe("sendsWordsToServer function", () => {
    it("Should return true if words are found in the database", async () => {
        const mock = new MockAdapter(axios)
        const testData = ["Kot", "Płot"]

        mock.onPost('/api/checkWords').reply(200, { found: true })

        const result = await sendWordsToServer(testData)

        expect(result.found).toEqual(true);
    })
})

// describe('sendWordsToServer function', () => {
//     it('should return server response when words are sent successfully', async () => {
//       const testData = ['kupkjares'];
//       const url = '/api/checkWords';
  
//       const response = await axios.post(url, testData);
//         console.log(response.data)
//       expect(response.data).toBe(true);
//     });
// });

// describe('POST /api/checkWords', () => {
//     it("should send words to server and return server response", async () => {
//         const testData = ["kot"]
//         const response = await supertest(app)
//             .post('/api/checkWords')
//             .send(testData)

//         expect(response.status).toBe(200)
//         console.log("Server response: ", response.body)
//     })
// })