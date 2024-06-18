export type DevicesState = {
	list: Devices[];
    uiDetails:{
        loadingDevices:boolean;
    }
};

export type Devices={
    id: string;
    verifiedName: string;
    phoneNumber: string;
    phoneNumberId: string;
    waid:string;
}
