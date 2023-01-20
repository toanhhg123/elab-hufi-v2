import { Genders, ResearchTeamTitles } from '../configs/enums';

export interface IListMemberType {
    "Title": keyof typeof ResearchTeamTitles,
    "ResearcherId": string,
    "Fullname": string,
    "Birthday": string | number,
    "formatedBirthday"?: string,
    "Gender": keyof typeof Genders,
    "Address": string,
    "Email": string,
    "PhoneNumber": string,
    "Organization": string
}

export const dummyListMemberData: IListMemberType = {
    "Title": "Thành viên",
    "ResearcherId": "",
    "Fullname": "",
    "Birthday": "",
    "formatedBirthday": "",
    "Gender": "Nam",
    "Address": "",
    "Email": "",
    "PhoneNumber": "",
    "Organization": ""
}

export interface IResearchTeamType {
    "TeamId"?: number,
    "TeamName": string,
    "Note": string,
    "listMember": IListMemberType[] | []
}

export const dummyResearchTeamData: IResearchTeamType = {
    "TeamId": -1,
    "TeamName": "",
    "Note": "",
    "listMember": []
}
