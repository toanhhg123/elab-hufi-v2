export const appointments: any = [
  {
    id: 0,
    title: "Watercolor Landscape",
    startDate: new Date(1666083600*1000),
    endDate: new Date(1666094400*1000),
    ownerId: 1
  },
  {
    id: 1,
    title: "Monthly Planning",
    startDate: new Date(2022, 10, 28, 9, 30),
    endDate: new Date(2022, 10, 28, 11, 30),
    ownerId: 1
  },
  {
    id: 2,
    title: "Recruiting students",
    startDate: new Date(2022, 10, 9, 12, 0),
    endDate: new Date(2022, 10, 9, 13, 0),
    ownerId: 2
  },
  {
    id: 3,
    title: "Oil Painting",
    startDate: new Date(2022, 10, 18, 14, 30),
    endDate: new Date(2022, 10, 18, 15, 30),
    ownerId: 2
  },
  {
    id: 4,
    title: "Open Day",
    startDate: new Date(2022, 10, 20, 12, 0),
    endDate: new Date(2022, 10, 20, 13, 35),
    ownerId: 6
  },
  {
    id: 5,
    title: "Watercolor Landscape",
    startDate: new Date(2022, 6, 6, 13, 0),
    endDate: new Date(2022, 6, 6, 14, 0),
    rRule: "FREQ=WEEKLY;BYDAY=FR;UNTIL=20220816",
    exDate: "20220713T100000Z,20220727T100000Z",
    ownerId: 2
  },
  {
    id: 6,
    title: "Meeting of Instructors",
    startDate: new Date(2022, 5, 28, 12, 0),
    endDate: new Date(2022, 5, 28, 12, 30),
    rRule: "FREQ=WEEKLY;BYDAY=TH;UNTIL=20220727",
    exDate: "20220705T090000Z,20220719T090000Z",
    ownerId: 5
  },
  {
    id: 7,
    title: "Oil Painting for Beginners",
    startDate: new Date(2022, 6, 3, 11, 0),
    endDate: new Date(2022, 6, 3, 12, 0),
    rRule: "FREQ=WEEKLY;BYDAY=TU;UNTIL=20220801",
    exDate: "20220710T080000Z,20220724T080000Z",
    ownerId: 3
  },
  {
    id: 8,
    title: "Watercolor Workshop",
    startDate: new Date(2022, 6, 9, 11, 0),
    endDate: new Date(2022, 6, 9, 12, 0),
    ownerId: 3
  }
];
