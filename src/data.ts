import type { TrainingCardItem, TrainingCardSession, TrainingCardSessionResult } from './types';

export const TRAINING_CARD_ITEMS: TrainingCardItem[] = [
    {
        "id": "780867b8-66fc-4a25-91f5-9fc0ddef612d",
        "kiesermachine": "203fe1e4-60aa-9889-5261-000030a29edb",
        "kiesermachine_display": "Lumbar extension",
        "weight": 156,
        "seat": null,
        "pad": null,
        "rom": null,
        "trainingmode_display": null,
        "kiesermachinenotes": null
    },
    {
        "id": "7a2e0590-52c5-430a-bc63-119b86e94952",
        "kiesermachine": "744f7920-aa8a-68a8-9a03-000008be3dc9",
        "kiesermachine_display": "Seated row",
        "weight": 204,
        "seat": null,
        "pad": 5,
        "rom": "4-16",
        "trainingmode_display": null,
        "kiesermachinenotes": null
    },
    {
        "id": "da7648ed-165f-4027-92de-7c79b8d90290",
        "kiesermachine": "06c7c8aa-03c2-f728-fb75-0000048e315b",
        "kiesermachine_display": "Leg Press",
        "weight": 420,
        "seat": 18,
        "pad": 8,
        "rom": null,
        "trainingmode_display": "Bilateral",
        "kiesermachinenotes": "change pad to 7"
    },
    {
        "id": "040178c8-242e-4e65-b133-3703f5e7b7b2",
        "kiesermachine": "7c3319b6-35da-dbe9-5b58-0000175cb159",
        "kiesermachine_display": "Hip abduction",
        "weight": 92,
        "seat": null,
        "pad": 1,
        "rom": null,
        "trainingmode_display": null,
        "kiesermachinenotes": null
    },
    {
        "id": "c837334b-e2a4-4122-82b7-dd08f4affb70",
        "kiesermachine": "45464fde-5fcc-8fe8-6b8a-000028444863",
        "kiesermachine_display": "Chest press",
        "weight": 180,
        "seat": 5,
        "pad": null,
        "rom": null,
        "trainingmode_display": null,
        "kiesermachinenotes": "Start at 100 pound. AW"
    },
    {
        "id": "ca62b376-72ee-40e9-a717-0c7e506eede3",
        "kiesermachine": "7e64bbe6-bd05-8ee9-ba71-000024173f4d",
        "kiesermachine_display": "Shoulder shrugs",
        "weight": 150,
        "seat": 5,
        "pad": null,
        "rom": "6",
        "trainingmode_display": "Bilateral",
        "kiesermachinenotes": null
    },
    {
        "id": "ee27378f-a113-4bc4-9a54-c85966b92500",
        "kiesermachine": "3a6b3027-910d-08e8-7270-000034d30c1d",
        "kiesermachine_display": "Abdominal flexion",
        "weight": 66,
        "seat": null,
        "pad": null,
        "rom": null,
        "trainingmode_display": null,
        "kiesermachinenotes": "Start at 40 lbs."
    },
    {
        "id": "980d0db2-a035-466d-9bea-279207a7d9aa",
        "kiesermachine": "51daac02-0f6d-14e9-c36b-0000272f5710",
        "kiesermachine_display": "Shoulder external rotation",
        "weight": null,
        "seat": 9,
        "pad": null,
        "rom": null,
        "trainingmode_display": null,
        "kiesermachinenotes": "Lever forward handle down"
    },
    {
        "id": "a0fa2d44-8460-4e42-bd53-066168af465f",
        "kiesermachine": "0bc9d210-a632-51a9-8b97-00002ce15c21",
        "kiesermachine_display": "Cervical extension",
        "weight": 102,
        "seat": 6,
        "pad": 16,
        "rom": null,
        "trainingmode_display": "Bilateral",
        "kiesermachinenotes": null
    },
    {
        "id": "f1cf3038-6741-44c3-9915-522ba0140291",
        "kiesermachine": "560d8a52-5b4a-a5a8-da16-00000efe1930",
        "kiesermachine_display": "Leg curl",
        "weight": 80,
        "seat": null,
        "pad": 1,
        "rom": "20",
        "trainingmode_display": "Bilateral",
        "kiesermachinenotes": null
    },
    {
        "id": "e6f0fe80-04ed-4b4e-8beb-8e3f6b3cef93",
        "kiesermachine": "321b1fa2-6195-4a88-fb7e-00004d71dbcd",
        "kiesermachine_display": "Leg extension",
        "weight": 80,
        "seat": null,
        "pad": 2,
        "rom": null,
        "trainingmode_display": "Bilateral",
        "kiesermachinenotes": null
    }
];

export const SESSIONS: TrainingCardSession[] = [
    {
        "id": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "sessiondate": "2026-02-07",
        "sessiontimestart": "11:23:52",
        "sessiontimeend": "12:08:35",
        "rpe": 13,
        "iskieserled": false,
        "recordstate_name": "Complete"
    },
    {
        "id": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "sessiondate": "2026-02-05",
        "sessiontimestart": "18:57:15",
        "sessiontimeend": "19:37:31",
        "rpe": 12,
        "iskieserled": true,
        "recordstate_name": "Complete"
    },
    {
        "id": "7199b6b0-5d53-4f18-b075-3212e04fa300",
        "sessiondate": "2026-02-02",
        "sessiontimestart": "07:17:47",
        "sessiontimeend": "07:50:17",
        "rpe": 12,
        "iskieserled": false,
        "recordstate_name": "Complete"
    }
];

export const RESULTS: TrainingCardSessionResult[] = [
    {
        "kiesermachine": "744f7920-aa8a-68a8-9a03-000008be3dc9",
        "id": "ab031dab-1f04-4065-80c9-512542a99ab6",
        "weight": "204",
        "timeinterval": 104,
        "utcstart": 1770426507,
        "trainingcardsession": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "trainingcardsession_sessiondate": "2026-02-07"
    },
    {
        "kiesermachine": "06c7c8aa-03c2-f728-fb75-0000048e315b",
        "id": "ffb659d3-713c-425c-8c17-16999ec89a41",
        "weight": "420",
        "timeinterval": 113,
        "utcstart": 1770426115,
        "trainingcardsession": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "trainingcardsession_sessiondate": "2026-02-07"
    },
    {
        "kiesermachine": "51daac02-0f6d-14e9-c36b-0000272f5710",
        "id": "a9ea4391-e84d-4c2d-a9ee-839e3c02ffa1",
        "weight": "106",
        "timeinterval": 115,
        "utcstart": 1770425907,
        "trainingcardsession": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "trainingcardsession_sessiondate": "2026-02-07"
    },
    {
        "kiesermachine": "0bc9d210-a632-51a9-8b97-00002ce15c21",
        "id": "b85c1a8f-9568-40da-b192-d680e1af89b2",
        "weight": "102",
        "timeinterval": 110,
        "utcstart": 1770425592,
        "trainingcardsession": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "trainingcardsession_sessiondate": "2026-02-07"
    },
    {
        "kiesermachine": "7e64bbe6-bd05-8ee9-ba71-000024173f4d",
        "id": "c9610b56-da82-4590-862e-1e017181ec4f",
        "weight": "150",
        "timeinterval": 111,
        "utcstart": 1770425410,
        "trainingcardsession": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "trainingcardsession_sessiondate": "2026-02-07"
    },
    {
        "kiesermachine": "45464fde-5fcc-8fe8-6b8a-000028444863",
        "id": "3c9e45b8-985a-4aef-8e89-e1022c3c18c9",
        "weight": "180",
        "timeinterval": 101,
        "utcstart": 1770425211,
        "trainingcardsession": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "trainingcardsession_sessiondate": "2026-02-07"
    },
    {
        "kiesermachine": "560d8a52-5b4a-a5a8-da16-00000efe1930",
        "id": "e1badf24-7a86-4bda-8113-5ce3f1213788",
        "weight": "80",
        "timeinterval": 136,
        "utcstart": 1770425005,
        "trainingcardsession": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "trainingcardsession_sessiondate": "2026-02-07"
    },
    {
        "kiesermachine": "321b1fa2-6195-4a88-fb7e-00004d71dbcd",
        "id": "ce0d50f1-a147-4fe4-9cfb-8b3faa0867fc",
        "weight": "80",
        "timeinterval": 116,
        "utcstart": 1770424705,
        "trainingcardsession": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "trainingcardsession_sessiondate": "2026-02-07"
    },
    {
        "kiesermachine": "3a6b3027-910d-08e8-7270-000034d30c1d",
        "id": "3382a023-f94d-4bd8-a8cf-ba1fd45b25c4",
        "weight": "66",
        "timeinterval": 98,
        "utcstart": 1770424480,
        "trainingcardsession": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "trainingcardsession_sessiondate": "2026-02-07"
    },
    {
        "kiesermachine": "7c3319b6-35da-dbe9-5b58-0000175cb159",
        "id": "4cab870b-92c5-4246-8784-43281c1d8cb7",
        "weight": "92",
        "timeinterval": 94,
        "utcstart": 1770424229,
        "trainingcardsession": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "trainingcardsession_sessiondate": "2026-02-07"
    },
    {
        "kiesermachine": "203fe1e4-60aa-9889-5261-000030a29edb",
        "id": "dab849e2-7a93-4c1c-afad-8458fa966c8f",
        "weight": "154",
        "timeinterval": 113,
        "utcstart": 1770424035,
        "trainingcardsession": "86079fe6-c5cc-4be5-8e8d-13be0642de63",
        "trainingcardsession_sessiondate": "2026-02-07"
    },
    {
        "kiesermachine": "45464fde-5fcc-8fe8-6b8a-000028444863",
        "id": "91d1f0a4-a64c-458b-8a0d-c9fce89ce067",
        "weight": "180",
        "timeinterval": 104,
        "utcstart": 1770280645,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "3a6b3027-910d-08e8-7270-000034d30c1d",
        "id": "ae5118a0-e032-424c-9d25-8902bb6d9679",
        "weight": "66",
        "timeinterval": 88,
        "utcstart": 1770280445,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "51daac02-0f6d-14e9-c36b-0000272f5710",
        "id": "8a03e045-25f8-4c1c-be16-e77f699e60d8",
        "weight": "106",
        "timeinterval": 102,
        "utcstart": 1770280269,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "51daac02-0f6d-14e9-c36b-0000272f5710",
        "id": "d98833cd-fb8d-4a43-a59b-8eac245a7cbc",
        "weight": "106",
        "timeinterval": 106,
        "utcstart": 1770280139,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "0bc9d210-a632-51a9-8b97-00002ce15c21",
        "id": "7f3c9f30-bd80-41cb-b148-4700fd041ea1",
        "weight": "102",
        "timeinterval": 96,
        "utcstart": 1770279968,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "7e64bbe6-bd05-8ee9-ba71-000024173f4d",
        "id": "b35ee8ef-fe1b-40ea-9729-393e9baab1f5",
        "weight": "150",
        "timeinterval": 111,
        "utcstart": 1770279810,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "7c3319b6-35da-dbe9-5b58-0000175cb159",
        "id": "c99ab02c-abae-4fdb-b22e-f58d927693a2",
        "weight": "92",
        "timeinterval": 86,
        "utcstart": 1770279603,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "06c7c8aa-03c2-f728-fb75-0000048e315b",
        "id": "000e4d01-5527-472b-9f67-7ace462c325f",
        "weight": "410",
        "timeinterval": 125,
        "utcstart": 1770279430,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "744f7920-aa8a-68a8-9a03-000008be3dc9",
        "id": "a5602a3c-08a3-4705-b63f-d2fb027d0184",
        "weight": "204",
        "timeinterval": 99,
        "utcstart": 1770279189,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "203fe1e4-60aa-9889-5261-000030a29edb",
        "id": "063faee7-7289-4eff-8764-e84fcb1b5a07",
        "weight": "154",
        "timeinterval": 104,
        "utcstart": 1770279008,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "321b1fa2-6195-4a88-fb7e-00004d71dbcd",
        "id": "bb5a51e0-98f3-47d5-8f49-955698284a7f",
        "weight": "80",
        "timeinterval": 1,
        "utcstart": 1770278684,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "560d8a52-5b4a-a5a8-da16-00000efe1930",
        "id": "a8950acf-66e2-4771-ab03-0f2073922cc5",
        "weight": "80",
        "timeinterval": 14,
        "utcstart": 1770278570,
        "trainingcardsession": "8464de4c-9950-4689-a7dd-3a49b9cacd11",
        "trainingcardsession_sessiondate": "2026-02-05"
    },
    {
        "kiesermachine": "51daac02-0f6d-14e9-c36b-0000272f5710",
        "id": "b6f1dc59-0cd9-4691-abba-ed43087fcc07",
        "weight": "106",
        "timeinterval": 106,
        "utcstart": 1769979010,
        "trainingcardsession": "7199b6b0-5d53-4f18-b075-3212e04fa300",
        "trainingcardsession_sessiondate": "2026-02-02"
    },
    {
        "kiesermachine": "51daac02-0f6d-14e9-c36b-0000272f5710",
        "id": "b5d565db-e568-4036-adce-fabd3d94627f",
        "weight": "106",
        "timeinterval": 93,
        "utcstart": 1769978866,
        "trainingcardsession": "7199b6b0-5d53-4f18-b075-3212e04fa300",
        "trainingcardsession_sessiondate": "2026-02-02"
    }
];
