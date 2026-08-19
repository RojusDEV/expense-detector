import { http, HttpResponse } from "msw";

export const handlers = [
  http.get(`${import.meta.env.VITE_BASE_URL}/subscriptions`, () => {
    return HttpResponse.json([
      {
        amount: 9.69,
        frequency_days: 30,
        from_date: "2026-03-27T22:00:00.000Z",
        id: "1",
        merchantName: "pildyk",
        name: "pildyk",
      },
      {
        amount: 115,
        frequency_days: 30,
        from_date: "2026-04-08T21:00:00.000Z",
        id: "2",
        merchantName: "bonodomo pay",
        name: "bonodomo pay",
      },
      {
        amount: 7.6,
        frequency_days: 30,
        from_date: "2026-04-30T21:00:00.000Z",
        id: "3",
        merchantName: "intelligent commun",
        name: "intelligent commun",
      },
    ]);
  }),
];
