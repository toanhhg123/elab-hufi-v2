import { Genders, ResearchTeamTitles } from '../configs/enums';

export const dummyListMemberData: IResearcherType = {
    "Title": "Thành viên",
    "ResearcherId": "",
    "Fullname": "",
    "Birthdate": "",
    "formatedBirthdate": "",
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
    "listMember": IResearcherType[] | []
}

export const dummyResearchTeamData: IResearchTeamType = {
    "TeamId": -1,
    "TeamName": "",
    "Note": "",
    "listMember": []
}

export interface IResearcherType {
    "ResearcherId"?: string,
    "Fullname": string,
    "Gender": keyof typeof Genders,
    "Address": string,
    "Email": string,
    "PhoneNumber": string,
    "Organization": string,
    "GroupId"?: number,
    "GroupName"?: string,
    "Status"?: string,
    "Title"?: keyof typeof ResearchTeamTitles,
    "Birthdate": string | number,
    "formatedBirthdate"?: string,
}

export const dummyResearcherData: IResearcherType =  {
    "ResearcherId": "",
    "Fullname": "",
    "Birthdate": "",
    "Gender": "Nam",
    "Address": "",
    "Email": "",
    "PhoneNumber": "",
    "Organization": "",
    "GroupId": 0,
    "GroupName": "",
    "Status": ""
}